(function () {
  'use strict';
  document.querySelectorAll('.music-room .album-art img').forEach(img => {
    img.addEventListener('error', () => { img.hidden = true; });
  });
  document.querySelectorAll('.music-shelf-scroll').forEach(shelf => {
    const updateShade = () => {
      const row = shelf.closest('.music-shelf');
      row.classList.toggle('has-scrolled', shelf.scrollLeft > 1);
      row.classList.toggle('has-more', shelf.scrollLeft + shelf.clientWidth < shelf.scrollWidth - 1);
    };
    shelf.addEventListener('scroll', updateShade, { passive: true });
    new ResizeObserver(updateShade).observe(shelf);
    updateShade();
    shelf.addEventListener('keydown', event => {
      if (event.target !== shelf || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      shelf.scrollBy({ left: event.key === 'ArrowRight' ? 240 : -240, behavior: 'auto' });
    });
  });
})();
