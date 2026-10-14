// Lets the reader pick a colour scheme from the circles in the footer.
//
// The pick is stored in localStorage and set as data-theme on <html>; the
// schemes themselves are the :root[data-theme] blocks at the top of
// assets/css/style.css. "Auto" (data-scheme="") removes both, handing the
// choice back to the system preference (light, or "red" in dark mode). The
// inline script in _layouts/default.html re-applies a stored pick before first
// paint on every page; keep its list of schemes in step with SCHEMES here.
(function () {
  var SCHEMES = ['light', 'red', 'olive'];
  var picker = document.querySelector('.theme-picker');
  if (!picker) return;

  var root = document.documentElement;
  var swatches = Array.prototype.slice.call(picker.querySelectorAll('.theme-swatch'));

  function mark(scheme) {
    swatches.forEach(function (swatch) {
      swatch.setAttribute('aria-pressed', String(swatch.dataset.scheme === scheme));
    });
  }

  var current = root.dataset.theme;
  mark(SCHEMES.indexOf(current) === -1 ? '' : current);

  picker.addEventListener('click', function (event) {
    var swatch = event.target.closest('.theme-swatch');
    if (!swatch) return;

    var scheme = swatch.dataset.scheme;
    if (scheme) {
      root.dataset.theme = scheme;
    } else {
      delete root.dataset.theme;
    }
    mark(scheme);

    // Storage can be unavailable (private windows, blocked site data); the
    // pick then just lasts for this page.
    try {
      if (scheme) {
        localStorage.setItem('theme', scheme);
      } else {
        localStorage.removeItem('theme');
      }
    } catch (e) {}
  });

  // Hidden in the markup so readers without JS never see dead controls.
  picker.hidden = false;
})();
