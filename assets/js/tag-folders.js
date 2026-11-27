(() => {
  const folders = [...document.querySelectorAll('.tag-folder')];
  const drawerButton = document.querySelector('.close-drawer');
  const drawerTrack = document.querySelector('.drawer-track');
  const cabinet = document.querySelector('.tag-cabinet');
  const params = new URLSearchParams(location.search);
  if (params.has('t') && params.get('view') !== 'drawer') {
    const selected = folders.find(folder => folder.dataset.tag === params.get('t'));
    if (selected) {
      const article = document.querySelector('main > article');
      const heading = document.createElement('h1');
      const link = document.createElement('a');
      link.href = location.pathname;
      link.className = 'inherit-link tag-index-link';
      link.textContent = '#' + selected.dataset.tag;
      const hint = document.createElement('span');
      hint.className = 'tag-index-hint';
      hint.textContent = ' (← explore)';
      heading.append(link, hint);
      const posts = selected.querySelector('.individual-tag-posts').content.cloneNode(true);
      article.classList.add('individual-tag-archive');
      article.replaceChildren(heading, posts);
      document.title = '#' + selected.dataset.tag + ' | ' + document.title.split(' | ').slice(1).join(' | ');
      document.documentElement.classList.remove('tag-view-loading');
      return;
    }
  }
  document.documentElement.classList.remove('tag-view-loading');
  const target = folders.find(folder => folder.dataset.tag === params.get('t'));
  const syncUrl = () => {
    const url = new URL(location.href);
    const active = !drawerTrack.inert && folders.find(folder => folder.open);
    if (active) {
      url.searchParams.set('t', active.dataset.tag);
      url.searchParams.set('view', 'drawer');
    } else {
      url.searchParams.delete('t');
      url.searchParams.delete('view');
    }
    if (url.href !== location.href) history.replaceState(null, '', url);
  };
  const setDrawer = open => {
    if (!open && drawerTrack.contains(document.activeElement)) drawerButton.focus();
    drawerTrack.inert = !open;
    cabinet.classList.toggle('drawer-open', open);
    drawerButton.textContent = open ? 'close drawer' : 'open drawer';
    drawerButton.setAttribute('aria-expanded', String(open));
  };
  if (target) target.open = true;
  setDrawer(Boolean(target));
  cabinet.classList.add('drawer-ready');
  drawerButton.hidden = false;
  requestAnimationFrame(() => {
    if (target) target.scrollIntoView({ block: 'start' });
    requestAnimationFrame(() => cabinet.classList.add('drawer-motion'));
  });
  folders.forEach(folder => folder.addEventListener('toggle', syncUrl));
  drawerButton.addEventListener('click', event => {
    const open = drawerTrack.inert;
    if (open) folders.forEach(folder => { folder.open = false; });
    setDrawer(open);
    if (open && event.detail === 0) folders[0]?.querySelector('summary').focus({ preventScroll: true });
    syncUrl();
  });
})();
