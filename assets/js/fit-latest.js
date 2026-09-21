// Trims the home page's "latest" list to whole rows that fit on screen.
//
// While the home page is locked to one screen, that column is not allowed to
// scroll: its intro and its "see more →" link stay put, so anything Jekyll
// rendered past the bottom of the column would be clipped mid-row. This hides
// trailing <li>s until the list fits its box, and re-measures whenever the
// column changes size (resize, zoom, late webfont).
(function () {
  var list = document.querySelector('.js-fit-list');
  if (!list) return;

  var column = list.closest('.latest-col') || list.parentNode;
  var items = Array.prototype.slice.call(list.children);
  var measuring = false;

  function fit() {
    // Hiding rows can resize the column, which would call us straight back.
    if (measuring) return;
    measuring = true;

    items.forEach(function (item) {
      item.hidden = false;
    });

    // Small or short viewports let the page scroll normally, so there is no
    // fixed height to fit into and every row should show. The stylesheet owns
    // that threshold — it only clips this column while the page is locked —
    // so ask the column rather than restate the media query here.
    if (getComputedStyle(column).overflowY !== 'hidden') {
      measuring = false;
      return;
    }

    // Measure against the whole column: the list normally hugs its rows, so
    // stretch it over the free space first to learn how much room there is.
    list.style.flexGrow = '1';

    // Walk back from the last row: the first measurement that fits wins.
    for (var i = items.length - 1; i >= 0; i--) {
      if (list.scrollHeight <= list.clientHeight) break;
      items[i].hidden = true;
    }

    list.style.flexGrow = '';

    measuring = false;
  }

  fit();

  if (window.ResizeObserver) {
    new ResizeObserver(fit).observe(column);
  } else {
    window.addEventListener('resize', fit);
  }

  // Webfonts land after first paint and change every row's height.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fit);
  }
})();
