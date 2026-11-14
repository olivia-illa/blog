(function () {
  var button = document.querySelector('.apple-reaction');
  if (!button) return;
  var storageKey = 'post-like:' + button.getAttribute('data-post');
  var emojis = ['🍏', '🍎', '🥧'];
  var names = ['green apple', 'red apple', 'pie'];
  var state = 0;
  var pieCaption = document.querySelector('.pie-caption');

  function render() {
    button.textContent = emojis[state];
    if (pieCaption) pieCaption.hidden = state !== 2;
    button.setAttribute('aria-label', 'Reaction: ' + names[state] + '. Change to ' + names[(state + 1) % emojis.length]);
  }

  try {
    var saved = localStorage.getItem(storageKey);
    if (saved === 'true') state = 1;
    else if (saved === '1' || saved === '2') state = Number(saved);
  } catch (e) {}
  render();

  button.addEventListener('click', function () {
    state = (state + 1) % emojis.length;
    render();
    try { localStorage.setItem(storageKey, String(state)); } catch (e) {}
  });
})();
