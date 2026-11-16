(() => {
  const button = document.querySelector('.random-post');
  const data = document.getElementById('random-post-urls');
  if (!button || !data) return;
  const urls = JSON.parse(data.textContent);
  button.disabled = !urls.length;
  button.addEventListener('click', () => {
    if (urls.length) window.location.assign(urls[Math.floor(Math.random() * urls.length)]);
  });
})();
