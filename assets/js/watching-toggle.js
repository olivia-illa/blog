(function () {
  var humanButton = document.querySelector('.human-toggle');
  if (humanButton) {
    humanButton.addEventListener('click', function () {
      humanButton.classList.remove('is-poofing');
      void humanButton.offsetWidth;
      humanButton.classList.add('is-poofing');
      var status = document.querySelector('.human-status');
      var human = status.textContent !== 'I am only human';
      status.replaceChildren();
      if (human) {
        var emphasis = document.createElement('em');
        emphasis.textContent = 'only';
        status.append('I am ', emphasis, ' human');
      } else {
        status.textContent = 'I am not a robot';
      }
      humanButton.setAttribute('aria-pressed', String(human));
    });
    humanButton.addEventListener('animationend', function () {
      humanButton.classList.remove('is-poofing');
    });
  }
})();

(function () {
  var button = document.querySelector('.watching-toggle');
  if (!button) return;
  var titles = document.getElementById(button.getAttribute('aria-controls'));
  button.addEventListener('click', function () {
    var expanded = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(expanded));
    button.setAttribute('aria-label', expanded ? 'Hide recent watches' : 'Show recent watches');
    titles.hidden = !expanded;
  });
})();
