(() => {
  // ---------- Scroll-spy: highlight the nav link of the section in view ----------
  const links = [...document.querySelectorAll('.section-nav a')];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const setActive = (id) => {
    links.forEach((link) => {
      if (link.getAttribute('href') === '#' + id) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  if (!sections.length || !('IntersectionObserver' in window)) return;

  const visible = new Set();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });
      // The first section (in document order) crossing the reading line wins
      const current = sections.find((s) => visible.has(s));
      if (current) setActive(current.id);
    },
    { rootMargin: '-30% 0px -60% 0px' }
  );
  sections.forEach((s) => observer.observe(s));

  // Short last section may never reach the reading line: activate it at page bottom
  const sentinel = document.querySelector('.site-footer');
  if (sentinel) {
    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setActive(sections[sections.length - 1].id);
    }).observe(sentinel);
  }
  setActive(sections[0].id);
})();
