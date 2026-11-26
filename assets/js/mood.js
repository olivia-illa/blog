(() => {
  const scene = document.querySelector('[data-mood]');
  const drawings = [...scene.querySelectorAll('[data-mood-stage]')];
  const pin = scene.querySelector('.mood-pin');
  const status = scene.querySelector('.mood-status');
  let current = Number(scene.dataset.stage) - 1;

  const updatePin = () => {
    const label = current === drawings.length - 1 ? 'Refill the bag' : 'Poke the bag';
    pin.setAttribute('aria-label', label);
    pin.title = label;
  };

  updatePin();
  pin.hidden = false;
  pin.addEventListener('click', () => {
    drawings[current].hidden = true;
    current = (current + 1) % drawings.length;
    drawings[current].hidden = false;
    updatePin();
    status.textContent = drawings[current].getAttribute('aria-label');
  });
})();
