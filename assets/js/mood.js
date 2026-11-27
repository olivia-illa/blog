(() => {
  const scene = document.querySelector('[data-mood]');
  const drawings = [...scene.querySelectorAll('[data-mood-stage]')];
  const pin = scene.querySelector('.mood-pin');
  const needle = pin.querySelector('.mood-needle');
  const caption = scene.querySelector('.mood-caption q');
  const status = scene.querySelector('.mood-status');
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
  pin.addEventListener('click', () => {
    if (poking) return;

    const drawing = drawings[current];
    if (!drawing.dataset.puncture) {
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
    needle.style.setProperty('--mood-contact', contact);
    needle.style.setProperty('--mood-rebound', rebound);

    const finish = () => {
      window.clearTimeout(fallback);
      needle.removeEventListener('animationend', finish);
      needle.classList.remove('is-poking');
      poking = false;
      advance();
    };

    const fallback = window.setTimeout(finish, 1050);
    needle.addEventListener('animationend', finish);
    needle.classList.add('is-poking');
  });
})();
