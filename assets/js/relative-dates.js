// Refresh post ages against the reader's clock, including after a tab resumes.
(function () {
  var dateEls = document.querySelectorAll('.js-relative-date');
  if (!dateEls.length) return;

  var absoluteDate = new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  function updateDates() {
    var now = Date.now();
    dateEls.forEach(function (el) {
      var date = new Date(el.getAttribute('datetime'));
      if (isNaN(date.getTime())) return;
      var seconds = Math.max(0, Math.floor((now - date.getTime()) / 1000));
      var minutes = Math.floor(seconds / 60);
      var hours = Math.floor(seconds / 3600);
      var days = Math.floor(seconds / 86400);

      if (minutes <= 1) el.textContent = 'just now';
      else if (hours < 1) el.textContent = minutes + ' mins ago';
      else if (days < 1) el.textContent = hours + (hours === 1 ? ' hour ago' : ' hours ago');
      else if (days === 1) el.textContent = 'Yesterday';
      else if (days < 7) el.textContent = days + ' days ago';
      else el.textContent = absoluteDate.format(date);
    });
  }

  updateDates();
  setInterval(updateDates, 60000);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) updateDates();
  });
})();
