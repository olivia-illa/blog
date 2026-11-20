const adventDoors = document.querySelectorAll(".advent-door");

adventDoors.forEach((door) => {
  const isLink = door.matches("a");

  door.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey ||
        event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    if (isLink) {
      if (door.classList.contains("is-opening")) return;

      door.classList.add("is-opening");
      window.setTimeout(() => {
        window.location.assign(door.href.baseVal);
      }, 1500);
      return;
    }

    const isOpen = door.classList.toggle("is-opening");
    door.setAttribute("aria-pressed", String(isOpen));
  });

  if (!isLink) {
    door.addEventListener("keydown", (event) => {
      if ((event.key === "Enter" || event.key === " ") && !event.repeat) {
        event.preventDefault();
        door.dispatchEvent(new MouseEvent("click"));
      }
    });
  }
});

window.addEventListener("pageshow", () => {
  document.querySelectorAll("a.advent-door.is-opening").forEach((door) => {
    door.classList.remove("is-opening");
  });
});

const adventSnowflakes = document.querySelectorAll(".advent-snowfall circle");
const adventReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function startAdventSnowfall(tree) {
  const reduceMotion = adventReducedMotion.matches;
  if (!reduceMotion) {
    const boughs = tree.querySelector(".advent-background-tree");
    boughs.getAnimations().forEach((animation) => animation.cancel());
    boughs.animate([
      { transform: "rotate(0deg)" },
      { transform: "rotate(-2.8deg)" },
      { transform: "rotate(2.1deg)" },
      { transform: "rotate(-1.4deg)" },
      { transform: "rotate(.8deg)" },
      { transform: "rotate(0deg)" },
    ], { duration: 640, easing: "ease-out" });
  }

  adventSnowflakes.forEach((flake, index) => {
    flake.getAnimations().forEach((animation) => animation.cancel());

    const drift = index % 2 === 0 ? 18 : -12;
    const keyframes = reduceMotion
      ? [{ opacity: 0 }, { opacity: .85 }, { opacity: 0 }]
      : [
          { opacity: 0, transform: "translate(0, -95px)" },
          { opacity: .9, offset: .22 },
          { opacity: .8, offset: .74 },
          { opacity: 0, transform: `translate(${drift}px, 140px)` },
        ];

    flake.animate(keyframes, {
      duration: reduceMotion ? 1600 : 2800 + (index % 7) * 260,
      delay: reduceMotion ? 0 : (index % 11) * 110,
    });
  });
}

function bindAdventIllustration(selector, activate) {
  document.querySelectorAll(selector).forEach((control) => {
    control.addEventListener("click", () => activate(control));
    control.addEventListener("keydown", (event) => {
      if ((event.key === "Enter" || event.key === " ") && !event.repeat) {
        event.preventDefault();
        activate(control);
      }
    });
  });
}

function replayAdventMotion(element, transforms, duration) {
  element.getAnimations().forEach((animation) => animation.cancel());
  element.animate(transforms.map((transform) => ({ transform })), {
    duration,
    easing: adventReducedMotion.matches ? "steps(1, end)" : "ease-in-out",
  });
}

bindAdventIllustration(".advent-snow-trigger", startAdventSnowfall);

bindAdventIllustration(".advent-cat-trigger", (cat) => {
  const bark = cat.closest(".advent-house").querySelector(".advent-bark-marks");
  if (bark) {
    bark.getAnimations().forEach((animation) => animation.cancel());
    bark.animate([
      { opacity: 0 },
      { opacity: 1, offset: .16 },
      { opacity: 1, offset: .36 },
      { opacity: 0, offset: .49 },
      { opacity: 1, offset: .63 },
      { opacity: 1, offset: .82 },
      { opacity: 0 },
    ], { duration: 1000, delay: 140 });
  }

  const body = cat.querySelector(".advent-cat-motion");
  const direction = Number(cat.dataset.pounce);
  const partner = document.querySelector(`.advent-cat-trigger[data-pounce="${-direction}"] .advent-cat-motion`);
  const resting = "translate(0, 0) rotate(0deg) scale(1)";
  const crouch = "translate(0, 2px) rotate(0deg) scale(1.08, .82)";
  const hop = `translate(${direction * 9}px, -11px) rotate(${direction * -12}deg) scale(.97, 1.04)`;
  const landing = `translate(${direction * 11}px, 1px) rotate(${direction * 4}deg) scale(1.1, .88)`;
  const retreat = `translate(${direction * 10}px, -5px) rotate(${direction * 9}deg) scale(.99, 1.04)`;

  if (adventReducedMotion.matches) {
    replayAdventMotion(body, [resting, crouch, resting], 850);
    replayAdventMotion(partner, [resting, retreat, resting], 850);
    return;
  }

  replayAdventMotion(body, [resting, crouch, hop, landing, resting], 1180);
  replayAdventMotion(partner, [resting, resting, retreat, retreat, resting], 1180);
});

bindAdventIllustration(".advent-snowman-trigger", (snowman) => {
  const body = snowman.querySelector(".advent-snowman-motion");
  const hat = snowman.querySelector(".advent-hat-motion");
  replayAdventMotion(body, ["rotate(0deg)", "rotate(-13deg)", "rotate(-13deg)", "rotate(0deg)"], 1550);
  replayAdventMotion(hat, [
    "translate(0, 0) rotate(0deg)",
    "translate(6px, -8px) rotate(12deg)",
    "translate(15px, 12px) rotate(32deg)",
    "translate(15px, 12px) rotate(32deg)",
    "translate(0, 0) rotate(0deg)",
  ], 1550);
});

bindAdventIllustration(".advent-lamp-trigger", (lamp) => {
  const house = lamp.closest(".advent-house");
  const isFestive = house.classList.toggle("has-festive-lights");

  house.querySelectorAll(".advent-lamp-trigger").forEach((control) => {
    control.setAttribute("aria-pressed", String(isFestive));
  });
});

bindAdventIllustration(".advent-gift-trigger", (tree) => {
  tree.classList.add("has-tree-presents");
  if (adventReducedMotion.matches) return;

  const branches = tree.querySelector(".advent-christmas-tree-motion");
  replayAdventMotion(branches, [
    "rotate(0deg)", "rotate(-5deg)", "rotate(4deg)", "rotate(-3deg)",
    "rotate(2deg)", "rotate(0deg)",
  ], 680);

  tree.querySelectorAll(".advent-falling-present").forEach((gift, index) => {
    gift.getAnimations().forEach((animation) => animation.cancel());
    const inward = (1 - index) * 10;
    const height = 37 + (index % 2) * 12;
    gift.animate([
      { opacity: 0, transform: `translate(${inward}px, -${height}px) rotate(${inward}deg)` },
      { opacity: 1, offset: .24 },
      { opacity: 1, transform: "translate(0, 1px) rotate(0deg)", offset: .77 },
      { opacity: 1, transform: "translate(0, -4px) rotate(-3deg)", offset: .89 },
      { opacity: 1, transform: "translate(0, 0) rotate(0deg)" },
    ], { duration: 600, delay: 170 + index * 95, fill: "backwards", easing: "ease-in" });
  });
});

bindAdventIllustration(".advent-elf-trigger, .advent-carol-trigger", (bush) => {
  const isShowing = bush.getAttribute("aria-pressed") === "true";
  bush.setAttribute("aria-pressed", String(!isShowing));
});

bindAdventIllustration(".advent-ribbon-trigger", (wreath) => {
  const ribbon = wreath.closest(".advent-house").querySelector(".advent-house-ribbon");
  const reduceMotion = adventReducedMotion.matches;
  ribbon.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());

  ribbon.querySelectorAll(".advent-ribbon-reveal").forEach((band, index) => {
    band.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
      duration: reduceMotion ? 0 : 760,
      delay: reduceMotion ? 0 : index * 510,
      fill: "forwards",
      easing: "ease-in-out",
    });
  });

  const folds = [
    "rotate(-7deg) scale(.32, .14)",
    "rotate(26deg) scale(.12, .57)",
    "rotate(-25deg) scale(.12, .57)",
    "rotate(-9deg) scale(.6)",
  ];

  ribbon.querySelectorAll(".advent-ribbon-piece").forEach((piece, index) => {
    piece.animate(reduceMotion ? [{ opacity: 1 }] : [
      { opacity: 0, transform: folds[index] },
      { opacity: 1, offset: .42 },
      { opacity: 1, transform: "rotate(0deg) scale(1)" },
    ], {
      duration: reduceMotion ? 0 : 560,
      delay: reduceMotion ? 0 : 950 + index * 145,
      fill: "forwards",
      easing: "cubic-bezier(.24, .66, .42, 1)",
    });
  });

  ribbon.animate([
    { opacity: 1 },
    { opacity: 1, offset: .64 },
    { opacity: 0 },
  ], { duration: 8900 });
});

bindAdventIllustration(".advent-moon-trigger", (moon) => {
  const house = moon.closest(".advent-house");
  const reduceMotion = adventReducedMotion.matches;
  house.querySelectorAll(".advent-sky-star").forEach((star, index) => {
    star.getAnimations().forEach((animation) => animation.cancel());
    star.animate([
      { opacity: 1 },
      { opacity: .47, offset: .19 },
      { opacity: 1, stroke: "var(--advent-light)", offset: .42 },
      { opacity: .62, offset: .68 },
      { opacity: 1 },
    ], { duration: 870, delay: (index % 5) * 65 });
  });

  const shootingStar = house.querySelector(".advent-shooting-star");
  shootingStar.getAnimations().forEach((animation) => animation.cancel());
  shootingStar.animate(reduceMotion ? [
    { opacity: 0 }, { opacity: 1 }, { opacity: 0 },
  ] : [
    { opacity: 0, transform: "translate(0, 0)" },
    { opacity: 1, offset: .19 },
    { opacity: .85, offset: .67 },
    { opacity: 0, transform: "translate(-225px, 51px)" },
  ], { duration: 1900, delay: 250 });
});

bindAdventIllustration(".advent-santa-trigger", (chimney) => {
  const santa = chimney.closest(".advent-house").querySelector(".advent-santa-motion");
  santa.getAnimations().forEach((animation) => animation.cancel());

  const onRoof = "translate(43px, 38px) rotate(19deg)";
  const reduceMotion = adventReducedMotion.matches;
  santa.animate(reduceMotion ? [{ opacity: 1, transform: onRoof }] : [
    { opacity: 0, transform: "translate(0, 43px)" },
    { opacity: 1, transform: "translate(0, 17px)", offset: .13 },
    { opacity: 1, transform: "translate(0, -2px)", offset: .30 },
    { opacity: 1, transform: "translate(16px, 0) rotate(46deg)", offset: .44 },
    { opacity: 1, transform: "translate(31px, 25px) rotate(28deg)", offset: .61 },
    { opacity: 1, transform: onRoof },
  ], { duration: reduceMotion ? 0 : 3000, fill: "forwards" });
});

bindAdventIllustration(".advent-nutcracker-trigger", (chimney) => {
  const toys = chimney.closest(".advent-house").querySelectorAll(".advent-nutcracker-motion");
  const reduceMotion = adventReducedMotion.matches;
  const landings = [
    { x: -5, y: 562, angle: 0, reach: -28, apex: -34 },
    { x: -45, y: 565, angle: 0, reach: -65, apex: -21 },
    { x: 57, y: 560, angle: -88, reach: 43, apex: -26 },
  ];

  toys.forEach((nutcracker, index) => {
    nutcracker.getAnimations().forEach((animation) => animation.cancel());
    const { x, y, angle, reach, apex } = landings[index];
    const sway = Math.sign(reach);
    const landing = `translate(${x}px, ${y}px) rotate(${angle}deg)`;

    nutcracker.animate(reduceMotion ? [{ opacity: 1, transform: landing }] : [
      { opacity: 0, transform: "translate(0, 32px) rotate(0deg)" },
      { opacity: 0, transform: "translate(0, 16px) rotate(0deg)", offset: .08 },
      { opacity: 1, transform: `translate(${reach}px, ${apex}px) rotate(${sway * 12}deg)`, offset: .24 },
      { opacity: 1, transform: `translate(${reach * 1.11}px, 22px) rotate(${sway * -23}deg)`, offset: .4 },
      { opacity: 1, transform: `translate(${(x + reach) / 2}px, 284px) rotate(${angle || sway * 28}deg)`, offset: .68 },
      { opacity: 1, transform: landing, offset: .87 },
      { opacity: 1, transform: `translate(${x}px, ${y - 9}px) rotate(${angle - sway * 8}deg)`, offset: .93 },
      { opacity: 1, transform: landing },
    ], { duration: reduceMotion ? 0 : 2450, delay: reduceMotion ? 0 : index * 340, fill: "both" });
  });
});
