/**
 * Jeevan D - Personal Portfolio Website
 * Pure Vanilla JavaScript (Human-crafted, lightweight & clean)
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Element References ---
  const themeToggle = document.getElementById('theme-toggle');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section[id]');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyBtnText = document.getElementById('copy-btn-text');
  const contactForm = document.getElementById('portfolio-contact-form');
  const formSuccessCard = document.getElementById('form-success-card');
  const writeAnotherBtn = document.getElementById('write-another-btn');
  const toast = document.getElementById('toast');
  const copyrightYear = document.getElementById('copyright-year');

  const JEEVAN_EMAIL = 'jeevandhandapani1930@gmail.com';

  // Set current year dynamically
  if (copyrightYear) {
    copyrightYear.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------------------------
     1. THEME SWITCHER (Light Mode as Default)
     -------------------------------------------------------------------------- */
  // Default to light theme as requested
  const savedTheme = localStorage.getItem('jeevan_portfolio_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const targetTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      document.documentElement.setAttribute('data-theme', targetTheme);
      localStorage.setItem('jeevan_portfolio_theme', targetTheme);
      showToast(`Switched to ${targetTheme} theme`);
    });
  }

  /* --------------------------------------------------------------------------
     2. MOBILE NAVIGATION MENU
     -------------------------------------------------------------------------- */
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close mobile menu when clicking any nav link
    navItems.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside of the navigation
    document.addEventListener('click', (event) => {
      if (!navLinks.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
        navLinks.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* --------------------------------------------------------------------------
     3. ACTIVE NAVIGATION SCROLL SPY
     -------------------------------------------------------------------------- */
  const updateActiveNavLink = () => {
    const scrollPosition = window.pageYOffset + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  /* --------------------------------------------------------------------------
     4. PROJECT CATEGORY FILTER
     -------------------------------------------------------------------------- */
  if (filterTabs.length && projectCards.length) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Toggle active tab style
        filterTabs.forEach(btn => btn.classList.remove('active'));
        tab.classList.add('active');

        const filterValue = tab.getAttribute('data-filter');

        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');

          if (filterValue === 'all' || category === filterValue) {
            card.style.display = 'flex';
            card.style.animation = 'fadeIn 0.4s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* --------------------------------------------------------------------------
     5. ONE-CLICK EMAIL COPY
     -------------------------------------------------------------------------- */
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(JEEVAN_EMAIL).then(() => {
          if (copyBtnText) copyBtnText.textContent = '✓ Copied!';
          showToast('Email address copied to clipboard!');
          setTimeout(() => {
            if (copyBtnText) copyBtnText.textContent = '📋 Copy Email';
          }, 2500);
        }).catch(() => {
          fallbackCopyText(JEEVAN_EMAIL);
        });
      } else {
        fallbackCopyText(JEEVAN_EMAIL);
      }
    });
  }

  function fallbackCopyText(text) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    tempInput.style.position = 'fixed';
    tempInput.style.opacity = '0';
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      if (copyBtnText) copyBtnText.textContent = '✓ Copied!';
      showToast('Email address copied to clipboard!');
      setTimeout(() => {
        if (copyBtnText) copyBtnText.textContent = '📋 Copy Email';
      }, 2500);
    } catch (err) {
      showToast(`Copy failed. Please write to ${text}`);
    }
    document.body.removeChild(tempInput);
  }

  /* --------------------------------------------------------------------------
     6. CONTACT FORM SUBMISSION & MAILTO INTEGRATION
     -------------------------------------------------------------------------- */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('user-name');
      const emailInput = document.getElementById('user-email');
      const subjectInput = document.getElementById('user-subject');
      const messageInput = document.getElementById('user-message');

      // Simple validation check
      if (!nameInput.value.trim() || !emailInput.value.trim() || !subjectInput.value.trim() || !messageInput.value.trim()) {
        showToast('Please fill out all required fields.');
        return;
      }

      const name = encodeURIComponent(nameInput.value.trim());
      const email = encodeURIComponent(emailInput.value.trim());
      const subject = encodeURIComponent(subjectInput.value.trim());
      const body = encodeURIComponent(`Hello Jeevan,\n\nName: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\n\nMessage:\n${messageInput.value.trim()}`);

      // Construct mailto link
      const mailtoLink = `mailto:${JEEVAN_EMAIL}?subject=${subject}&body=${body}`;

      // Open mail client
      window.location.href = mailtoLink;

      // Show friendly confirmation state
      contactForm.style.display = 'none';
      if (formSuccessCard) {
        formSuccessCard.style.display = 'block';
      }

      showToast('Opening your email app to send message...');
    });
  }

  if (writeAnotherBtn && contactForm && formSuccessCard) {
    writeAnotherBtn.addEventListener('click', () => {
      contactForm.reset();
      contactForm.style.display = 'flex';
      formSuccessCard.style.display = 'none';
    });
  }

  /* --------------------------------------------------------------------------
     7. TOAST NOTIFICATION HELPER
     -------------------------------------------------------------------------- */
  let toastTimer = null;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }
});
