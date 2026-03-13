/* ================================================
   GARTEN & LANDSCHAFTSBAU — KIM
   Minimal JavaScript: mobile nav + header scroll
   FAQ accordion handled natively by <details>/<summary>
   ================================================ */

(function () {
  'use strict';

  /* ---- Mobile nav toggle ---- */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link, .mobile-menu__cta');

  if (hamburger && mobileMenu) {
    function toggleMenu(open) {
      hamburger.setAttribute('aria-expanded', String(open));
      hamburger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
      mobileMenu.classList.toggle('is-open', open);
      mobileMenu.setAttribute('aria-hidden', String(!open));
    }

    hamburger.addEventListener('click', function () {
      toggleMenu(hamburger.getAttribute('aria-expanded') !== 'true');
    });

    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () { toggleMenu(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
        toggleMenu(false);
        hamburger.focus();
      }
    });

    window.matchMedia('(min-width: 768px)').addEventListener('change', function (e) {
      if (e.matches) toggleMenu(false);
    });
  }

  /* ---- Header: compact + frosted glass on scroll ---- */
  const header = document.querySelector('.site-header');

  if (header) {
    function onScroll() {
      header.classList.toggle('is-scrolled', window.scrollY > 60);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load in case page is refreshed mid-scroll
  }

  /* ---- Hero Before/After toggle ---- */
  var heroBA    = document.getElementById('heroBA');
  var heroBaBtn = document.getElementById('heroBaBtn');

  if (heroBA && heroBaBtn) {
    var baAfterImg   = heroBA.querySelector('.hero__ba-img--after');
    var isAfterShown = false;

    heroBaBtn.addEventListener('click', function () {
      isAfterShown = !isAfterShown;
      heroBA.classList.toggle('is-after', isAfterShown);
      baAfterImg.setAttribute('aria-hidden', String(!isAfterShown));

      if (isAfterShown) {
        heroBaBtn.setAttribute('aria-label', 'Vorher-Bild anzeigen');
        heroBaBtn.innerHTML =
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
            '<path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>' +
          '</svg> Vorher ansehen';
      } else {
        heroBaBtn.setAttribute('aria-label', 'Nachher-Bild anzeigen');
        heroBaBtn.innerHTML =
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
            '<path d="M8 5v14l11-7z"/>' +
          '</svg> Nachher ansehen';
      }
    });
  }

  /* ---- Lightbox for portfolio images ---- */
  var portfolioImgs = document.querySelectorAll('.portfolio__item img');

  if (portfolioImgs.length) {
    var images = Array.from(portfolioImgs);
    var currentIndex = 0;

    // Build lightbox DOM
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Bildanzeige');
    lb.innerHTML =
      '<div class="lightbox__backdrop"></div>' +
      '<div class="lightbox__content">' +
        '<img class="lightbox__img" src="" alt="">' +
        '<p class="lightbox__caption"></p>' +
        '<p class="lightbox__counter"></p>' +
      '</div>' +
      '<button class="lightbox__close" aria-label="Schließen">&#x2715;</button>' +
      '<button class="lightbox__prev" aria-label="Vorheriges Bild">&#x2039;</button>' +
      '<button class="lightbox__next" aria-label="N\u00e4chstes Bild">&#x203A;</button>';
    document.body.appendChild(lb);

    var lbImg     = lb.querySelector('.lightbox__img');
    var lbCaption = lb.querySelector('.lightbox__caption');
    var lbCounter = lb.querySelector('.lightbox__counter');

    function updateLightbox() {
      var img = images[currentIndex];
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt;
      var fig = img.closest('figure');
      var cap = fig ? fig.querySelector('figcaption') : null;
      lbCaption.textContent = cap ? cap.textContent.trim() : '';
      lbCounter.textContent = (currentIndex + 1) + ' / ' + images.length;
    }

    function openLightbox(index) {
      currentIndex = index;
      updateLightbox();
      lb.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      lb.querySelector('.lightbox__close').focus();
    }

    function closeLightbox() {
      lb.classList.remove('is-open');
      document.body.style.overflow = '';
      images[currentIndex].focus();
    }

    function prevImage() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateLightbox();
    }

    function nextImage() {
      currentIndex = (currentIndex + 1) % images.length;
      updateLightbox();
    }

    // Make portfolio images clickable
    images.forEach(function (img, i) {
      img.style.cursor = 'zoom-in';
      img.setAttribute('tabindex', '0');
      img.addEventListener('click', function () { openLightbox(i); });
      img.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); }
      });
    });

    // Lightbox controls
    lb.querySelector('.lightbox__backdrop').addEventListener('click', closeLightbox);
    lb.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
    lb.querySelector('.lightbox__prev').addEventListener('click', prevImage);
    lb.querySelector('.lightbox__next').addEventListener('click', nextImage);

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape')      closeLightbox();
      if (e.key === 'ArrowLeft')   prevImage();
      if (e.key === 'ArrowRight')  nextImage();
    });
  }

}());
