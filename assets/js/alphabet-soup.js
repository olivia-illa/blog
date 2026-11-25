(() => {
  const spoon = document.querySelector('.soup-spoon');
  const motion = spoon.querySelector('.soup-spoon-motion');
  const art = spoon.querySelector('.soup-spoon-art');
  const ripples = spoon.querySelector('.soup-scoop-ripples');
  const note = spoon.querySelector('.soup-note');
  const announcement = document.querySelector('.soup-announcement');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const messages = [
    { text: 'thank you', lang: 'en' },
    { text: '謝謝', lang: 'zh-Hant' },
    { text: 'gracias', lang: 'es' },
    { text: 'dank je', lang: 'nl' },
    { text: 'merci', lang: 'fr' },
    { text: 'obrigado', lang: 'pt' },
    { text: 'ありがとう', lang: 'ja' },
    { text: 'ขอบคุณ', lang: 'th' },
    { text: '감사합니다', lang: 'ko' },
    { text: 'tack så mycket', lang: 'sv' }
  ];
  const resting = 'translate(0, 0) rotate(0deg)';
  const dipped = 'translate(-24px, 35px) rotate(12deg)';
  const lifted = 'translate(8px, -27px) rotate(-9deg)';
  let next = 0;
  let scooping = false;

  function revealNote() {
    const message = messages[next];
    next = (next + 1) % messages.length;
    note.textContent = message.text;
    note.setAttribute('lang', message.lang);
    announcement.lang = message.lang;
    announcement.textContent = message.text;
  }

  spoon.disabled = false;
  spoon.addEventListener('click', async () => {
    if (scooping) return;
    if (reducedMotion.matches || !motion.animate) {
      revealNote();
      return;
    }

    scooping = true;
    const dip = motion.animate([
      { transform: resting },
      { transform: 'translate(4px, -5px) rotate(-4deg)' },
      { transform: dipped }
    ], { duration: 240, easing: 'steps(4, jump-end)', fill: 'forwards' });

    try {
      await dip.finished;
      art.setAttribute('clip-path', 'url(#soup-spoon-submerged)');
      ripples.animate([
        { opacity: 0 },
        { opacity: .85, offset: .18 },
        { opacity: .54, offset: .48 },
        { opacity: 0 }
      ], { duration: 490, easing: 'steps(5, jump-end)' });

      await new Promise(resolve => window.setTimeout(resolve, 110));
      revealNote();

      const lift = motion.animate([
        { transform: dipped },
        { transform: lifted, offset: .56 },
        { transform: resting }
      ], { duration: 430, easing: 'steps(5, jump-end)' });
      art.removeAttribute('clip-path');
      dip.cancel();
      await lift.finished;
    } finally {
      art.removeAttribute('clip-path');
      dip.cancel();
      scooping = false;
    }
  });
})();
