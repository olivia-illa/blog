(() => {
  const stack = document.querySelector('.note-stack');
  if (!stack) return;
  const desktop = matchMedia('(min-width: 800px)');

  stack.addEventListener('click', event => {
    const link = event.target.closest('.note-card-link');
    if (!link || !desktop.matches || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const card = link.closest('.note-card');
    if (card.classList.contains('is-front')) return;
    event.preventDefault();
    stack.querySelector('.is-front')?.classList.remove('is-front');
    card.classList.add('is-front');
  });
})();
