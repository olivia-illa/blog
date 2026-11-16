(() => {
  const folders = [...document.querySelectorAll('.tag-folder')];
  const drawerButton = document.querySelector('.close-drawer');
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
      return;
    }
  }
  const updateButton = () => {
    if (!drawerButton) return;
    const anyOpen = folders.some(folder => folder.open);
    drawerButton.textContent = anyOpen ? 'close drawer' : 'open drawer';
    drawerButton.setAttribute('aria-label', anyOpen ? 'Close drawer and put all folders back' : 'Open drawer and show all folders');
    drawerButton.title = anyOpen ? 'Close all folders' : 'Open all folders';
  };
  folders.forEach(folder => {
    folder.addEventListener('toggle', () => {
      updateButton();
      const url = new URL(location.href);
      const active = folder.open ? folder : folders.find(item => item.open);
      if (active) {
        url.searchParams.set('t', active.dataset.tag);
        url.searchParams.set('view', 'drawer');
      } else {
        url.searchParams.delete('t');
        url.searchParams.delete('view');
      }
      history.replaceState(null, '', url);
    });
  });
  drawerButton?.addEventListener('click', () => {
    const open = !folders.some(folder => folder.open);
    folders.forEach(folder => { folder.open = open; });
    updateButton();
  });
  const requested = new URLSearchParams(location.search).get('t');
  const target = folders.find(folder => folder.dataset.tag === requested);
  if (target) {
    target.open = true;
    requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  }
  updateButton();
})();
