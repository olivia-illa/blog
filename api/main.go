// apples: the tiny API behind the 🍏 → 🍎 → 🥧 reaction on each post.
//
// Every browser picks a random visitor id and reports its current state for
// a post; the server keeps one row per (post, visitor) so cycling through the
// emojis changes that visitor's vote instead of adding new ones.
//
//	GET /api/apples?post=/2026/06/22/free-lunch.html  → {"post":…,"red":3,"pie":1}
//	GET /api/apples                                    → all posts, most loved first
//	PUT /api/apples {"post":…,"visitor":<32 hex>,"state":0|1|2} → counts for that post
package main

import (
	"database/sql"
	"encoding/json"
	"errors"
	"flag"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	_ "modernc.org/sqlite"
)

var visitorRe = regexp.MustCompile(`^[0-9a-f]{32}$`)

type counts struct {
	Post string `json:"post"`
	Red  int    `json:"red"`
	Pie  int    `json:"pie"`
}

type vote struct {
	Post    string `json:"post"`
	Visitor string `json:"visitor"`
	State   int    `json:"state"`
}

type server struct {
	db       *sql.DB
	siteRoot string
}

func main() {
	listen := flag.String("listen", "127.0.0.1:8090", "address to listen on")
	dbPath := flag.String("db", "apples.sqlite3", "SQLite database file")
	siteRoot := flag.String("site", "", "built site directory; votes are only accepted for pages that exist in it (empty: accept any path)")
	flag.Parse()

	db, err := sql.Open("sqlite", "file:"+*dbPath+"?_pragma=journal_mode(WAL)&_pragma=busy_timeout(5000)")
	if err != nil {
		log.Fatal(err)
	}
	db.SetMaxOpenConns(1)
	if _, err := db.Exec(`CREATE TABLE IF NOT EXISTS votes (
		post       TEXT    NOT NULL,
		visitor    TEXT    NOT NULL,
		state      INTEGER NOT NULL CHECK (state IN (1, 2)),
		updated_at INTEGER NOT NULL,
		PRIMARY KEY (post, visitor)
	) WITHOUT ROWID`); err != nil {
		log.Fatal(err)
	}

	s := &server{db: db, siteRoot: *siteRoot}
	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/apples", s.get)
	mux.HandleFunc("PUT /api/apples", s.put)

	srv := &http.Server{
		Addr:              *listen,
		Handler:           mux,
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      10 * time.Second,
	}
	log.Printf("listening on %s", *listen)
	log.Fatal(srv.ListenAndServe())
}

// validPost accepts page URLs as Jekyll renders them (/2026/06/22/x.html or
// a directory ending in /) and, with -site, only pages that were built.
func (s *server) validPost(p string) bool {
	if len(p) < 2 || len(p) > 300 || p[0] != '/' ||
		strings.Contains(p, "..") || strings.Contains(p, "//") || strings.ContainsAny(p, "\\\x00?#") {
		return false
	}
	if !strings.HasSuffix(p, ".html") && !strings.HasSuffix(p, "/") {
		return false
	}
	if s.siteRoot == "" {
		return true
	}
	file := filepath.Join(s.siteRoot, filepath.FromSlash(p))
	if strings.HasSuffix(p, "/") {
		file = filepath.Join(file, "index.html")
	}
	info, err := os.Stat(file)
	return err == nil && info.Mode().IsRegular()
}

func (s *server) countsFor(post string) (counts, error) {
	c := counts{Post: post}
	err := s.db.QueryRow(`SELECT
		coalesce(sum(state = 1), 0), coalesce(sum(state = 2), 0)
		FROM votes WHERE post = ?`, post).Scan(&c.Red, &c.Pie)
	return c, err
}

func (s *server) get(w http.ResponseWriter, r *http.Request) {
	if post := r.URL.Query().Get("post"); post != "" {
		if !s.validPost(post) {
			http.Error(w, "unknown post", http.StatusNotFound)
			return
		}
		c, err := s.countsFor(post)
		if err != nil {
			serverError(w, err)
			return
		}
		writeJSON(w, c)
		return
	}

	rows, err := s.db.Query(`SELECT post, sum(state = 1) AS red, sum(state = 2) AS pie
		FROM votes GROUP BY post ORDER BY red + pie DESC, pie DESC, post`)
	if err != nil {
		serverError(w, err)
		return
	}
	defer rows.Close()
	all := []counts{}
	for rows.Next() {
		var c counts
		if err := rows.Scan(&c.Post, &c.Red, &c.Pie); err != nil {
			serverError(w, err)
			return
		}
		all = append(all, c)
	}
	if err := rows.Err(); err != nil {
		serverError(w, err)
		return
	}
	writeJSON(w, all)
}

func (s *server) put(w http.ResponseWriter, r *http.Request) {
	var v vote
	dec := json.NewDecoder(http.MaxBytesReader(w, r.Body, 1024))
	dec.DisallowUnknownFields()
	if err := dec.Decode(&v); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	if !visitorRe.MatchString(v.Visitor) || v.State < 0 || v.State > 2 {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	if !s.validPost(v.Post) {
		http.Error(w, "unknown post", http.StatusNotFound)
		return
	}

	var err error
	if v.State == 0 {
		_, err = s.db.Exec(`DELETE FROM votes WHERE post = ? AND visitor = ?`, v.Post, v.Visitor)
	} else {
		_, err = s.db.Exec(`INSERT INTO votes (post, visitor, state, updated_at) VALUES (?, ?, ?, ?)
			ON CONFLICT (post, visitor) DO UPDATE SET state = excluded.state, updated_at = excluded.updated_at`,
			v.Post, v.Visitor, v.State, time.Now().Unix())
	}
	if err != nil {
		serverError(w, err)
		return
	}
	c, err := s.countsFor(v.Post)
	if err != nil {
		serverError(w, err)
		return
	}
	writeJSON(w, c)
}

func writeJSON(w http.ResponseWriter, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-store")
	if err := json.NewEncoder(w).Encode(v); err != nil && !errors.Is(err, http.ErrHandlerTimeout) {
		log.Print(err)
	}
}

func serverError(w http.ResponseWriter, err error) {
	log.Print(err)
	http.Error(w, "internal error", http.StatusInternalServerError)
}
