// Keep each month to two row sizes, accounting for wrapped titles and fonts.
(() => {
  const body = document.querySelector('.calendar-table tbody');
  if (!body) return;
  const rows = [...body.querySelectorAll('tr')];
  const sizeRows = () => {
    body.style.removeProperty('grid-template-rows');
    if (matchMedia('(max-width: 600px)').matches || !body.offsetWidth) return;
    const heights = rows.map(row => Math.max(...[...row.cells].map(cell => cell.getBoundingClientRect().height)));
    const regular = Math.min(...heights);
    const tall = Math.max(...heights);
    body.style.gridTemplateRows = heights.map(height => `${height > regular + 1 ? tall : regular}px`).join(' ');
  };
  let width;
  new ResizeObserver(([entry]) => {
    if (entry.contentRect.width === width) return;
    width = entry.contentRect.width;
    sizeRows();
  }).observe(body);
  new MutationObserver(sizeRows).observe(body, { childList: true, subtree: true });
  document.fonts.ready.then(sizeRows);
  window.addEventListener('resize', sizeRows);
  sizeRows();
})();
