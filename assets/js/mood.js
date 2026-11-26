(() => {
  const scene = document.querySelector('[data-mood]');
  const drawings = [...scene.querySelectorAll('[data-mood-stage]')];
  const pin = scene.querySelector('.mood-pin');
  const needle = pin.querySelector('svg');
  const caption = scene.querySelector('.mood-caption q');
  const status = scene.querySelector('.mood-status');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = Number(scene.dataset.stage) - 1;
  let poking = false;

  const updatePin = () => {
    const label = current === drawings.length - 1 ? 'Refill the bag' : 'Poke the bag';
    pin.setAttribute('aria-label', label);
  };

  const advance = () => {
    drawings[current].setAttribute('hidden', '');
    current = (current + 1) % drawings.length;
    drawings[current].removeAttribute('hidden');
    updatePin();
    scene.classList.toggle('mood-draining', current !== 0);
    caption.textContent = drawings[current].dataset.caption;
    status.textContent = `${drawings[current].getAttribute('aria-label')} “${caption.textContent}”`;
  };

  updatePin();
  pin.hidden = false;
  pin.addEventListener('click', async () => {
    if (poking) return;

    const drawing = drawings[current];
    if (!drawing.dataset.puncture || reducedMotion.matches || !needle.animate) {
      advance();
      return;
    }

    const [x, y] = drawing.dataset.puncture.split(',').map(Number);
    const bag = drawing.getBoundingClientRect();
    const button = needle.getBoundingClientRect();
    const dx = bag.left + bag.width * x / drawing.viewBox.baseVal.width - (button.left + button.width * 7 / 40);
    const dy = bag.top + bag.height * y / drawing.viewBox.baseVal.height - (button.top + button.height * 33 / 40);
    const contact = `translate(${dx}px, ${dy}px)`;
    const rebound = `translate(${-dx * 0.04}px, ${-dy * 0.04}px)`;

    poking = true;
    try {
      await needle.animate([
        { transform: 'none', offset: 0 },
        { transform: contact, offset: 0.5, easing: 'ease-out' },
        { transform: rebound, offset: 0.88 },
        { transform: 'none', offset: 1 }
      ], { duration: 480 }).finished;
    } finally {
      poking = false;
      advance();
    }
  });
})();
