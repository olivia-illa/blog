// Keep readers on the blog when they follow a link to another website.
(function () {
  var script = document.querySelector('script[data-blog-url]');
  function hostname(url) {
    return url.hostname.replace(/^www\./, '');
  }
  var blogHosts = [hostname(new URL(window.location.href))];
  if (script && script.dataset.blogUrl) {
    blogHosts.push(hostname(new URL(script.dataset.blogUrl)));
  }

  document.querySelectorAll('a[href]').forEach(function (link) {
    var url;
    try { url = new URL(link.getAttribute('href'), window.location.href); }
    catch (e) { return; }
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
    if (blogHosts.indexOf(hostname(url)) !== -1) return;

    link.target = '_blank';
    link.relList.add('noopener', 'noreferrer');
  });
})();
