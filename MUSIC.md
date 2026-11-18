# Adding to the music shelves

Edit `_data/music.yml` to add, remove, or reorder music. Each entry starts with `- title:`. Entries appear in file order within their shelf.

- `format: Song` and `shelf: singles` place a song on the top shelf.
- `format: Album` and `shelf: albums` place an album on the bottom shelf.
- The page shows the title above the cover. Clicking the cover opens `url`.
- `artist` identifies the performer and is included in the accessible link label.
- `year` is optional. `note` can store your own text, but neither is currently displayed.

## Copy an entry

```yaml
- title: "Song title"
  artist: "Artist name"
  format: Song
  url: https://open.spotify.com/track/PASTE_TRACK_ID_HERE
  cover: /assets/images/music/song-cover.jpg
  shelf: singles
  note: "Your optional notes here."
```

For an album, change `format` to `Album` and `shelf` to `albums`:

```yaml
- title: "Album title"
  artist: "Artist name"
  format: Album
  url: https://open.spotify.com/album/PASTE_ALBUM_ID_HERE
  cover: /assets/images/music/album-cover.jpg
  shelf: albums
  note: ""
```

Replace the example URL and image path before saving. Paste a direct Spotify song or album link from its Share menu. Use `/track/` links for songs and `/album/` links for albums; avoid `/search/` links so visitors land on the release itself. Spotify may still require them to press Play.

Keep indentation consistent: two spaces before each field after the title. Double quotes are useful for titles with punctuation; escape any double quote inside the text as `\"`.

## Where to get cover images

Prefer the original square album artwork, rather than a screenshot or a shop mockup. Check that you have the rights or permission needed to use the image.

1. **Artist or record label:** look for an official album page, press kit, or downloadable artwork. Store product images sometimes include borders, download symbols, or packaging, so inspect them first.
2. **Apple’s music catalogue:** use the public search endpoint to find artwork. For example, open [the Bewitched album search](https://itunes.apple.com/search?term=Bewitched%20Laufey&entity=album&limit=5). Replace the search terms; use `entity=album` for albums or `entity=song` for songs. Match both the artist and release title, then copy the result’s `artworkUrl100` value. Many existing entries use these image URLs with `100x100bb` changed to `600x600bb`; check the larger URL loads correctly.
3. **Spotify:** its album page is useful for confirming the release and copying the listening link. Use the original artwork from an authorized source rather than cropping a screenshot of the app.

You can put a remote `https://...` image URL directly in `cover`. Remote URLs may change, so a local image is easier to maintain: create `assets/images/music/`, save the cover there with a descriptive filename, and use `/assets/images/music/filename.jpg` in the entry. The example folder is not created until you add an image.

If artwork needs adjusting, optional `cover_scale` and `cover_offset_x` fields control zoom and horizontal offset. Normally omit both so the full square artwork is shown:

```yaml
  cover_scale: 1
  cover_offset_x: 0%
```

## Preview

With the local Jekyll server running, open [the music page](http://0.0.0.0:4000/music/). Wait for the rebuild, then refresh. Check the title, cover, listening link, and correct shelf. Each shelf scrolls horizontally when its contents exceed the screen width.
