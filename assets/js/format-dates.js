// Re-renders every <time class="js-format-date"> in the reader's browser.
//
// Jekyll bakes a fixed "%d %B %Y %H:%M" string into the page at build time;
// this replaces it with the same date run through Intl, so the text matches
// what the browser considers correct rather than what the build host did.
// The <time datetime="..."> attribute stays authoritative either way.
(function () {
  var dateEls = document.querySelectorAll('.js-format-date');
  if (!dateEls.length) return;

  var formatter = new Intl.DateTimeFormat('en-GB', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  dateEls.forEach(function (timeEl) {
    var iso = timeEl.getAttribute('datetime');
    if (!iso) return;
    var date = new Date(iso);
    if (isNaN(date.getTime())) return;
    timeEl.textContent = formatter.format(date);
  });
})();
