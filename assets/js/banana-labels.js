(() => {
  const scatter = document.querySelector('.banana-stack');
  if (!scatter) return;
  const mobileLayout = matchMedia('(max-width: 600px)');
  let titlesPinned = false;
  let selectedEntry;
  const clearSelection = () => {
    if (!selectedEntry) return;
    selectedEntry.banana.classList.remove('is-selected');
    if (!titlesPinned) selectedEntry.label.classList.remove('is-visible');
    selectedEntry = null;
  };
  const entries = [...scatter.querySelectorAll('.banana-entry')].map((banana, index) => {
    const label = banana.querySelector('.banana-hover-title');
    label.id = `banana-label-${index}`;
    label.classList.add('banana-floating-label');
    document.body.append(label);
    banana.setAttribute('aria-describedby', label.id);
    const show = () => {
      if (mobileLayout.matches) return;
      label.classList.add('is-visible', 'is-hovered');
      banana.classList.add('is-hovered');
    };
    const hide = () => {
      if (mobileLayout.matches) return;
      label.classList.remove('is-hovered');
      banana.classList.remove('is-hovered');
      if (!titlesPinned) label.classList.remove('is-visible');
    };
    banana.addEventListener('mouseenter', show);
    banana.addEventListener('mouseleave', hide);
    banana.addEventListener('focus', show);
    banana.addEventListener('blur', hide);
    const entry = { banana, label, item: banana.closest('li') };
    banana.addEventListener('click', event => {
      if (!mobileLayout.matches || event.detail === 0 || selectedEntry === entry) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      clearSelection();
      if (titlesPinned) {
        titlesPinned = false;
        entries.forEach(({ label }) => label.classList.remove('is-visible'));
      }
      selectedEntry = entry;
      banana.classList.add('is-selected');
      label.classList.add('is-visible');
    });
    return entry;
  });

  mobileLayout.addEventListener('change', () => {
    titlesPinned = false;
    clearSelection();
    entries.forEach(({ label }) => label.classList.remove('is-visible'));
  });
  // Keep the original scattered positions and one shared fruit size.
  const layout = () => {
    const bounds = scatter.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const mobile = mobileLayout.matches;
    if (mobile) {
      entries.forEach(({ banana, label, item }) => {
        item.style.cssText = '';
        label.style.cssText = '';
        label.classList.add('is-compact', 'is-mobile-label');
        label.classList.remove('is-hovered');
        banana.classList.remove('is-hovered');
        if (label.parentElement !== item) item.append(label);
        const svg = banana.querySelector('svg');
        const hollow = new DOMPoint(300, -80).matrixTransform(svg.getScreenCTM());
        const local = item.getBoundingClientRect();
        const left = Math.max(8, Math.min(hollow.x - local.left - label.offsetWidth / 2, local.width - label.offsetWidth - 8));
        label.style.left = `${left}px`;
        label.style.top = `${hollow.y - local.top - label.offsetHeight / 2}px`;
      });
      return;
    }
    entries.forEach(({ label }) => {
      if (label.parentElement !== document.body) document.body.append(label);
    });
    const size = mobile ? Math.min(bounds.width * .72, 320)
      : Math.min(bounds.width * .23, bounds.height * .46, 320);
    entries.forEach(({ banana, label, item }) => {
      item.style.width = `${size}px`;
      item.style.removeProperty('left');
      item.style.removeProperty('top');
      item.style.margin = '0';
      const initial = banana.getBoundingClientRect();
      const dx = initial.left < bounds.left ? bounds.left - initial.left : initial.right > bounds.right ? bounds.right - initial.right : 0;
      const dy = initial.top < bounds.top ? bounds.top - initial.top : initial.bottom > bounds.bottom ? bounds.bottom - initial.bottom : 0;
      item.style.marginLeft = `${dx}px`;
      item.style.marginTop = `${dy}px`;
      const rect = banana.getBoundingClientRect();
      label.classList.toggle('is-compact', mobile);
      label.classList.toggle('is-mobile-label', mobile);
      label.style.width = `${Math.min(mobile ? 220 : 210, bounds.width - 16)}px`;
      label.style.maxWidth = 'none';
      const width = label.offsetWidth;
      const height = label.offsetHeight;
      // Map the hollow above the SVG's inner curve into screen coordinates.
      // getScreenCTM includes both the fruit rotation and its mirrored SVG.
      const svg = banana.querySelector('svg');
      const hollow = new DOMPoint(300, mobile ? -65 : -25).matrixTransform(svg.getScreenCTM());
      label.style.left = `${Math.max(bounds.left + 4, Math.min(hollow.x - width / 2, bounds.right - width - 4))}px`;
      label.style.top = `${Math.max(bounds.top + 4, Math.min(hollow.y - height / 2, bounds.bottom - height - 4))}px`;
    });
  };
  document.addEventListener('click', event => {
    if (event.target.closest('a, button, input, select, textarea, label')) return;
    clearSelection();
    if (mobileLayout.matches) return;
    titlesPinned = true;
    entries.forEach(({ label }) => label.classList.add('is-visible'));
  });
  let layoutWidth;
  new ResizeObserver(([entry]) => {
    if (entry.contentRect.width === layoutWidth) return;
    layoutWidth = entry.contentRect.width;
    layout();
  }).observe(scatter);
  window.addEventListener('load', layout);
  document.fonts.ready.then(layout);
  layout();
})();
