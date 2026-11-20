(() => {
  const scatter = document.querySelector('.banana-stack');
  if (!scatter) return;
  const mobileLayout = matchMedia('(max-width: 600px)');
  let titlesPinned = false;
  let selectedEntry;
  const clearSelection = () => {
    if (!selectedEntry) return;
    selectedEntry.banana.classList.remove('is-selected');
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
        const gap = 14;
        const labelHeight = label.offsetHeight;
        const fruitHeight = svg.getBoundingClientRect().height;
        item.style.minHeight = `${Math.ceil(fruitHeight + 2 * (labelHeight + gap))}px`;

        const fruit = svg.getBoundingClientRect();
        const matrix = svg.getScreenCTM();
        const hollow = new DOMPoint(300, -80).matrixTransform(matrix);
        // The rotated SVG box includes blank corners. Measure the peel itself.
        const outline = svg.querySelector('defs > path');
        const length = outline.getTotalLength();
        const peelPoints = Array.from({ length: 65 }, (_, step) =>
          outline.getPointAtLength(length * step / 64).matrixTransform(matrix)
        );
        const peelX = peelPoints.map(point => point.x);
        const peelY = peelPoints.map(point => point.y);
        const peelCenter = (Math.min(...peelX) + Math.max(...peelX)) / 2;
        const local = item.getBoundingClientRect();
        const fruitCenterY = fruit.top + fruit.height / 2;
        const opensLeft = hollow.x < peelCenter;
        if (Math.abs(hollow.x - peelCenter) > 0.65 * Math.abs(hollow.y - fruitCenterY)) {
          label.style.width = 'min(125px, 32%)';
          const captionWidth = label.offsetWidth;
          const captionHeight = label.offsetHeight;
          const openingDirection = Math.sign(hollow.y - fruitCenterY);
          for (const offset of [0, 12, -12, 24, -24]) {
            const sideTop = hollow.y + offset * openingDirection - captionHeight / 2;
            const sideBottom = sideTop + captionHeight;
            if (sideTop < local.top + 8 || sideBottom > local.bottom - 8) continue;
            const rim = peelPoints.filter(point => point.y >= sideTop - gap && point.y <= sideBottom + gap);
            if (!rim.length) continue;
            const rimX = rim.map(point => point.x);
            const sideLeft = opensLeft
              ? Math.min(...rimX) - gap - captionWidth
              : Math.max(...rimX) + gap;
            if (sideLeft >= local.left + 8 && sideLeft + captionWidth <= local.right - 8) {
              label.style.left = `${sideLeft - local.left}px`;
              label.style.top = `${sideTop - local.top}px`;
              return;
            }
          }
          label.style.removeProperty('width');
        }
        const left = Math.max(8, Math.min(peelCenter - local.left - label.offsetWidth / 2, local.width - label.offsetWidth - 8));
        const above = hollow.y < fruitCenterY;
        const top = above ? Math.min(...peelY) - gap - labelHeight : Math.max(...peelY) + gap;
        label.style.left = `${left}px`;
        label.style.top = `${top - local.top}px`;
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
      item.style.removeProperty('min-height');
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
