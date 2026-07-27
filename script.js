(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const loader = $('#pageLoader');
  window.addEventListener('load', () => {
    window.setTimeout(() => loader?.classList.add('is-hidden'), reduceMotion ? 0 : 280);
  });

  const header = $('#siteHeader');
  const toggleHeader = () => header?.classList.toggle('scrolled', window.scrollY > 26);
  window.addEventListener('scroll', toggleHeader, { passive: true });
  toggleHeader();

  const menuToggle = $('#menuToggle');
  const mobileNav = $('#mobileNav');
  const closeMenu = () => {
    mobileNav?.classList.remove('open');
    document.body.classList.remove('menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  };
  menuToggle?.addEventListener('click', () => {
    const isOpen = mobileNav?.classList.toggle('open');
    document.body.classList.toggle('menu-open', Boolean(isOpen));
    menuToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
  });
  $$('#mobileNav a').forEach(link => link.addEventListener('click', closeMenu));

  const observer = !reduceMotion && 'IntersectionObserver' in window
    ? new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: .12 })
    : null;
  $$('.reveal').forEach(el => observer ? observer.observe(el) : el.classList.add('visible'));


  const packageInputs = $$('input[name="package"][data-price]');
  const packagePicker = $('#packagePicker');
  const booking = $('#booking');
  const totalAmount = $('#totalAmount');
  const totalAmountInput = $('#totalAmountInput');
  const advanceAmount = $('#advanceAmount');
  const dueAmount = $('#dueAmount');
  const advancePreview = $('#advancePreview');
  const duePreview = $('#duePreview');
  const selectedPackageList = $('#selectedPackageList');
  let lastPaymentEdit = 'advance';

  const formatTaka = amount => `৳${Math.max(0, Math.round(Number(amount) || 0)).toLocaleString('en-IN')}`;
  const getSelectedPackageInputs = () => packageInputs.filter(input => input.checked);
  const getPackageTotal = () => getSelectedPackageInputs().reduce((sum, input) => sum + (Number(input.dataset.price) || 0), 0);
  const cleanAmount = value => Math.max(0, Number(value) || 0);
  const setInputValue = (input, amount) => {
    if (!input) return;
    input.value = amount > 0 ? String(Math.round(amount)) : '';
  };
  const updateBookingAmounts = (source = lastPaymentEdit) => {
    const total = getPackageTotal();
    const selectedPackages = getSelectedPackageInputs().map(input => input.value);
    let advance = cleanAmount(advanceAmount?.value);
    let due = cleanAmount(dueAmount?.value);

    if (source === 'due') {
      due = Math.min(due, total);
      advance = Math.max(total - due, 0);
      setInputValue(advanceAmount, advance);
    } else {
      advance = Math.min(advance, total);
      due = Math.max(total - advance, 0);
      setInputValue(dueAmount, due);
    }

    if (totalAmount) totalAmount.textContent = formatTaka(total);
    if (totalAmountInput) totalAmountInput.value = String(total);
    if (advancePreview) advancePreview.textContent = formatTaka(advance);
    if (duePreview) duePreview.textContent = formatTaka(due);
    if (selectedPackageList) selectedPackageList.textContent = selectedPackages.length ? selectedPackages.join(' + ') : 'No package selected yet.';
  };

  packageInputs.forEach(input => {
    input.addEventListener('change', () => updateBookingAmounts());
  });
  advanceAmount?.addEventListener('input', () => {
    lastPaymentEdit = 'advance';
    updateBookingAmounts('advance');
  });
  dueAmount?.addEventListener('input', () => {
    lastPaymentEdit = 'due';
    updateBookingAmounts('due');
  });

  $$('.choose-package').forEach(button => {
    button.addEventListener('click', () => {
      const value = button.dataset.package;
      if (!value) return;
      const packageInput = packageInputs.find(input => input.value === value);
      if (packageInput) {
        packageInput.checked = true;
        updateBookingAmounts();
      }
      booking?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      window.setTimeout(() => packageInput?.focus({ preventScroll: true }), reduceMotion ? 0 : 650);
    });
  });
  updateBookingAmounts();

  const galleryItems = [
    { file: "ra-photo-01.webp", title: "Wedding Keepsakes", category: "details", alt: "Wedding gifts and keepsakes arranged before the ceremony", layout: "wide" },
    { file: "ra-photo-02.webp", title: "Family Celebration", category: "rituals", alt: "Family members surrounding the bride during a joyful wedding ritual", layout: "wide" },
    { file: "ra-photo-03.webp", title: "Grand Entrance", category: "rituals", alt: "Bride entering beneath a colorful wedding canopy", layout: "wide" },
    { file: "ra-photo-04.webp", title: "Mirror Moment", category: "couples", alt: "Wedding couple reflected together in a decorative mirror", layout: "wide" },
    { file: "ra-photo-05.webp", title: "Bridal Glow", category: "portraits", alt: "Close bridal portrait with traditional jewelry and red attire", layout: "tall" },
    { file: "ra-photo-06.webp", title: "Ceremony Details", category: "details", alt: "Wedding accessories and ceremonial details arranged together", layout: "wide" },
    { file: "ra-photo-07.webp", title: "Rooftop Embrace", category: "couples", alt: "Wedding couple embracing during a rooftop portrait session", layout: "tall" },
    { file: "ra-photo-08.webp", title: "Red Bridal Story", category: "portraits", alt: "Bride in a red veil posing against a floral wedding backdrop", layout: "wide" },
    { file: "ra-photo-09.webp", title: "Mehendi Hands", category: "details", alt: "Detailed bridal mehendi on both hands", layout: "wide" },
    { file: "ra-photo-10.webp", title: "A Shared Smile", category: "couples", alt: "Wedding couple sharing a warm smile on stage", layout: "wide" },
    { file: "ra-photo-11.webp", title: "Holud Romance", category: "couples", alt: "Holud couple standing beneath a leafy outdoor tunnel", layout: "wide" },
    { file: "ra-photo-12.webp", title: "Floral Stage", category: "couples", alt: "Wedding couple posing together on a flower-filled stage", layout: "tall" },
    { file: "ra-photo-13.webp", title: "Quiet Together", category: "couples", alt: "Couple sharing a quiet moment in front of a wedding backdrop", layout: "wide" },
    { file: "ra-photo-14.webp", title: "Promise in Focus", category: "couples", alt: "Wedding rings in focus with the smiling couple behind", layout: "wide" },
    { file: "ra-photo-15.webp", title: "Bridal Shoes", category: "details", alt: "Bridal shoes arranged with rose petals", layout: "wide" },
    { file: "ra-photo-16.webp", title: "Green Escape", category: "couples", alt: "Couple portrait surrounded by fresh green trees", layout: "tall" },
    { file: "ra-photo-17.webp", title: "Garden Portrait", category: "portraits", alt: "Bride posing outdoors against a deep green garden wall", layout: "wide" },
    { file: "ra-photo-18.webp", title: "Playful Distance", category: "couples", alt: "Couple reaching toward each other beside a brick wall", layout: "wide" },
    { file: "ra-photo-19.webp", title: "The Ring", category: "details", alt: "Wedding ring and bangles highlighted in the foreground", layout: "wide" },
    { file: "ra-photo-20.webp", title: "Seated Together", category: "couples", alt: "Bride and groom sharing an intimate seated portrait", layout: "wide" },
    { file: "ra-photo-21.webp", title: "Night Bride", category: "portraits", alt: "Moody bridal portrait photographed at night", layout: "tall" },
    { file: "ra-photo-22.webp", title: "Soft Ceremony", category: "couples", alt: "Wedding couple in soft pastel attire during their ceremony", layout: "wide" },
    { file: "ra-photo-23.webp", title: "Pastel Bride", category: "portraits", alt: "Pastel bridal portrait with delicate makeup and jewelry", layout: "tall" },
    { file: "ra-photo-24.webp", title: "Golden Detail", category: "portraits", alt: "Close bridal portrait highlighting jewelry and henna", layout: "tall" },
    { file: "ra-photo-25.webp", title: "Colorful Holud", category: "couples", alt: "Holud couple in bright coordinated traditional outfits", layout: "tall" },
    { file: "ra-photo-26.webp", title: "Holud in the Open", category: "couples", alt: "Full-length Holud couple portrait in an outdoor setting", layout: "tall" },
    { file: "ra-photo-27.webp", title: "Lights After Dark", category: "portraits", alt: "Bride photographed against blue decorative lights at night", layout: "tall" },
    { file: "ra-photo-28.webp", title: "Ritual Connection", category: "rituals", alt: "Hands joining during a colorful wedding ritual", layout: "wide" },
    { file: "ra-photo-29.webp", title: "Traditional Keepsake", category: "details", alt: "Traditional wedding accessories arranged inside a woven basket", layout: "wide" },
    { file: "ra-photo-30.webp", title: "Ceremony Offering", category: "rituals", alt: "Colorful ceremonial offering arranged for a wedding ritual", layout: "wide" },
    { file: "ra-photo-31.webp", title: "Classic Red Bride", category: "portraits", alt: "Traditional red bridal portrait with soft floral background", layout: "tall" },
    { file: "ra-photo-32.webp", title: "A Sideward Look", category: "portraits", alt: "Bride in red attire looking to the side during her portrait", layout: "tall" },
    { file: "ra-photo-33.webp", title: "Veil Between Us", category: "couples", alt: "Wedding couple sharing a moment beneath a red veil", layout: "wide" },
    { file: "ra-photo-34.webp", title: "White Wedding", category: "couples", alt: "White wedding couple smiling together in soft daylight", layout: "wide" },
    { file: "ra-photo-35.webp", title: "Together in White", category: "couples", alt: "White wedding couple showing matching floral wrist details", layout: "wide" },
    { file: "ra-photo-36.webp", title: "Under the Trees", category: "couples", alt: "Wedding couple looking at each other beneath green trees", layout: "tall" },
    { file: "ra-photo-37.webp", title: "Forest Walk", category: "couples", alt: "Elegant couple portrait in a sunlit forest", layout: "wide" },
    { file: "ra-photo-38.webp", title: "Forest Closeup", category: "couples", alt: "Close couple portrait surrounded by woodland greenery", layout: "tall" },
    { file: "ra-photo-39.webp", title: "Signing the Story", category: "rituals", alt: "Bride and groom signing their marriage documents", layout: "wide" },
    { file: "ra-photo-40.webp", title: "Holud Flowers", category: "portraits", alt: "Holud bride wearing floral jewelry in a garden", layout: "tall" },
    { file: "ra-photo-41.webp", title: "Veiled Joy", category: "portraits", alt: "Smiling bride beneath a red wedding veil", layout: "tall" },
    { file: "ra-photo-42.webp", title: "Henna and Flowers", category: "details", alt: "Bridal henna and floral jewelry shown in close detail", layout: "tall" },
    { file: "ra-photo-43.webp", title: "Outdoor Red Bride", category: "portraits", alt: "Bride in red and white attire walking outdoors", layout: "tall" },
    { file: "ra-photo-44.webp", title: "Bridal Detail", category: "portraits", alt: "Close bridal portrait highlighting intricate red jewelry", layout: "tall" },
    { file: "ra-photo-45.webp", title: "Hands of Blessing", category: "rituals", alt: "Bride surrounded by colorful hands during a Holud ritual", layout: "wide" },
    { file: "ra-photo-46.webp", title: "Close Together", category: "couples", alt: "Bride and groom standing close during an outdoor portrait", layout: "tall" },
    { file: "ra-photo-47.webp", title: "Color in Every Hand", category: "rituals", alt: "Brightly colored hands arranged around the Holud bride", layout: "wide" },
    { file: "ra-photo-48.webp", title: "The Red Veil", category: "portraits", alt: "Bride photographed from behind beneath a flowing red veil", layout: "tall" },
    { file: "ra-photo-49.webp", title: "Garden Couple", category: "couples", alt: "Wedding couple posing together beside a green garden wall", layout: "tall" },
    { file: "ra-photo-50.webp", title: "Modern Garden Story", category: "couples", alt: "Modern wedding couple portrait against lush green foliage", layout: "wide" },
    { file: "ra-photo-51.webp", title: "Grand Arrival", category: "rituals", alt: "Wedding party gathering around the car during the grand arrival", layout: "wide" },
    { file: "ra-photo-52.webp", title: "Ring Ceremony", category: "details", alt: "A wedding ring being placed during the ceremony", layout: "wide" },
    { file: "ra-photo-53.webp", title: "Promise on Her Hand", category: "details", alt: "Close view of a ring and bridal henna during the wedding ceremony", layout: "wide" },
    { file: "ra-photo-54.webp", title: "A Sweet Tradition", category: "rituals", alt: "Bride and groom sharing a sweet bite during a wedding ritual", layout: "wide" },
    { file: "ra-photo-55.webp", title: "Walk to the Stage", category: "rituals", alt: "Bride and groom walking toward the stage with family", layout: "wide" },
    { file: "ra-photo-56.webp", title: "Family Blessing", category: "rituals", alt: "An elder blessing the bride during the wedding celebration", layout: "wide" },
    { file: "ra-photo-57.webp", title: "Cake and Celebration", category: "rituals", alt: "Bride and groom cutting their wedding cake together", layout: "wide" },
    { file: "ra-photo-58.webp", title: "Candlelit Detail", category: "details", alt: "Decorative candles and a metallic flower arranged for the ceremony", layout: "wide" },
    { file: "ra-photo-59.webp", title: "Peach Bridal Twirl", category: "portraits", alt: "Bride in a flowing peach dress turning on the wedding stage", layout: "tall" },
    { file: "ra-photo-60.webp", title: "Rose Bridal Portrait", category: "portraits", alt: "Bride in rose-toned wedding attire posing against a floral backdrop", layout: "tall" },
    { file: "ra-photo-61.webp", title: "Ceremony Exchange", category: "rituals", alt: "Bride and groom exchanging a ceremonial item during the wedding", layout: "wide" },
    { file: "ra-photo-62.webp", title: "Standing in Red", category: "portraits", alt: "Full-length red bridal portrait on a softly decorated wedding stage", layout: "tall" },
    { file: "ra-photo-63.webp", title: "Sacred Ceremony", category: "rituals", alt: "Bride and groom surrounded by family during a traditional ceremony", layout: "wide" },
    { file: "ra-photo-64.webp", title: "Red and Ivory", category: "couples", alt: "Bride and groom sharing a close portrait in red and ivory attire", layout: "tall" },
    { file: "ra-photo-65.webp", title: "Rooftop Ease", category: "couples", alt: "Couple enjoying a relaxed rooftop portrait at sunset", layout: "tall" },
    { file: "ra-photo-66.webp", title: "City Lights Bride", category: "portraits", alt: "Bride photographed near a glowing city bridge at night", layout: "tall" },
    { file: "ra-photo-67.webp", title: "After-Dark Promise", category: "couples", alt: "Couple sharing a quiet nighttime portrait outside a mosque", layout: "tall" },
    { file: "ra-photo-68.webp", title: "Veiled Smile", category: "portraits", alt: "Smiling bride beneath a deep red veil in soft light", layout: "tall" },
    { file: "ra-photo-69.webp", title: "Henna in Bloom", category: "details", alt: "Floral henna design shown closely on the bride's hand", layout: "tall" },
    { file: "ra-photo-70.webp", title: "Holud Affection", category: "rituals", alt: "Family members applying turmeric during a joyful Holud ritual", layout: "tall" },
    { file: "ra-photo-71.webp", title: "Friends Around Her", category: "rituals", alt: "Bride surrounded by friends during a colorful pre-wedding celebration", layout: "wide" },
    { file: "ra-photo-72.webp", title: "Sari Steps", category: "details", alt: "Detailed view of a red and white wedding sari while walking", layout: "tall" },
    { file: "ra-photo-73.webp", title: "Engagement Glow", category: "couples", alt: "Engaged couple smiling together during their stage portrait", layout: "tall" },
    { file: "ra-photo-74.webp", title: "Matching Rings", category: "details", alt: "Bride and groom holding up their wedding rings together", layout: "wide" },
    { file: "ra-photo-75.webp", title: "Holud Shower", category: "rituals", alt: "Joyful water splash during an outdoor Holud celebration", layout: "wide" },
    { file: "ra-photo-76.webp", title: "Color Play", category: "couples", alt: "Couple sharing playful Holud color during an outdoor celebration", layout: "tall" },
    { file: "ra-photo-77.webp", title: "Golden Bridal Gaze", category: "portraits", alt: "Close bridal portrait with soft golden makeup and jewelry", layout: "tall" },
    { file: "ra-photo-78.webp", title: "Wedding Close", category: "couples", alt: "Bride and groom standing close during a classic wedding portrait", layout: "tall" },
    { file: "ra-photo-79.webp", title: "Rings Awaiting", category: "details", alt: "Wedding rings presented in elegant navy ring boxes", layout: "wide" },
    { file: "ra-photo-80.webp", title: "Minimalist Together", category: "couples", alt: "Couple posing apart against a clean minimalist wall", layout: "wide" }
  ];

  const galleryGrid = $('#galleryGrid');
  let activeFilter = 'all';
  let activeGalleryIndex = 0;
  let activeFilmIndex = 0;
  let activeModalType = 'gallery';
  let focusBeforeModal = null;

  const getVisibleGallery = () => galleryItems.filter(item => activeFilter === 'all' || item.category === activeFilter);
  const renderGallery = () => {
    if (!galleryGrid) return;
    const visibleItems = getVisibleGallery();
    if (!visibleItems.length) {
      galleryGrid.innerHTML = '<p class="gallery-empty">No frames found in this collection.</p>';
      return;
    }
    galleryGrid.innerHTML = visibleItems.map((item, index) => `
      <button class="gallery-item ${item.layout}" type="button" data-gallery-index="${index}" aria-label="Open ${item.title}">
        <img src="assets/new-media/photos/${item.file}" alt="${item.alt}" loading="lazy" />
        <span class="gallery-caption"><span>${item.category}</span><b>${String(index + 1).padStart(2, '0')}</b></span>
      </button>`).join('');
    $$('.gallery-item', galleryGrid).forEach(button => {
      button.addEventListener('click', () => {
        activeGalleryIndex = Number(button.dataset.galleryIndex || 0);
        openGalleryMedia(activeGalleryIndex);
      });
    });
  };

  $$('.gallery-filter').forEach(button => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter || 'all';
      $$('.gallery-filter').forEach(control => {
        const active = control === button;
        control.classList.toggle('active', active);
        control.setAttribute('aria-selected', String(active));
      });
      renderGallery();
    });
  });
  renderGallery();

  const modal = $('#mediaModal');
  const modalStage = $('#modalStage');
  const modalClose = $('#modalClose');
  const modalPrevious = $('#modalPrev');
  const modalNext = $('#modalNext');
  const filmCards = $$('.film-card[data-video]');
  const filmItems = filmCards.map(card => ({
    video: card.dataset.video || '',
    poster: card.dataset.poster || '',
    title: card.dataset.title || 'RA Photography wedding film'
  }));

  const setModal = content => {
    if (!modal || !modalStage) return;
    if (!modal.classList.contains('open')) focusBeforeModal = document.activeElement;
    modalStage.innerHTML = content;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    window.setTimeout(() => modalClose?.focus(), 30);
  };

  const openGalleryMedia = index => {
    activeModalType = 'gallery';
    const visibleItems = getVisibleGallery();
    if (!visibleItems.length) return;
    activeGalleryIndex = (index + visibleItems.length) % visibleItems.length;
    const item = visibleItems[activeGalleryIndex];
    setModal(`<figure><img src="assets/new-media/photos/${item.file}" alt="${item.alt}" /><figcaption>${item.title} — RA Photography</figcaption></figure>`);
  };

  const openFilmMedia = index => {
    if (!filmItems.length) return;
    activeModalType = 'film';
    activeFilmIndex = (index + filmItems.length) % filmItems.length;
    const item = filmItems[activeFilmIndex];
    setModal(`<figure class="video-figure"><video src="${item.video}" poster="${item.poster}" controls autoplay playsinline preload="metadata"></video><figcaption>${item.title} — RA Photography</figcaption></figure>`);
  };

  filmCards.forEach((card, index) => {
    card.addEventListener('click', () => openFilmMedia(index));
  });

  const closeModal = () => {
    if (!modal?.classList.contains('open')) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    window.setTimeout(() => { if (modalStage) modalStage.innerHTML = ''; }, 250);
    focusBeforeModal?.focus?.();
  };

  modalClose?.addEventListener('click', closeModal);
  modalPrevious?.addEventListener('click', () => {
    if (activeModalType === 'film') openFilmMedia(activeFilmIndex - 1);
    else openGalleryMedia(activeGalleryIndex - 1);
  });
  modalNext?.addEventListener('click', () => {
    if (activeModalType === 'film') openFilmMedia(activeFilmIndex + 1);
    else openGalleryMedia(activeGalleryIndex + 1);
  });
  modal?.addEventListener('click', event => { if (event.target === modal) closeModal(); });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeModal();
      closeMenu();
    }
    if (!modal?.classList.contains('open')) return;
    if (event.key === 'ArrowLeft') {
      if (activeModalType === 'film') openFilmMedia(activeFilmIndex - 1);
      else openGalleryMedia(activeGalleryIndex - 1);
    }
    if (event.key === 'ArrowRight') {
      if (activeModalType === 'film') openFilmMedia(activeFilmIndex + 1);
      else openGalleryMedia(activeGalleryIndex + 1);
    }
  });

  const dateInput = $('#eventDate');
  if (dateInput) {
    const now = new Date();
    dateInput.min = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }

  const bookingForm = $('#bookingForm');
  const formNote = $('#formNote');
  bookingForm?.addEventListener('submit', event => {
    event.preventDefault();
    if (!bookingForm.reportValidity()) return;

    const selectedPackages = getSelectedPackageInputs().map(input => input.value);
    if (!selectedPackages.length) {
      if (formNote) formNote.textContent = 'Please choose at least one package before continuing.';
      packagePicker?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      packageInputs[0]?.focus({ preventScroll: true });
      return;
    }

    updateBookingAmounts(lastPaymentEdit);
    const fields = new FormData(bookingForm);
    const total = getPackageTotal();
    const advance = cleanAmount(advanceAmount?.value);
    const due = cleanAmount(dueAmount?.value);
    const info = {
      name: String(fields.get('name') || '').trim(),
      phone: String(fields.get('phone') || '').trim(),
      bride: String(fields.get('brideName') || '').trim(),
      groom: String(fields.get('groomName') || '').trim(),
      type: String(fields.get('eventType') || '').trim(),
      date: String(fields.get('eventDate') || '').trim(),
      shift: String(fields.get('shift') || '').trim(),
      location: String(fields.get('location') || '').trim(),
      packages: selectedPackages.join(' + '),
      total: formatTaka(total),
      advance: formatTaka(advance),
      due: formatTaka(due),
      payment: String(fields.get('paymentMethod') || '').trim(),
      message: String(fields.get('message') || '').trim() || 'No additional requirements.'
    };
    const message = `Hello RA Photography,

I would like to enquire about wedding coverage.

Name: ${info.name}
Phone: ${info.phone}
Bride name: ${info.bride}
Groom name: ${info.groom}
Event type: ${info.type}
Event date: ${info.date}
Shift: ${info.shift}
Location: ${info.location}
Preferred package(s): ${info.packages}
Total amount: ${info.total}
Advance amount: ${info.advance}
Due amount: ${info.due}
Payment with: ${info.payment}
Message: ${info.message}`;
    const phone = bookingForm.dataset.whatsapp || '8801921667574';
    if (formNote) formNote.textContent = 'Opening WhatsApp with your booking message…';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    window.setTimeout(() => { if (formNote) formNote.textContent = 'Your details stay in your browser until you choose to send the WhatsApp message.'; }, 3500);
  });

  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
