// Lets the reader pick a colour scheme from the flowers in the footer.
//
// The pick is stored in localStorage and set as data-theme on <html>; the
// schemes themselves are the :root[data-theme] blocks at the top of
// assets/css/style.css. "Auto" (data-scheme="") removes both, handing the
// choice back to the system preference (light, or "red" in dark mode). The
// inline script in _layouts/default.html re-applies a stored pick before first
// paint on every page; keep its list of schemes in step with SCHEMES here.
//
// "custom" is the tuner: a panel of colour inputs, one per token, applied
// live as inline custom properties on <html> and stored as JSON under
// 'theme-custom'. The panel also prints the equivalent :root[data-theme]
// block, so a scheme tuned here can be pasted into style.css as a fixed one.
// It is an authoring tool: default.html only renders its swatch in drafts
// mode, and without the swatch a stored "custom" pick falls back to Auto.
(function () {
  var SCHEMES = ['lombard', 'birthday', 'sakura'];
  var CUSTOM_KEY = 'theme-custom';

  // Every colour token in style.css, in the order the panel shows them.
  var TOKENS = [
    ['--bg-color',          'Background'],
    ['--text-color',        'Text'],
    ['--link-color',        'Links'],
    ['--header-color',      'Headings'],
    ['--footer-color',      'Footer'],
    ['--section-border',    'Section border'],
    ['--link-hover-bg',     'Hover wipe'],
    ['--link-hover-color',  'Text on hover'],
    ['--quote-color',       'Quote text'],
    ['--meta-color',        'Meta text'],
    ['--date-muted-color',  'Dates'],
    ['--row-border-color',  'Row border']
  ];

  var picker = document.querySelector('.theme-picker');
  if (!picker) return;

  var root = document.documentElement;
  var swatches = Array.prototype.slice.call(picker.querySelectorAll('.theme-swatch'));
  if (picker.querySelector('.theme-swatch[data-scheme="custom"]')) SCHEMES.push('custom');
  var tuner = null;   // built lazily, the first time "custom" is picked
  var inputs = {};
  var cssOut = null;
  var startFrom = null;

  function mark(scheme) {
    swatches.forEach(function (swatch) {
      swatch.setAttribute('aria-pressed', String(swatch.dataset.scheme === scheme));
    });
  }

  function store(key, value) {
    // Storage can be unavailable (private windows, blocked site data); the
    // pick then just lasts for this page.
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (e) {}
  }

  function load(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  /* ---- colour helpers ------------------------------------------------- */

  function hex2(n) {
    var s = Math.round(n).toString(16);
    return s.length === 1 ? '0' + s : s;
  }

  // Resolves any CSS colour string to "#rrggbb" by letting the browser parse
  // it. Translucent colours are composited over `over`, since <input
  // type="color"> can't hold an alpha channel.
  function toHex(value, over) {
    var probe = document.createElement('span');
    probe.style.color = value;
    document.body.appendChild(probe);
    var rgb = getComputedStyle(probe).color;
    probe.remove();
    var m = /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?/.exec(rgb);
    if (!m) return '#000000';
    var a = m[4] === undefined ? 1 : parseFloat(m[4]) / (/%$/.test(m[4]) ? 100 : 1);
    var base = over ? [parseInt(over.slice(1, 3), 16), parseInt(over.slice(3, 5), 16), parseInt(over.slice(5, 7), 16)] : [0, 0, 0];
    var out = [1, 2, 3].map(function (i, j) {
      return hex2(parseFloat(m[i]) * a + base[j] * (1 - a));
    });
    return '#' + out.join('');
  }

  function luminance(hex) {
    var c = [1, 3, 5].map(function (i) {
      var v = parseInt(hex.slice(i, i + 2), 16) / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }

  // Reads the token values a given fixed scheme resolves to. The attribute
  // swap is synchronous, so nothing paints in between.
  function valuesOf(scheme) {
    var saved = root.dataset.theme;
    var savedInline = root.getAttribute('style');
    root.removeAttribute('style');
    if (scheme) { root.dataset.theme = scheme; } else { delete root.dataset.theme; }
    var cs = getComputedStyle(root);
    var bg = toHex(cs.getPropertyValue('--bg-color').trim());
    var out = {};
    TOKENS.forEach(function (t) {
      out[t[0]] = toHex(cs.getPropertyValue(t[0]).trim(), bg);
    });
    if (saved) { root.dataset.theme = saved; } else { delete root.dataset.theme; }
    if (savedInline) root.setAttribute('style', savedInline);
    return out;
  }

  /* ---- applying the custom scheme ------------------------------------ */

  // Form controls and scrollbars follow the background's lightness.
  function schemeFor(values) {
    return luminance(values['--bg-color']) < 0.3 ? 'dark' : 'light';
  }

  function applyCustom(values) {
    TOKENS.forEach(function (t) {
      root.style.setProperty(t[0], values[t[0]]);
    });
    root.style.setProperty('color-scheme', schemeFor(values));
  }

  function clearCustom() {
    TOKENS.forEach(function (t) { root.style.removeProperty(t[0]); });
    root.style.removeProperty('color-scheme');
  }

  function currentValues() {
    var out = {};
    TOKENS.forEach(function (t) { out[t[0]] = inputs[t[0]].value; });
    return out;
  }

  function cssBlock(values) {
    var lines = [':root[data-theme="custom"] {'];
    lines.push('  color-scheme: ' + schemeFor(values) + ';');
    TOKENS.forEach(function (t) {
      lines.push('  ' + t[0] + ': ' + values[t[0]] + ';');
    });
    lines.push('}');
    return lines.join('\n');
  }

  function commit() {
    var values = currentValues();
    applyCustom(values);
    cssOut.value = cssBlock(values);
    // Stored with color-scheme so the pre-paint script in default.html can
    // restore both without recomputing anything.
    values['color-scheme'] = schemeFor(values);
    store(CUSTOM_KEY, JSON.stringify(values));
  }

  function fill(values) {
    TOKENS.forEach(function (t) { inputs[t[0]].value = values[t[0]]; });
    commit();
  }

  /* ---- the panel ------------------------------------------------------ */

  function buildTuner() {
    tuner = document.createElement('div');
    tuner.className = 'theme-tuner';

    var grid = document.createElement('div');
    grid.className = 'theme-tuner-grid';
    TOKENS.forEach(function (t) {
      var label = document.createElement('label');
      var input = document.createElement('input');
      input.type = 'color';
      input.dataset.token = t[0];
      input.addEventListener('input', commit);
      label.appendChild(input);
      label.appendChild(document.createTextNode(' ' + t[1]));
      grid.appendChild(label);
      inputs[t[0]] = input;
    });

    var actions = document.createElement('div');
    actions.className = 'theme-tuner-actions';

    var from = document.createElement('label');
    from.appendChild(document.createTextNode('Start from '));
    var select = document.createElement('select');
    [['', 'Auto'], ['lombard', 'Lombard'], ['birthday', 'Birthday'], ['sakura', 'Sakura']].forEach(function (s) {
      var opt = document.createElement('option');
      opt.value = s[0];
      opt.textContent = s[1];
      select.appendChild(opt);
    });
    select.addEventListener('change', function () { fill(valuesOf(select.value)); });
    from.appendChild(select);
    startFrom = select;

    var copy = document.createElement('button');
    copy.type = 'button';
    copy.textContent = 'Copy CSS';
    copy.addEventListener('click', function () {
      var done = function () {
        copy.textContent = 'Copied';
        setTimeout(function () { copy.textContent = 'Copy CSS'; }, 1200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(cssOut.value).then(done, function () { cssOut.select(); });
      } else {
        cssOut.select();
        try { document.execCommand('copy'); done(); } catch (e) {}
      }
    });

    actions.appendChild(from);
    actions.appendChild(copy);

    cssOut = document.createElement('textarea');
    cssOut.className = 'theme-tuner-css';
    cssOut.readOnly = true;
    cssOut.rows = TOKENS.length + 3;
    cssOut.spellcheck = false;
    cssOut.setAttribute('aria-label', 'CSS for this scheme');
    cssOut.addEventListener('focus', function () { cssOut.select(); });

    tuner.appendChild(grid);
    tuner.appendChild(actions);
    tuner.appendChild(cssOut);
    picker.parentNode.appendChild(tuner);
  }

  function openTuner(seedFrom) {
    if (!tuner) buildTuner();
    var stored = null;
    try { stored = JSON.parse(load(CUSTOM_KEY)); } catch (e) {}
    var complete = stored && TOKENS.every(function (t) { return /^#[0-9a-f]{6}$/i.test(stored[t[0]] || ''); });
    if (complete) {
      fill(stored);
    } else {
      startFrom.value = seedFrom;
      fill(valuesOf(seedFrom));
    }
    tuner.hidden = false;
  }

  function closeTuner() {
    if (tuner) tuner.hidden = true;
    clearCustom();
  }

  /* ---- wiring --------------------------------------------------------- */

  var current = root.dataset.theme;
  if (SCHEMES.indexOf(current) === -1) {
    // Unknown or, on the published site, "custom": show as Auto.
    delete root.dataset.theme;
    current = '';
  }
  mark(current);
  if (current === 'custom') openTuner('');

  picker.addEventListener('click', function (event) {
    var swatch = event.target.closest('.theme-swatch');
    if (!swatch) return;

    var scheme = swatch.dataset.scheme;
    var previous = SCHEMES.indexOf(root.dataset.theme) === -1 ? '' : root.dataset.theme;

    if (scheme === 'custom') {
      // Seed from whatever was showing, so tuning starts from a known scheme.
      if (previous !== 'custom') openTuner(previous);
      root.dataset.theme = 'custom';
    } else {
      closeTuner();
      if (scheme) {
        root.dataset.theme = scheme;
      } else {
        delete root.dataset.theme;
      }
    }
    mark(scheme);
    store('theme', scheme || null);
  });

  // Hidden in the markup so readers without JS never see dead controls.
  picker.hidden = false;
})();
