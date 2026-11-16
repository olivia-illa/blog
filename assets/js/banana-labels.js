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
    const mobile = bounds.width < 600;
    const size = Math.min(mobile ? bounds.width * .36 : bounds.width * .23,
      mobile ? bounds.height * .085 : bounds.height * .46, 320);
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
      label.style.width = `${Math.min(mobile ? 145 : 210, bounds.width - 16)}px`;
      label.style.maxWidth = 'none';
      const width = label.offsetWidth;
      const height = label.offsetHeight;
      // Map the hollow above the SVG's inner curve into screen coordinates.
      // getScreenCTM includes both the fruit rotation and its mirrored SVG.
      const svg = banana.querySelector('svg');
      const hollow = new DOMPoint(300, -5).matrixTransform(svg.getScreenCTM());
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
