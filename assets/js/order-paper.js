(() => {
  const paper = document.querySelector('.latest-order');
  if (!paper) return;
  const updateTilt = () => {
    paper.classList.toggle('is-straight', !!paper.querySelector('input[type="checkbox"]:checked'));
  };
  paper.addEventListener('change', updateTilt);
  window.addEventListener('pageshow', updateTilt);
  updateTilt();
})();
