(function () {
  var button = document.querySelector('.apple-reaction');
  if (!button) return;
  var post = button.getAttribute('data-post');
  var storageKey = 'post-like:' + post;
  // The state the server last confirmed for this post, so a vote that failed
  // to send (offline, or cast before the API existed) is retried next visit.
  var syncedKey = 'post-like-synced:' + post;
  var emojis = ['🍏', '🍎', '🥧'];
  var names = ['green apple', 'red apple', 'pie'];
  var state = 0;
  var pieCaption = document.querySelector('.pie-caption');
  var api = button.getAttribute('data-api') || '/api/apples';
  // Local previews show the live counts but must not vote.
  var readOnly = button.hasAttribute('data-read-only');

  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }

  function load(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  // One random id per browser, so cycling the emoji changes this reader's
  // vote instead of adding another one.
  function visitorId() {
    var id = load('apple-visitor');
    if (id && /^[0-9a-f]{32}$/.test(id)) return id;
    if (!window.crypto || !crypto.getRandomValues) return null;
    var bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    id = Array.prototype.map.call(bytes, function (b) {
      return ('0' + b.toString(16)).slice(-2);
    }).join('');
    store('apple-visitor', id);
    return id;
  }

  // Everyone's votes for this post, as last reported by the server.
  var counts = null;
  var countKeys = [null, 'red', 'pie'];

  function render() {
    button.textContent = emojis[state];
    renderCount();
    if (pieCaption) pieCaption.hidden = state !== 2;
    button.setAttribute('aria-label', 'Reaction: ' + names[state] + '. Change to ' + names[(state + 1) % emojis.length]);
  }

  // Only the count for the emoji this reader has selected, shown as the
  // button's hover tooltip; the green apple is "no vote", so it shows nothing.
  function renderCount() {
    var n = counts && countKeys[state] ? counts[countKeys[state]] : 0;
    if (n > 0) {
      button.title = n + (n === 1 ? ' reader' : ' readers') + ' picked the ' + names[state];
    } else {
      button.removeAttribute('title');
    }
  }

  function setCounts(c) {
    counts = c;
    renderCount();
  }

  // The API only exists on the self-hosted site; anywhere else (local
  // preview, GitHub Pages) these requests fail quietly and the button keeps
  // working from localStorage alone.
  function request(method, body) {
    if (!window.fetch) return Promise.reject();
    var url = method === 'GET' ? api + '?post=' + encodeURIComponent(post) : api;
    return fetch(url, {
      method: method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined
    }).then(function (res) {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    });
  }

  function send(sentState) {
    if (readOnly) return;
    var visitor = visitorId();
    if (!visitor) return;
    request('PUT', { post: post, visitor: visitor, state: sentState })
      .then(function (c) {
        store(syncedKey, String(sentState));
        // A newer click may have gone out meanwhile; its response wins.
        if (sentState === state) setCounts(c);
      })
      .catch(function () {});
  }

  var saved = load(storageKey);
  if (saved === 'true') state = 1;
  else if (saved === '1' || saved === '2') state = Number(saved);
  render();

  if (!readOnly && (load(syncedKey) || '0') !== String(state)) {
    send(state);
  } else {
    request('GET').then(setCounts).catch(function () {});
  }

  button.addEventListener('click', function () {
    var previous = state;
    state = (state + 1) % emojis.length;
    // Move this reader's vote right away instead of waiting for the server.
    if (counts && !readOnly) {
      if (countKeys[previous]) counts[countKeys[previous]]--;
      if (countKeys[state]) counts[countKeys[state]]++;
    }
    render();
    store(storageKey, String(state));
    send(state);
  });
})();
