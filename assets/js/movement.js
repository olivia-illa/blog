const courses = document.querySelector('.movement-courses');
const hoverInput = window.matchMedia('(hover: hover)');
let pinnedRace;

function closeRace() {
  pinnedRace?.setAttribute('aria-expanded', 'false');
  pinnedRace = undefined;
}

courses.addEventListener('click', (event) => {
  if (event.pointerType === 'mouse' || (!event.pointerType && hoverInput.matches)) return;
  const race = event.target.closest('.movement-race');
  if (!race) return;

  const alreadyPinned = race === pinnedRace;
  closeRace();
  race.parentElement.classList.toggle('is-dismissed', alreadyPinned);

  if (!alreadyPinned) {
    race.setAttribute('aria-expanded', 'true');
    pinnedRace = race;
  }
});

document.addEventListener('click', (event) => {
  if (pinnedRace && !pinnedRace.contains(event.target)) closeRace();
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;

  const segment = courses.querySelector('.movement-race:focus-visible')?.parentElement
    || courses.querySelector('.movement-segment:hover');
  segment?.classList.add('is-dismissed');
  closeRace();
});

for (const segment of courses.querySelectorAll('.movement-segment')) {
  const restore = () => segment.classList.remove('is-dismissed');
  segment.addEventListener('pointerleave', restore);
  segment.addEventListener('focusout', restore);
}

const lanes = Array.from(courses.querySelectorAll('.movement-track'), (track) => {
  const athlete = track.querySelector('.movement-athlete');
  const drawing = athlete.querySelector('svg');
  return {
    track,
    athlete,
    drawing,
    finishY: Number(drawing.dataset.finishY),
    isSwimming: track.parentElement.classList.contains('movement-lane--swimming'),
    isRunning: track.parentElement.classList.contains('movement-lane--running')
  };
});

let animationFrame;

function moveAthletes() {
  animationFrame = undefined;
  const scrollTop = window.scrollY;
  const viewportHeight = window.innerHeight;
  const pageTravel = Math.max(1, document.documentElement.scrollHeight - viewportHeight);

  for (const { track, athlete, drawing, finishY, isSwimming, isRunning } of lanes) {
    const bounds = track.getBoundingClientRect();
    const finishViewportFraction = isSwimming ? .4 : .88;
    const finish = Math.min(pageTravel, Math.max(1, bounds.bottom + scrollTop - viewportHeight * finishViewportFraction));
    const progress = Math.max(0, Math.min(1, scrollTop / finish));
    // Match the SVG's centered aspect-ratio fit so the visible figure reaches the edge.
    const { width, height } = drawing.viewBox.baseVal;
    const scale = Math.min(drawing.clientWidth / width, drawing.clientHeight / height);
    const drawingTop = (drawing.clientHeight - height * scale) / 2;
    const travel = Math.max(0, track.clientHeight - drawingTop - finishY * scale);
    const sway = Math.sin(progress * Math.PI * (isSwimming ? 2 : 4));
    athlete.style.setProperty('--athlete-position', `${travel * progress}px`);
    if (isRunning) {
      athlete.style.setProperty('--athlete-turn', `${sway * 5}deg`);
    } else {
      const drift = Math.min(isSwimming ? 6 : 14, bounds.width * .085);
      athlete.style.setProperty('--athlete-drift', `${sway * drift}px`);
    }
    athlete.classList.add('is-travelling');
  }
}

function scheduleAthletes() {
  animationFrame ??= requestAnimationFrame(moveAthletes);
}

window.addEventListener('scroll', scheduleAthletes, { passive: true });
window.addEventListener('resize', scheduleAthletes);
window.addEventListener('load', scheduleAthletes);
scheduleAthletes();
