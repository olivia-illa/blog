const dominoBoard = document.querySelector(".dominoes-board");

if (dominoBoard) {
  const tiles = Array.from(dominoBoard.children);
  const starter = tiles[0];
  const controls = document.querySelector(".dominoes-controls");
  const replay = controls.querySelector("[data-domino-replay]");
  let frame = null;
  let followFall = false;
  let columns = 0;
  let partialRowStart;

  function layOutRows() {
    const nextRow = Array.from(dominoBoard.children)
      .findIndex((tile) => tile.offsetTop !== starter.offsetTop);
    const rowLength = nextRow > 0 ? nextRow : tiles.length;
    if (columns === rowLength) return;
    columns = rowLength;
    partialRowStart?.style.removeProperty("grid-column-start");
    partialRowStart = null;

    const visualOrder = [];
    for (let start = 0; start < tiles.length; start += columns) {
      const row = tiles.slice(start, start + columns);
      const backwards = (start / columns) % 2 === 1;
      row.forEach((tile, index) => {
        tile.style.setProperty("--direction", backwards ? "-1" : "1");
        tile.classList.toggle("domino-turn-out", index === row.length - 1 && start + columns < tiles.length);
        tile.classList.toggle("domino-turn-in", index === 0 && start > 0);
      });
      if (backwards) {
        row.reverse();
        if (row.length < columns) {
          partialRowStart = row[0];
          partialRowStart.style.gridColumnStart = columns - row.length + 1;
        }
      }
      visualOrder.push(...row);
    }
    dominoBoard.append(...visualOrder);
  }

  layOutRows();
  new ResizeObserver(layOutRows).observe(dominoBoard);
  starter.disabled = false;
  controls.hidden = false;

  function play() {
    if (starter.getAttribute("aria-disabled") === "true") return;
    starter.setAttribute("aria-disabled", "true");
    followFall = true;

    const started = performance.now();
    const delay = Math.min(68, 7500 / tiles.length);
    let next = 0;

    function tip(now) {
      const reached = Math.floor((now - started) / delay) + 1;
      while (next < Math.min(reached, tiles.length)) {
        tiles[next++].classList.add("is-down");
      }

      if (followFall) {
        const tileBottom = tiles[next - 1].getBoundingClientRect().bottom;
        const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
        const distance = tileBottom - viewportHeight * .7;
        if (distance > 1) {
          const step = next < tiles.length ? Math.max(1, distance * .18) : distance;
          window.scrollBy({ top: step, behavior: "instant" });
        }
      }

      frame = next < tiles.length ? requestAnimationFrame(tip) : null;
    }

    tip(started);
  }

  starter.addEventListener("click", play);
  function stopFollowing() {
    followFall = false;
  }

  window.addEventListener("wheel", stopFollowing, { passive: true });
  window.addEventListener("touchstart", stopFollowing, { passive: true });
  window.addEventListener("keydown", (event) => {
    if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) {
      stopFollowing();
    }
  });

  replay.addEventListener("click", (event) => {
    event.preventDefault();
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    tiles.forEach((tile) => tile.classList.remove("is-down"));
    starter.removeAttribute("aria-disabled");
    starter.focus();
  });
}
