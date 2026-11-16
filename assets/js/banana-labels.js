(() => {
  const scatter = document.querySelector('.banana-stack');
  if (!scatter) return;
  let titlesPinned = false;
  const entries = [...scatter.querySelectorAll('.banana-entry')].map((banana, index) => {
    const label = banana.querySelector('.banana-hover-title');
    label.id = `banana-label-${index}`;
    label.classList.add('banana-floating-label');
    document.body.append(label);
    banana.setAttribute('aria-describedby', label.id);
    const show = () => {
      if (matchMedia('(max-width: 600px)').matches) return;
      label.classList.add('is-visible', 'is-hovered');
      banana.classList.add('is-hovered');
    };
    const hide = () => {
      label.classList.remove('is-hovered');
      banana.classList.remove('is-hovered');
      if (!titlesPinned) label.classList.remove('is-visible');
    };
    banana.addEventListener('mouseenter', show);
    banana.addEventListener('mouseleave', hide);
    banana.addEventListener('focus', show);
    banana.addEventListener('blur', hide);
    return { banana, label, item: banana.closest('li') };
  });

  // Keep the original scattered positions and one shared fruit size.
  const layout = () => {
    const bounds = scatter.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const mobile = matchMedia('(max-width: 600px)').matches;
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
      if (mobile) {
        label.classList.remove('is-hovered');
        banana.classList.remove('is-hovered');
        // Use the open concave side of the original, centered fruit.
        const svg = banana.querySelector('svg');
        const hollow = new DOMPoint(300, -105).matrixTransform(svg.getScreenCTM());
        if (banana.pathname.endsWith('/invisible-string-p2.html')) {
          hollow.x -= 16;
          hollow.y += 16;
        }
        label.style.width = `${Math.min(200, bounds.width * .56)}px`;
        label.style.maxWidth = 'none';
        const left = Math.max(bounds.left + 4, Math.min(hollow.x - label.offsetWidth / 2, bounds.right - label.offsetWidth - 4));
        label.style.left = `${left + scrollX}px`;
        label.style.top = `${hollow.y - label.offsetHeight / 2 + scrollY}px`;
        return;
      }
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
    titlesPinned = true;
    entries.forEach(({ label }) => label.classList.add('is-visible'));
  });
  new ResizeObserver(layout).observe(scatter);
  window.addEventListener('load', layout);
  document.fonts.ready.then(layout);
  layout();
})();
