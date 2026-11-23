const courses = document.querySelector('.movement-courses');
let pinnedRace;

function closeRace() {
  pinnedRace?.setAttribute('aria-expanded', 'false');
  pinnedRace = undefined;
}

courses.addEventListener('click', (event) => {
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

const lanes = Array.from(courses.querySelectorAll('.movement-track'), (track) => ({
  track,
  athlete: track.querySelector('.movement-athlete')
}));

let animationFrame;

function moveAthletes() {
  animationFrame = undefined;
  const scrollTop = window.scrollY;
  const viewportHeight = window.innerHeight;
  const pageTravel = Math.max(1, document.documentElement.scrollHeight - viewportHeight);

  for (const { track, athlete } of lanes) {
    const bounds = track.getBoundingClientRect();
    const finish = Math.min(pageTravel, Math.max(1, bounds.bottom + scrollTop - viewportHeight * 0.88));
    const progress = Math.max(0, Math.min(1, scrollTop / finish));
    const travel = Math.max(0, track.clientHeight - athlete.offsetHeight);
    athlete.style.setProperty('--athlete-position', `${travel * progress}px`);
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
