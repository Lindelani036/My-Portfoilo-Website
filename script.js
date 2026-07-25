/* ================================================================
   PORTFOLIO SCRIPT
   - Scroll-triggered right-to-left reveal (IntersectionObserver)
   - Active nav-link highlighting on scroll
   - Mobile nav toggle
   - Smooth scroll (CSS already handles it; JS closes mobile menu on click)
   - Certificate popup modal
   - Contact form handler (Formspree)
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Scroll-triggered reveal (right -> left) ---------- */
  // Every element with class "reveal-right" starts translated to the right
  // and opacity 0 (set in CSS). When it scrolls into the viewport, we add
  // "is-visible", which CSS transitions back to translateX(0) / opacity 1.
  const revealEls = document.querySelectorAll('.reveal-right');

  // Stagger cards that share a parent grid so they don't all animate at once.
  const grids = document.querySelectorAll('.projects-grid, .skills-grid, .certificates-grid, .timeline');
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

  /* ---------- 3.5 Certificate popup modal ---------- */
  const certCards = document.querySelectorAll('.cert-card');
  const certOverlay = document.getElementById('certModalOverlay');
  const certImage = document.getElementById('certModalImage');
  const certTitle = document.getElementById('certModalTitle');
  const certIssuer = document.getElementById('certModalIssuer');
  const certClose = document.getElementById('certModalClose');

  function openCertModal(card) {
    certImage.src = card.dataset.certImage;
    certImage.alt = card.dataset.certTitle || 'Certificate';
    certTitle.textContent = card.dataset.certTitle || '';
    certIssuer.textContent = [card.dataset.certIssuer, card.dataset.certDate]
      .filter(Boolean).join(' · ');
    certOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCertModal() {
    certOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  certCards.forEach((card) => {
    card.addEventListener('click', () => openCertModal(card));
  });

  certClose.addEventListener('click', closeCertModal);

  certOverlay.addEventListener('click', (e) => {
    if (e.target === certOverlay) closeCertModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certOverlay.classList.contains('open')) {
      closeCertModal();
    }
  });

  /* ---------- 4. Contact form (Formspree submission) ---------- */
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  const submitBtn = form.querySelector('.submit');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const endpoint = form.dataset.endpoint;
    const originalBtnText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    formNote.textContent = '';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        formNote.textContent = 'Thanks — your message has been sent!';
        form.reset();
      } else {
        const data = await response.json().catch(() => null);
        const msg = data && data.errors
          ? data.errors.map((err) => err.message).join(', ')
          : 'Something went wrong. Please try again or email me directly.';
        formNote.textContent = msg;
      }
    } catch (err) {
      formNote.textContent = 'Network error — please try again or email me directly.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
      setTimeout(() => { formNote.textContent = ''; }, 6000);
    }
  });

});