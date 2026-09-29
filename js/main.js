/**
 * GARUD CONSTRUCTIONS - INTERACTIVE JAVASCRIPT
 * Features: Dark/Light Mode Switcher, WhatsApp Chat Integration, Before/After Slider,
 * Portfolio Filter (Homes, Roads, Buildings), Stats Counter, Native Modals,
 * Local Construction Cost Estimator, Mobile Drawer, Form Validation & Notifications.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileMenu();
  initStatsCounters();
  initPortfolioFilters();
  initBeforeAfterSlider();
  initModals();
  initCostCalculator();
  initLeadForms();
});

/* ==========================================================================
   1. DARK / LIGHT THEME TOGGLE (Local Storage Persistent)
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  
  // Check preference: stored -> system -> default to 'dark' for sleek industrial look
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme ? savedTheme : (systemPrefersDark ? 'dark' : 'light');

  applyTheme(initialTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark');
      const newTheme = isDark ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    });
  });

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    updateThemeIcons(theme === 'dark');
  }

  function updateThemeIcons(isDark) {
    themeToggleBtns.forEach(btn => {
      const sunIcon = btn.querySelector('.theme-sun-icon');
      const moonIcon = btn.querySelector('.theme-moon-icon');
      if (sunIcon && moonIcon) {
        if (isDark) {
          sunIcon.classList.remove('hidden');
          moonIcon.classList.add('hidden');
          btn.setAttribute('aria-label', 'Switch to light mode');
          btn.setAttribute('title', 'Switch to light mode');
        } else {
          sunIcon.classList.add('hidden');
          moonIcon.classList.remove('hidden');
          btn.setAttribute('aria-label', 'Switch to dark mode');
          btn.setAttribute('title', 'Switch to dark mode');
        }
      }
    });
  }
}

/* ==========================================================================
   2. MOBILE MENU TOGGLE
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('close-mobile-drawer');
  const overlay = document.getElementById('drawer-overlay');

  if (!menuBtn || !mobileDrawer) return;

  function openDrawer() {
    mobileDrawer.classList.remove('translate-x-full');
    if (overlay) overlay.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    menuBtn.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    mobileDrawer.classList.add('translate-x-full');
    if (overlay) overlay.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    menuBtn.setAttribute('aria-expanded', 'false');
  }

  menuBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  mobileDrawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   3. ANIMATED STATS COUNTER
   ========================================================================== */
function initStatsCounters() {
  const counters = document.querySelectorAll('.counter-val');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target') || '0', 10);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000;
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
            clearInterval(timer);
          } else {
            el.textContent = `${prefix}${Math.floor(current).toLocaleString()}${suffix}`;
          }
        }, stepTime);

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.25 });

  counters.forEach(counter => observer.observe(counter));
}

/* ==========================================================================
   4. PORTFOLIO FILTERING (Homes, Roads, Buildings, Renovation)
   ========================================================================== */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active', 'bg-orange-600', 'text-white');
      });
      btn.classList.add('active', 'bg-orange-600', 'text-white');

      const filterCategory = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardCategory === filterCategory) {
          card.style.display = 'block';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transition = 'opacity 0.3s ease';
          }, 10);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. BEFORE & AFTER INTERACTIVE SLIDER
   ========================================================================== */
function initBeforeAfterSlider() {
  const sliderContainers = document.querySelectorAll('.before-after-container');

  sliderContainers.forEach(container => {
    const handle = container.querySelector('.slider-handle');
    const beforeWrap = container.querySelector('.before-img-wrap');
    if (!handle || !beforeWrap) return;

    let isDown = false;

    function move(clientX) {
      const rect = container.getBoundingClientRect();
      let xPos = clientX - rect.left;
      if (xPos < 0) xPos = 0;
      if (xPos > rect.width) xPos = rect.width;

      const percentage = (xPos / rect.width) * 100;
      handle.style.left = `${percentage}%`;
      beforeWrap.style.width = `${percentage}%`;
    }

    // Mouse Events
    handle.addEventListener('mousedown', () => { isDown = true; });
    window.addEventListener('mouseup', () => { isDown = false; });
    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      move(e.clientX);
    });

    // Touch Events
    handle.addEventListener('touchstart', () => { isDown = true; }, { passive: true });
    window.addEventListener('touchend', () => { isDown = false; });
    window.addEventListener('touchmove', (e) => {
      if (!isDown || !e.touches[0]) return;
      move(e.touches[0].clientX);
    }, { passive: true });

    container.addEventListener('click', (e) => {
      move(e.clientX);
    });
  });
}

/* ==========================================================================
   6. NATIVE MODAL DIALOGS (Quote Modal & Project Details)
   ========================================================================== */
function initModals() {
  const quoteModal = document.getElementById('quote-modal');
  const quoteButtons = document.querySelectorAll('.open-quote-modal-btn');
  const closeQuoteBtn = document.getElementById('close-quote-modal');

  if (quoteModal) {
    quoteButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        quoteModal.showModal();
      });
    });

    if (closeQuoteBtn) {
      closeQuoteBtn.addEventListener('click', () => quoteModal.close());
    }

    quoteModal.addEventListener('click', (e) => {
      const rect = quoteModal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        quoteModal.close();
      }
    });
  }

  // Project details modal
  const projectModal = document.getElementById('project-detail-modal');
  const projectTriggers = document.querySelectorAll('.view-project-detail-btn');
  const closeProjectBtn = document.getElementById('close-project-modal');

  if (projectModal && projectTriggers.length) {
    projectTriggers.forEach(btn => {
      btn.addEventListener('click', () => {
        const title = btn.getAttribute('data-title') || 'Project Overview';
        const client = btn.getAttribute('data-client') || 'Local Client';
        const budget = btn.getAttribute('data-budget') || 'Competitive Local Pricing';
        const duration = btn.getAttribute('data-duration') || 'On Schedule';
        const scope = btn.getAttribute('data-scope') || 'Full Construction Execution';
        const img = btn.getAttribute('data-img') || '';
        const description = btn.getAttribute('data-desc') || 'High-quality local construction tailored to community standards and client vision.';

        document.getElementById('modal-project-title').textContent = title;
        document.getElementById('modal-project-client').textContent = client;
        document.getElementById('modal-project-budget').textContent = budget;
        document.getElementById('modal-project-duration').textContent = duration;
        document.getElementById('modal-project-scope').textContent = scope;
        document.getElementById('modal-project-desc').textContent = description;
        if (img && document.getElementById('modal-project-img')) {
          document.getElementById('modal-project-img').src = img;
        }

        projectModal.showModal();
      });
    });

    if (closeProjectBtn) {
      closeProjectBtn.addEventListener('click', () => projectModal.close());
    }

    projectModal.addEventListener('click', (e) => {
      const rect = projectModal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        projectModal.close();
      }
    });
  }
}

/* ==========================================================================
   7. LOCAL CONSTRUCTION COST ESTIMATOR (Homes, Roads, Buildings)
   ========================================================================== */
function initCostCalculator() {
  const typeSelect = document.getElementById('calc-project-type');
  const sqftSlider = document.getElementById('calc-sqft-slider');
  const sqftDisplay = document.getElementById('calc-sqft-val');
  const finishGrade = document.querySelectorAll('input[name="calc-grade"]');
  const estimateOutput = document.getElementById('calc-estimated-range');
  const durationOutput = document.getElementById('calc-estimated-duration');

  if (!typeSelect || !sqftSlider || !estimateOutput) return;

  // Realistic localized rates for Home, Road, and Building construction
  const rates = {
    home: { base: 1650, multiplierStandard: 1.0, multiplierPremium: 1.3, multiplierHighEnd: 1.6, unit: 'sq. ft.', unitLabel: 'Square Feet' },
    road: { base: 450, multiplierStandard: 1.0, multiplierPremium: 1.25, multiplierHighEnd: 1.5, unit: 'sq. ft. / running ft.', unitLabel: 'Square Feet Paved' },
    building: { base: 1850, multiplierStandard: 1.0, multiplierPremium: 1.35, multiplierHighEnd: 1.7, unit: 'sq. ft.', unitLabel: 'Square Feet Built' },
    renovation: { base: 950, multiplierStandard: 1.0, multiplierPremium: 1.25, multiplierHighEnd: 1.55, unit: 'sq. ft.', unitLabel: 'Square Feet Remodeled' }
  };

  function updateEstimate() {
    const pType = typeSelect.value;
    const config = rates[pType] || rates.home;
    const sqft = parseInt(sqftSlider.value, 10);
    sqftDisplay.textContent = `${sqft.toLocaleString()} ${config.unit}`;

    let gradeMult = 1.0;
    finishGrade.forEach(radio => {
      if (radio.checked) {
        if (radio.value === 'premium') gradeMult = config.multiplierPremium;
        else if (radio.value === 'high-end') gradeMult = config.multiplierHighEnd;
      }
    });

    const baseUnitRate = config.base * gradeMult;
    const minEst = Math.round((sqft * baseUnitRate * 0.95) / 1000) * 1000;
    const maxEst = Math.round((sqft * baseUnitRate * 1.08) / 1000) * 1000;

    // Format as currency range (e.g., ₹ / $)
    estimateOutput.textContent = `₹${(minEst).toLocaleString('en-IN')} – ₹${(maxEst).toLocaleString('en-IN')}`;

    let months = Math.max(2, Math.round(sqft / 1200) + (pType === 'road' ? -1 : 1));
    if (pType === 'road') months = Math.max(1, Math.round(sqft / 8000));
    if (durationOutput) {
      durationOutput.textContent = `${months} - ${months + 2} Months`;
    }
  }

  typeSelect.addEventListener('change', updateEstimate);
  sqftSlider.addEventListener('input', updateEstimate);
  finishGrade.forEach(radio => radio.addEventListener('change', updateEstimate));

  updateEstimate();
}

/* ==========================================================================
   8. LEAD FORMS VALIDATION & SUBMISSION SIMULATION
   ========================================================================== */
function initLeadForms() {
  const forms = document.querySelectorAll('form[data-lead-form="true"]');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg> Submitting to Garud Team...
        `;
      }

      setTimeout(() => {
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }

        const quoteModal = document.getElementById('quote-modal');
        if (quoteModal && quoteModal.open) {
          quoteModal.close();
        }

        showToast('Estimate Request Received! Garud Constructions team will call you within 2 hours or message on WhatsApp.');
      }, 1100);
    });
  });
}

function showToast(message) {
  let toast = document.getElementById('custom-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'custom-toast';
    toast.className = 'fixed bottom-24 md:bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white px-6 py-4 rounded-lg shadow-2xl border-l-4 border-orange-500 transform transition-all duration-300 translate-y-10 opacity-0 flex items-start gap-4';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <div class="text-orange-500 mt-0.5">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    </div>
    <div>
      <h4 class="font-bold text-sm uppercase tracking-wider text-orange-400">Garud Constructions</h4>
      <p class="text-sm text-slate-200 mt-1">${message}</p>
    </div>
  `;

  setTimeout(() => {
    toast.classList.remove('translate-y-10', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-10', 'opacity-0');
  }, 5000);
}
