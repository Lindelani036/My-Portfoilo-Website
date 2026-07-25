/* ================================================================
   PORTFOLIO SCRIPT
   - Scroll-triggered right-to-left reveal (IntersectionObserver)
   - Active nav-link highlighting on scroll
   - Mobile nav toggle
   - Smooth scroll (CSS already handles it; JS closes mobile menu on click)
   - Simple front-end-only contact form handler
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Scroll-triggered reveal (right -> left) ---------- */
  // Every element with class "reveal-right" starts translated to the right
  // and opacity 0 (set in CSS). When it scrolls into the viewport, we add
  // "is-visible", which CSS transitions back to translateX(0) / opacity 1.
  const revealEls = document.querySelectorAll('.reveal-right');

  // Stagger cards that share a parent grid so they don't all animate at once.
  const grids = document.querySelectorAll('.projects-grid, .skills-grid, .timeline');
  grids.forEach((grid) => {
    const items = grid.querySelectorAll('.reveal-right');
    items.forEach((item, i) => {
      item.style.setProperty('--stagger', `${i * 0.12}s`);
    });
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // animate once
      }
    });
  }, {
    threshold: 0.15,          // fire when 15% of the element is visible
    rootMargin: '0px 0px -60px 0px'
  });

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- 2. Active nav-link highlighting ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, {
    threshold: 0.4,
    rootMargin: '-80px 0px -50% 0px'
  });

  sections.forEach((section) => navObserver.observe(section));

  /* ---------- 3. Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinksList = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navLinksList.classList.toggle('open');
  });

  // Close mobile menu after a link is tapped
  navLinksList.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinksList.classList.remove('open');
    });
  });

  /* ---------- 4. Contact form (front-end only, no backend) ---------- */
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  form.addEventListener('submit', (e) => {
    e.preventDefault();


    formNote.textContent = 'Thanks — your message has been noted. (Demo only: no email was sent.)';
    form.reset();

    setTimeout(() => { formNote.textContent = ''; }, 5000);
  });

});
