---
layout: post
body_class: page-easter-eggs
title: "Easter eggs"
date: 2026-11-18 01:30:00 +0800
permalink: /drafts/easter-eggs/
tags: [site-notes]
---


<style>
.page-easter-eggs .post-body table:first-of-type { width:100%; table-layout:fixed; }
.page-easter-eggs .post-body table:first-of-type th:first-child,
.page-easter-eggs .post-body table:first-of-type td:first-child { width:4.5rem; }
.page-easter-eggs .post-body table:first-of-type td { overflow-wrap:anywhere; }
</style>

Inventory checked against the site source on 18 November 2026. This lists clickable emojis, including ones that change something in place rather than take the reader to another page.

## Clickable emojis

| Emoji | What clicking does |
| --- | --- |
| 🕰️ | Opens a random post. Each click chooses from the site’s posts. |
| ✅ | Switches between “I am not a robot” and “I am *only* human,” with a little poof animation. Click again to switch back. Stays on the page. |
| 👀 | Reveals or hides the recent watches. Stays on the page. |
| 🍏 → 🍎 → 🥧 | Cycles through green apple, red apple, and pie, then back to green apple. The pie reveals “(she’s cookin →).” The chosen state is saved locally in that browser for each post; it is not a public reaction count. Thoughts-style posts, posts titled “thoughts,” and posts tagged `thoughts` omit this reaction. |
| 🕷 | Opens `/shelf/forgotten/`. The spider is omitted from wishlist and forgotten-shelf headings. |
| ☁️ | Opens `/shelf/wishlist/`. Appears in place of that entry’s note text. It is not shown in Wishlist or Forgotten entry notes. |
| 🥚 | Reveals a 🐰 beside the egg. Click again to hide the rabbit. Stays on the post; the rabbit itself is not another button. |

## Related clickable drawings and symbols

These are not Unicode emoji, but are similar little discoveries on the site.

| Drawing or symbol | What it does |
| --- | --- |
| Pixel ducks | Move to the previous or next month that contains posts. When there is no corresponding month, that duck is disabled. |
| Thimble | Jiggles when clicked. The marker only appears when today is in the displayed calendar, using Asia/Taipei time. |
| 𐫱, ✿, ❀, ❁ | Select Auto, Lombard, Birthday, or Sakura respectively. The choice is saved in the browser. |
| ✎ | Opens the custom color controls. This option is gated by `site.show_drafts` and does not appear in the normal published build. |
| Banana illustrations | Each banana links to its post. Hover/focus annotations and mobile label placement accompany the links. |

## Other small interactions worth remembering

- **Wires/music:** the first click anywhere straightens all covers and disables their cover movement for the rest of that page visit. Covers still link directly to Spotify. Reloading resets the effect. [Code](https://github.com/olivia-illa/blog/blob/main/assets/js/music.js).
- **Note stack:** clicking a card behind the front card brings it forward; clicking the front card follows its post link. [Code](https://github.com/olivia-illa/blog/blob/main/assets/js/note-stack.js).
- **Produce order form:** ticking a checkbox straightens the order paper; clearing all ticks restores its tilt. [Code](https://github.com/olivia-illa/blog/blob/main/assets/js/order-paper.js).
- **Site title:** on inner pages it links home and reveals “(← try again)” on hover/focus. The homepage title instead reveals the last-update/post-count hint; it is not a navigation link. [Markup](https://github.com/olivia-illa/blog/blob/main/_layouts/default.html).

## Retired or not clickable

- The temporary homepage 📘 and 🪩 navigation links were removed; the navigation now says **Shelf** and **Wires**.
- “teleport me somewhere else” on Wires is currently plain text, not a link.
- The rabbit revealed by 🥚, decorative flowers, and decorative emoji within prose do not automatically have click behavior.

## Maintaining this list

When adding an Easter egg, record its emoji/drawing, exact location, click behavior or destination, whether it can be toggled back, and any browser storage or draft-only conditions. Link the implementation source so the behavior can be checked later.
