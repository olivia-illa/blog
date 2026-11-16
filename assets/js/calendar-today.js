// Use the blog owner's timezone, independent of the reader's device timezone.
(() => {
  const calendar = document.querySelector('.post-calendar');
  const template = document.getElementById('calendar-token-template');
  if (!calendar || !template) return;

  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit'
  });
  let markedDate;

  function updateToday() {
    const parts = Object.fromEntries(formatter.formatToParts(new Date()).map(part => [part.type, part.value]));
    const today = `${parts.year}-${parts.month}-${parts.day}`;
    if (today === markedDate) return;
    markedDate = today;
    calendar.querySelector('.calendar-token')?.remove();
    calendar.querySelector('[aria-current="date"]')?.removeAttribute('aria-current');
    const date = calendar.querySelector(`time[datetime="${today}"]`);
    if (!date) return;
    date.setAttribute('aria-current', 'date');
    date.closest('td').append(template.content.cloneNode(true));
  }

  calendar.addEventListener('click', event => {
    const token = event.target.closest('.calendar-token');
    if (!token) return;
    token.classList.remove('is-jiggling');
    void token.offsetWidth;
    token.classList.add('is-jiggling');
  });
  calendar.addEventListener('animationend', event => {
    if (event.animationName === 'thimble-jiggle') event.target.classList.remove('is-jiggling');
  });

  updateToday();
  setInterval(updateToday, 60000);
  document.addEventListener('visibilitychange', updateToday);
})();
