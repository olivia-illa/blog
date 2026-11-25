(() => {
  const spoon = document.querySelector('.soup-spoon');
  const letters = Array.from(document.querySelectorAll('.soup-pasta use'));
  const motion = spoon.querySelector('.soup-spoon-motion');
  const art = spoon.querySelector('.soup-spoon-art');
  const ripples = spoon.querySelector('.soup-scoop-ripples');
  const note = spoon.querySelector('.soup-note');
  const announcement = document.querySelector('.soup-announcement');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(pointer: fine)');
  const touchScreen = window.matchMedia('(pointer: coarse)');
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
  const letterOffsets = [3, 1, -2, -4, -2, 1];
  const letterFrameDuration = 280;
  const letterDrift = [0, 1, 2, 1, -1, -2];
  const letterTilt = [-4, 0, 4, 6, 1, -5];
  const scoopTimeScale = 1.5;
  const scoopFrames = [
    { time: 0, position: 'translate(0 0)' },
    { time: 80, position: 'translate(4 -5) rotate(-4 203 173)' },
    { time: 160, position: 'translate(-10 13) rotate(5 203 173)' },
    { time: 240, position: 'translate(-24 35) rotate(12 203 173)', submerged: true, ripple: .85, rippleScale: .88 },
    { time: 350, position: 'translate(-24 35) rotate(12 203 173)', ripple: .68, rippleScale: 1 },
    { time: 430, position: 'translate(-8 6)', ripple: .42, rippleScale: 1.13 },
    { time: 530, position: 'translate(8 -40) rotate(-9 203 173)', ripple: .22, rippleScale: 1.22 },
    { time: 650, position: 'translate(4 -20) rotate(-4 203 173)' },
    { time: 780, position: 'translate(0 0)' }
  ];
  let next = 0;
  let scooping = false;
  let letterTimer;
  let reducedMotionTimer;
  let lastLetterTick;

  function floatLetters() {
    const tick = Math.floor(performance.now() / letterFrameDuration);
    if (tick === lastLetterTick) return;
    lastLetterTick = tick;
    letters.forEach((letter, index) => {
      const phase = (index % 3) * 2;
      const frame = (tick + phase) % letterOffsets.length;
      const offset = reducedMotion.matches ? Math.sign(letterOffsets[frame]) : letterOffsets[frame];
      const transform = finePointer.matches
        ? 'translate(' + letterDrift[frame] + ' ' + offset * 1.35 + ') rotate(' + letterTilt[frame] + ' 7 -7)'
        : 'translate(0 ' + offset + ')';
      letter.setAttribute('transform', transform);
    });
  }

  function stopLetterMotion() {
    window.clearInterval(letterTimer);
    window.clearTimeout(reducedMotionTimer);
    letters.forEach(letter => letter.removeAttribute('transform'));
    lastLetterTick = undefined;
  }

  function syncLetterMotion() {
    stopLetterMotion();
    if (reducedMotion.matches && !touchScreen.matches) return;

    floatLetters();
    letterTimer = window.setInterval(floatLetters, letterFrameDuration);
    if (reducedMotion.matches) {
      reducedMotionTimer = window.setTimeout(stopLetterMotion, letterFrameDuration * letterOffsets.length);
    }
  }

  function revealNote() {
    const message = messages[next];
    next = (next + 1) % messages.length;
    note.textContent = message.text;
    note.setAttribute('lang', message.lang);
    announcement.lang = message.lang;
    announcement.textContent = message.text;
  }

  syncLetterMotion();
  if (reducedMotion.addEventListener) {
    reducedMotion.addEventListener('change', syncLetterMotion);
  } else {
    reducedMotion.addListener(syncLetterMotion);
  }

  spoon.disabled = false;
  spoon.addEventListener('click', () => {
    if (scooping) return;
    if (reducedMotion.matches) {
      revealNote();
      return;
    }

    scooping = true;
    const started = performance.now();
    let frameIndex = -1;
    let revealed = false;

    function advance(now) {
      const elapsed = (now - started) / scoopTimeScale;
      let nextFrame = frameIndex;
      while (nextFrame + 1 < scoopFrames.length && elapsed >= scoopFrames[nextFrame + 1].time) {
        nextFrame++;
      }

      if (nextFrame !== frameIndex && nextFrame >= 0) {
        frameIndex = nextFrame;
        const frame = scoopFrames[frameIndex];
        motion.setAttribute('transform', frame.position);
        ripples.style.opacity = frame.ripple || 0;
        if (finePointer.matches && frame.rippleScale) {
          ripples.setAttribute('transform', 'translate(192 215) scale(' + frame.rippleScale + ') translate(-192 -215)');
        } else {
          ripples.removeAttribute('transform');
        }
        if (frame.submerged) {
          art.setAttribute('clip-path', 'url(#soup-spoon-submerged)');
        } else {
          art.removeAttribute('clip-path');
        }
      }

      if (!revealed && elapsed >= 350) {
        revealNote();
        revealed = true;
      }

      if (frameIndex < scoopFrames.length - 1) {
        window.requestAnimationFrame(advance);
      } else {
        motion.removeAttribute('transform');
        ripples.style.removeProperty('opacity');
        scooping = false;
      }
    }

    window.requestAnimationFrame(advance);
  });
})();
