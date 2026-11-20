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
