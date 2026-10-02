/* ============================================================
   RENOVONIX — SPACES, REIMAGINED
   Interaction, Comparison Slider & Formspree Engine
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. Navbar Scroll Effect ── */
  const navbar = document.getElementById('navbar');
  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  /* ── 2. Mobile Navigation Drawer ── */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileCloseBtn = document.getElementById('mobile-close-btn');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');

  function toggleMobileMenu(open) {
    if (!mobileDrawer) return;
    const shouldOpen = open !== undefined ? open : !mobileDrawer.classList.contains('open');
    mobileDrawer.classList.toggle('open', shouldOpen);
    if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', shouldOpen.toString());
    mobileDrawer.setAttribute('aria-hidden', (!shouldOpen).toString());
    document.body.style.overflow = shouldOpen ? 'hidden' : '';
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', () => toggleMobileMenu(true));
  if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', () => toggleMobileMenu(false));

  document.querySelectorAll('.mobile-nav-item').forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(false));
  });

  /* ── 3. Before → After Comparison Slider ── */
  const baContainer = document.getElementById('ba-container');
  const baWrapper = baContainer ? baContainer.querySelector('.ba-image-wrapper') : null;
  const baAfterClip = document.getElementById('ba-after-clip');
  const baHandle = document.getElementById('ba-handle');
  let isDraggingBA = false;

  function updateBA(xPercent) {
    const clamped = Math.max(0, Math.min(100, xPercent));
    if (baAfterClip) baAfterClip.style.width = `${clamped}%`;
    if (baHandle) {
      baHandle.style.left = `${clamped}%`;
      baHandle.setAttribute('aria-valuenow', Math.round(clamped).toString());
    }
  }

  function handleBAMove(clientX) {
    if (!baWrapper) return;
    const rect = baWrapper.getBoundingClientRect();
    const xPos = clientX - rect.left;
    const xPercent = (xPos / rect.width) * 100;
    updateBA(xPercent);
  }

  if (baWrapper && baHandle) {
    // Mouse events
    baWrapper.addEventListener('mousedown', e => {
      isDraggingBA = true;
      handleBAMove(e.clientX);
    });
    window.addEventListener('mousemove', e => {
      if (isDraggingBA) handleBAMove(e.clientX);
    });
    window.addEventListener('mouseup', () => { isDraggingBA = false; });

    // Touch events for mobile
    baWrapper.addEventListener('touchstart', e => {
      isDraggingBA = true;
      if (e.touches[0]) handleBAMove(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', e => {
      if (isDraggingBA && e.touches[0]) handleBAMove(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => { isDraggingBA = false; });

    // Keyboard accessibility
    baHandle.addEventListener('keydown', e => {
      let currentVal = parseFloat(baHandle.getAttribute('aria-valuenow') || '50');
      if (e.key === 'ArrowLeft') {
        updateBA(currentVal - 5);
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        updateBA(currentVal + 5);
        e.preventDefault();
      }
    });
  }

  /* ── 4. Before → After Project Switcher ── */
  const baProjects = [
    {
      title: 'KITCHEN RENOVATION',
      loc: 'HYDERABAD',
      before: 'images/kitchen_before.jpg',
      after: 'images/kitchen_after.jpg'
    },
    {
      title: 'LIVING SPACE OVERHAUL',
      loc: 'JUBILEE HILLS',
      before: 'images/living_room_renovation.png',
      after: 'images/project_apartment.jpg'
    },
    {
      title: 'SPA BATHROOM SUITE',
      loc: 'GACHIBOWLI',
      before: 'images/bathroom_renovation.png',
      after: 'images/dining_renovation.png'
    },
    {
      title: 'EXECUTIVE HOME WORKSPACE',
      loc: 'BANJARA HILLS',
      before: 'images/office_renovation.png',
      after: 'images/bedroom_renovation.png'
    }
  ];
  let currentBAIndex = 0;

  const baScopeTitle = document.getElementById('ba-scope-title');
  const baScopeLoc = document.getElementById('ba-scope-loc');
  const baCounter = document.getElementById('ba-counter');
  const baPrevBtn = document.getElementById('ba-prev-btn');
  const baNextBtn = document.getElementById('ba-next-btn');
  const baBeforeImg = baContainer ? baContainer.querySelector('.ba-img-before') : null;
  const baAfterImg = baContainer ? baContainer.querySelector('.ba-img-after') : null;

  function renderBAProject(index) {
    currentBAIndex = (index + baProjects.length) % baProjects.length;
    const proj = baProjects[currentBAIndex];
    if (baScopeTitle) baScopeTitle.textContent = proj.title;
    if (baScopeLoc) baScopeLoc.textContent = proj.loc;
    if (baCounter) baCounter.textContent = `0${currentBAIndex + 1} / 0${baProjects.length}`;
    if (baBeforeImg) baBeforeImg.src = proj.before;
    if (baAfterImg) baAfterImg.src = proj.after;
    updateBA(50); // Reset slider to center
  }

  if (baPrevBtn) baPrevBtn.addEventListener('click', () => renderBAProject(currentBAIndex - 1));
  if (baNextBtn) baNextBtn.addEventListener('click', () => renderBAProject(currentBAIndex + 1));

  /* ── 5. Services Accordion ── */
  const accRows = document.querySelectorAll('.service-acc-row');
  accRows.forEach(row => {
    const header = row.querySelector('.service-acc-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isActive = row.classList.contains('active');
      // Collapse others
      accRows.forEach(r => {
        r.classList.remove('active');
        const icon = r.querySelector('.service-acc-icon i');
        const btn = r.querySelector('.service-acc-header');
        if (icon) icon.className = 'fa-solid fa-plus';
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isActive) {
        row.classList.add('active');
        const icon = row.querySelector('.service-acc-icon i');
        if (icon) icon.className = 'fa-solid fa-minus';
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── 6. Testimonials Carousel ── */
  const testimonials = [
    {
      quote: "“The entire space feels completely different.”",
      name: "Priya S.",
      sub: "3 BHK · Kitchen + Living · Hyderabad",
      avatar: "images/avatar_priya.jpg",
      project: "images/testi_project.jpg"
    },
    {
      quote: "“The architectural execution and material detailing were masterclass.”",
      name: "Rajesh Varma",
      sub: "4 BHK Villa · Jubilee Hills · Hyderabad",
      avatar: "images/avatar_priya.jpg",
      project: "images/project_villa.jpg"
    },
    {
      quote: "“From spatial planning to the final reveal, the journey was effortless.”",
      name: "Ananya Mehta",
      sub: "Duplex Overhaul · Financial District",
      avatar: "images/avatar_priya.jpg",
      project: "images/project_apartment.jpg"
    }
  ];
  let currentTesti = 0;

  const testiQuoteText = document.getElementById('testi-quote-text');
  const testiAuthorName = document.getElementById('testi-author-name');
  const testiAuthorSub = document.getElementById('testi-author-sub');
  const testiProjectImg = document.getElementById('testi-project-img');
  const testiPrevBtn = document.getElementById('testi-prev-btn');
  const testiNextBtn = document.getElementById('testi-next-btn');

  function renderTestimonial(idx) {
    currentTesti = (idx + testimonials.length) % testimonials.length;
    const item = testimonials[currentTesti];
    if (testiQuoteText) testiQuoteText.textContent = item.quote;
    if (testiAuthorName) testiAuthorName.textContent = item.name;
    if (testiAuthorSub) testiAuthorSub.textContent = item.sub;
    if (testiProjectImg) testiProjectImg.src = item.project;
  }

  if (testiPrevBtn) testiPrevBtn.addEventListener('click', () => renderTestimonial(currentTesti - 1));
  if (testiNextBtn) testiNextBtn.addEventListener('click', () => renderTestimonial(currentTesti + 1));

  /* ── 7. Verified Formspree Contact Form Integration ── */
  const contactForm = document.getElementById('contact-form');
  const inquiryFormWrap = document.getElementById('inquiry-form-wrap');
  const formSuccessWrap = document.getElementById('form-success');
  const submitBtn = document.getElementById('form-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const nameField = document.getElementById('form-name');
      const emailField = document.getElementById('form-email');
      const phoneField = document.getElementById('form-phone');

      let isValid = true;
      [nameField, emailField, phoneField].forEach(field => {
        if (!field) return;
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.style.borderColor = '#c95353';
          isValid = false;
        }
      });

      if (!isValid) return;

      const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
      if (submitBtn) submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'Submitting your details...';

      try {
        const formData = new FormData(contactForm);
        const response = await fetch('https://formspree.io/f/xbglvezk', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        });

        if (response.ok) {
          if (inquiryFormWrap) inquiryFormWrap.style.display = 'none';
          if (formSuccessWrap) formSuccessWrap.style.display = 'block';
          contactForm.reset();
        } else {
          const data = await response.json().catch(() => ({}));
          alert(data.error || 'There was an issue sending your message. Please try again or call us directly.');
        }
      } catch (err) {
        alert('Network connection error. Please try again or call us directly.');
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (btnText) btnText.textContent = 'Start the Conversation';
      }
    });
  }

  /* ── 8. Smooth Internal Anchors ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#contact') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 76;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

})();

/* ── Global Modal Control Functions (Accessible to inline onclick) ── */
function openProjectModal(e) {
  if (e) e.preventDefault();
  const modal = document.getElementById('project-modal');
  const inquiryWrap = document.getElementById('inquiry-form-wrap');
  const successWrap = document.getElementById('form-success');
  if (inquiryWrap) inquiryWrap.style.display = 'block';
  if (successWrap) successWrap.style.display = 'none';
  if (modal) {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

/* ── Case Study & Service Detail Modals ── */
const caseStudies = {
  apartment: {
    title: 'Modern Apartment Overhaul',
    loc: '3 BHK · 2,200 Sq. Ft · Hyderabad',
    desc: 'A complete spatial transformation redefining open-plan living, concealing service zones, and introducing tailored fluted walnut and natural limestone panelling.',
    materials: ['Fluted Walnut', 'Textured Travertine', 'Brushed Brass', 'Calacatta Marble'],
    image: 'images/project_apartment.jpg'
  },
  villa: {
    title: 'Urban Villa Sanctuary',
    loc: '4 BHK · 4,500 Sq. Ft · Jubilee Hills',
    desc: 'An architectural overhaul establishing harmonious connections between interior living volumes, landscaped courtyards, and a bespoke gourmet island kitchen.',
    materials: ['Natural White Oak', 'Reeded Glass', 'Acoustic Panels', 'Microcement'],
    image: 'images/project_villa.jpg'
  }
};

function openCaseStudy(key) {
  const study = caseStudies[key];
  if (!study) return;
  const modal = document.getElementById('case-study-modal');
  const body = document.getElementById('case-study-body');
  if (!body || !modal) return;

  body.innerHTML = `
    <span class="modal-label">CASE STUDY</span>
    <h2 class="modal-title" style="color:var(--clr-white);">${study.title}</h2>
    <p style="color:var(--clr-sand);font-size:0.9rem;margin-bottom:24px;">${study.loc}</p>
    <div style="aspect-ratio:16/9;border-radius:4px;overflow:hidden;margin-bottom:24px;">
      <img src="${study.image}" alt="${study.title}" style="width:100%;height:100%;object-fit:cover;" />
    </div>
    <p style="color:rgba(247,243,236,0.85);line-height:1.7;margin-bottom:24px;">${study.desc}</p>
    <div style="margin-bottom:32px;">
      <strong style="display:block;font-size:0.85rem;color:var(--clr-sand);margin-bottom:12px;letter-spacing:0.1em;text-transform:uppercase;">Primary Materials</strong>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        ${study.materials.map(m => `<span style="padding:6px 14px;background:rgba(255,255,255,0.06);border:1px solid var(--clr-dark-border);border-radius:9999px;font-size:0.8rem;color:var(--clr-ivory);">${m}</span>`).join('')}
      </div>
    </div>
    <button class="btn btn-hero" onclick="closeCaseStudy(); openProjectModal();">
      <span>Discuss Similar Project</span>
      <i class="fa-solid fa-arrow-right"></i>
    </button>
  `;

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeCaseStudy() {
  const modal = document.getElementById('case-study-modal');
  if (modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

function openServiceDetail(service) {
  const serviceAcc = document.querySelector(`.service-acc-row[data-service="${service}"]`);
  const servicesSec = document.getElementById('services');
  if (servicesSec) {
    servicesSec.scrollIntoView({ behavior: 'smooth' });
    if (serviceAcc) {
      setTimeout(() => {
        const header = serviceAcc.querySelector('.service-acc-header');
        if (header) header.click();
      }, 500);
    }
  }
}

// ESC Key listener to close modals
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeProjectModal();
    closeCaseStudy();
  }
});
