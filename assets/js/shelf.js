(() => {
  const controls = document.querySelector('.shelf-controls');
  if (!controls) return;
  controls.hidden = false;
  controls.addEventListener('click', event => {
    const button = event.target.closest('button[data-medium]');
    if (!button) return;
    controls.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelectorAll('.shelf-item').forEach(item => {
      const forgotten = item.dataset.forgotten === 'true';
      item.hidden = button.dataset.medium === 'forgotten'
        ? !forgotten
        : forgotten || (button.dataset.medium !== 'all' && item.dataset.medium !== button.dataset.medium);
    });
  });
})();
