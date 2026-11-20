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
