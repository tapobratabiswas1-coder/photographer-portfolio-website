/* ═══════════════════════════════════════════════════════
   CREATIVE PORTFOLIO — Main JavaScript
   Author: Professional Frontend Developer
   Version: 1.0.0
   ═══════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ─── DOM Cache ─────────────────────────────────── */
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    const navbar          = $('#navbar');
    const hamburgerBtn    = $('#hamburgerBtn');
    const navMenu         = $('#navMenu');
    const navLinks        = $$('.navbar__link');
    const scrollTopBtn    = $('#scrollTopBtn');
    const galleryGrid     = $('#galleryGrid');
    const lightbox        = $('#lightbox');
    const lightboxImage   = $('#lightboxImage');
    const lightboxCaption = $('#lightboxCaption');
    const lightboxCounter = $('#lightboxCounter');
    const lightboxClose   = $('#lightboxClose');
    const lightboxPrev    = $('#lightboxPrev');
    const lightboxNext    = $('#lightboxNext');
    const contactForm     = $('#contactForm');
    const testimonialTrack = $('#testimonialTrack');


    /* ═══════════════════════════════════════════════════
       PRELOADER
       ═══════════════════════════════════════════════════ */
    window.addEventListener('load', function () {
        const preloader = $('#preloader');
        if (preloader) {
            setTimeout(function () {
                preloader.classList.add('hidden');
            }, 600);
            setTimeout(function () {
                preloader.style.display = 'none';
            }, 1200);
        }
    });


    /* ═══════════════════════════════════════════════════
       STICKY NAVBAR — background change on scroll
       ═══════════════════════════════════════════════════ */
    let lastScrollY = 0;
    let ticking = false;

    function handleNavbarScroll() {
        var sy = window.pageYOffset || document.documentElement.scrollTop;

        if (sy > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        /* Scroll-to-top button visibility */
        if (sy > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }

        lastScrollY = sy;
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(handleNavbarScroll);
            ticking = true;
        }
    }, { passive: true });


    /* ═══════════════════════════════════════════════════
       HAMBURGER MOBILE MENU
       ═══════════════════════════════════════════════════ */
    hamburgerBtn.addEventListener('click', function () {
        this.classList.toggle('active');
        navMenu.classList.toggle('open');
        document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    /* Close menu on link click */
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            hamburgerBtn.classList.remove('active');
            navMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    /* Close menu on outside click */
    document.addEventListener('click', function (e) {
        if (navMenu.classList.contains('open') &&
            !navMenu.contains(e.target) &&
            !hamburgerBtn.contains(e.target)) {
            hamburgerBtn.classList.remove('active');
            navMenu.classList.remove('open');
            document.body.style.overflow = '';
        }
    });


    /* ═══════════════════════════════════════════════════
       ACTIVE NAV LINK ON SCROLL
       ═══════════════════════════════════════════════════ */
    var sections = $$('section[id]');

    function highlightNavLink() {
        var scrollPos = window.scrollY + 120;

        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('data-nav') === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink, { passive: true });


    /* ═══════════════════════════════════════════════════
       SCROLL TO TOP
       ═══════════════════════════════════════════════════ */
    scrollTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    /* ═══════════════════════════════════════════════════
       PARALLAX EFFECT — Hero & CTA background
       ═══════════════════════════════════════════════════ */
    var parallaxElements = $$('[data-parallax]');

    function updateParallax() {
        var scrollY = window.pageYOffset;

        parallaxElements.forEach(function (el) {
            var speed = parseFloat(el.dataset.parallax) || 0.3;
            var rect = el.parentElement.getBoundingClientRect();

            /* Only apply when section is in view */
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
                var offset = scrollY * speed;
                el.style.transform = 'translate3d(0, ' + offset + 'px, 0)';
            }
        });
    }

    window.addEventListener('scroll', function () {
        requestAnimationFrame(updateParallax);
    }, { passive: true });


    /* ═══════════════════════════════════════════════════
       SCROLL REVEAL ANIMATIONS — Intersection Observer
       ═══════════════════════════════════════════════════ */
    var revealElements = $$('.reveal-up, .reveal-left, .reveal-right');

    if ('IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        /* Fallback: just show everything */
        revealElements.forEach(function (el) {
            el.classList.add('revealed');
        });
    }


    /* ═══════════════════════════════════════════════════
       ANIMATED COUNTERS
       ═══════════════════════════════════════════════════ */
    var counterElements = $$('.about__stat-number[data-target]');
    var countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;

        counterElements.forEach(function (counter) {
            var target = parseInt(counter.getAttribute('data-target'), 10);
            var duration = 2000;
            var startTime = null;

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);

                /* easeOutQuart for smooth deceleration */
                var eased = 1 - Math.pow(1 - progress, 4);
                counter.textContent = Math.floor(eased * target);

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    counter.textContent = target;
                }
            }

            requestAnimationFrame(step);
        });

        countersAnimated = true;
    }

    if ('IntersectionObserver' in window) {
        var statsSection = $('.about__stats');
        if (statsSection) {
            var counterObserver = new IntersectionObserver(function (entries) {
                if (entries[0].isIntersecting) {
                    animateCounters();
                    counterObserver.unobserve(statsSection);
                }
            }, { threshold: 0.4 });

            counterObserver.observe(statsSection);
        }
    }


    /* ═══════════════════════════════════════════════════
       PORTFOLIO FILTERS
       ═══════════════════════════════════════════════════ */
    var filterButtons = $$('.portfolio__filter');
    var portfolioItems = $$('.portfolio__item');

    filterButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var filter = this.getAttribute('data-filter');

            /* Update active button */
            filterButtons.forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');

            /* Filter items with animation */
            portfolioItems.forEach(function (item) {
                var category = item.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';

                    setTimeout(function () {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';

                    setTimeout(function () {
                        item.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });


    /* ═══════════════════════════════════════════════════
       LIGHTBOX — Fullscreen Image Viewer
       ═══════════════════════════════════════════════════ */
    var currentLightboxIndex = 0;
    var visibleItems = [];

    function getVisibleItems() {
        return $$('.portfolio__item:not(.hidden)', galleryGrid);
    }

    function openLightbox(index) {
        visibleItems = getVisibleItems();
        currentLightboxIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightboxImage() {
        var item = visibleItems[currentLightboxIndex];
        if (!item) return;

        var img = $('img', item);
        var name = $('.portfolio__name', item);

        /* Use higher resolution for lightbox */
        var src = img.src.replace('w=600', 'w=1400');
        lightboxImage.src = src;
        lightboxImage.alt = img.alt;
        lightboxCaption.textContent = name ? name.textContent : '';
        lightboxCounter.textContent = (currentLightboxIndex + 1) + ' / ' + visibleItems.length;

        /* Re-trigger animation */
        lightboxImage.style.animation = 'none';
        lightboxImage.offsetHeight; /* trigger reflow */
        lightboxImage.style.animation = '';
    }

    function nextLightbox() {
        currentLightboxIndex = (currentLightboxIndex + 1) % visibleItems.length;
        updateLightboxImage();
    }

    function prevLightbox() {
        currentLightboxIndex = (currentLightboxIndex - 1 + visibleItems.length) % visibleItems.length;
        updateLightboxImage();
    }

    /* Event: click on portfolio items */
    galleryGrid.addEventListener('click', function (e) {
        var item = e.target.closest('.portfolio__item');
        if (!item) return;

        visibleItems = getVisibleItems();
        var index = visibleItems.indexOf(item);
        if (index !== -1) {
            openLightbox(index);
        }
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', nextLightbox);
    lightboxPrev.addEventListener('click', prevLightbox);

    /* Close on overlay click */
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox || e.target.classList.contains('lightbox__content')) {
            closeLightbox();
        }
    });

    /* Keyboard navigation */
    document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextLightbox();
        if (e.key === 'ArrowLeft') prevLightbox();
    });

    /* Touch swipe support for lightbox */
    (function () {
        var touchStartX = 0;
        var touchEndX = 0;

        lightbox.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            var diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 60) {
                if (diff > 0) nextLightbox();
                else prevLightbox();
            }
        }, { passive: true });
    })();


    /* ═══════════════════════════════════════════════════
       TESTIMONIAL CAROUSEL
       ═══════════════════════════════════════════════════ */
    var testimonialSlides = $$('.testimonials__slide');
    var testimonialDotsContainer = $('#testimonialDots');
    var currentTestimonial = 0;
    var testimonialCount = testimonialSlides.length;
    var testimonialAutoplay = null;

    /* Create dot indicators */
    testimonialSlides.forEach(function (_, i) {
        var dot = document.createElement('div');
        dot.className = 'testimonials__dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', function () {
            goToTestimonial(i);
            resetAutoplay();
        });
        testimonialDotsContainer.appendChild(dot);
    });

    var testimonialDots = $$('.testimonials__dot');

    function goToTestimonial(index) {
        currentTestimonial = index;
        testimonialTrack.style.transform = 'translateX(-' + (index * 100) + '%)';

        testimonialDots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === index);
        });
    }

    function nextTestimonial() {
        goToTestimonial((currentTestimonial + 1) % testimonialCount);
    }

    function prevTestimonial() {
        goToTestimonial((currentTestimonial - 1 + testimonialCount) % testimonialCount);
    }

    function startAutoplay() {
        testimonialAutoplay = setInterval(nextTestimonial, 5000);
    }

    function resetAutoplay() {
        clearInterval(testimonialAutoplay);
        startAutoplay();
    }

    $('#testimonialNext').addEventListener('click', function () {
        nextTestimonial();
        resetAutoplay();
    });

    $('#testimonialPrev').addEventListener('click', function () {
        prevTestimonial();
        resetAutoplay();
    });

    startAutoplay();

    /* Pause autoplay on hover */
    var carouselEl = $('.testimonials__carousel');
    if (carouselEl) {
        carouselEl.addEventListener('mouseenter', function () {
            clearInterval(testimonialAutoplay);
        });
        carouselEl.addEventListener('mouseleave', startAutoplay);
    }


    /* ═══════════════════════════════════════════════════
       FEATURED WORK — DRAG SCROLL
       ═══════════════════════════════════════════════════ */
    var featuredTrack = $('#featuredTrack');
    if (featuredTrack) {
        var isDown = false;
        var startX, scrollLeft;

        featuredTrack.addEventListener('mousedown', function (e) {
            isDown = true;
            featuredTrack.style.cursor = 'grabbing';
            startX = e.pageX - featuredTrack.offsetLeft;
            scrollLeft = featuredTrack.scrollLeft;
        });

        featuredTrack.addEventListener('mouseleave', function () {
            isDown = false;
            featuredTrack.style.cursor = 'grab';
        });

        featuredTrack.addEventListener('mouseup', function () {
            isDown = false;
            featuredTrack.style.cursor = 'grab';
        });

        featuredTrack.addEventListener('mousemove', function (e) {
            if (!isDown) return;
            e.preventDefault();
            var x = e.pageX - featuredTrack.offsetLeft;
            var walk = (x - startX) * 1.5;
            featuredTrack.scrollLeft = scrollLeft - walk;
        });
    }


    /* ═══════════════════════════════════════════════════
       CONTACT FORM VALIDATION
       ═══════════════════════════════════════════════════ */
    var formFields = {
        name: {
            el: $('#contactName'),
            error: $('#nameError'),
            validate: function (val) {
                if (!val.trim()) return 'Please enter your name.';
                if (val.trim().length < 2) return 'Name must be at least 2 characters.';
                return '';
            }
        },
        email: {
            el: $('#contactEmail'),
            error: $('#emailError'),
            validate: function (val) {
                if (!val.trim()) return 'Please enter your email.';
                var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!pattern.test(val)) return 'Please enter a valid email address.';
                return '';
            }
        },
        phone: {
            el: $('#contactPhone'),
            error: $('#phoneError'),
            validate: function (val) {
                if (!val.trim()) return 'Please enter your phone number.';
                var cleaned = val.replace(/[\s\-\(\)]/g, '');
                if (!/^\+?\d{7,15}$/.test(cleaned)) return 'Please enter a valid phone number.';
                return '';
            }
        },
        message: {
            el: $('#contactMessage'),
            error: $('#messageError'),
            validate: function (val) {
                if (!val.trim()) return 'Please enter a message.';
                if (val.trim().length < 10) return 'Message should be at least 10 characters.';
                return '';
            }
        }
    };

    /* Real-time validation on blur */
    Object.keys(formFields).forEach(function (key) {
        var field = formFields[key];
        field.el.addEventListener('blur', function () {
            var msg = field.validate(this.value);
            field.error.textContent = msg;
            this.parentElement.classList.toggle('error', !!msg);
        });

        field.el.addEventListener('input', function () {
            if (this.parentElement.classList.contains('error')) {
                var msg = field.validate(this.value);
                field.error.textContent = msg;
                if (!msg) this.parentElement.classList.remove('error');
            }
        });
    });

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var isValid = true;

        Object.keys(formFields).forEach(function (key) {
            var field = formFields[key];
            var msg = field.validate(field.el.value);
            field.error.textContent = msg;
            field.el.parentElement.classList.toggle('error', !!msg);
            if (msg) isValid = false;
        });

        if (!isValid) return;

        var submitBtn = $('#submitBtn');
        var btnText = $('.btn__text', submitBtn);
        var btnLoader = $('.btn__loader', submitBtn);
        var successMsg = $('#formSuccess');

        /* Simulate submission */
        btnText.textContent = 'Sending...';
        btnLoader.hidden = false;
        submitBtn.disabled = true;

        setTimeout(function () {
            btnText.textContent = 'Send Message';
            btnLoader.hidden = true;
            submitBtn.disabled = false;
            successMsg.hidden = false;
            contactForm.reset();

            /* Clear error states */
            Object.keys(formFields).forEach(function (key) {
                formFields[key].error.textContent = '';
                formFields[key].el.parentElement.classList.remove('error');
            });

            /* Hide success after a while */
            setTimeout(function () {
                successMsg.hidden = true;
            }, 5000);
        }, 1800);
    });


    /* ═══════════════════════════════════════════════════
       NEWSLETTER FORM
       ═══════════════════════════════════════════════════ */
    var newsletterForm = $('#newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var input = $('input', this);
            if (input.value.trim()) {
                var originalPlaceholder = input.placeholder;
                input.value = '';
                input.placeholder = 'Thank you for subscribing!';
                setTimeout(function () {
                    input.placeholder = originalPlaceholder;
                }, 3000);
            }
        });
    }


    /* ═══════════════════════════════════════════════════
       SMOOTH SCROLL — for anchors
       ═══════════════════════════════════════════════════ */
    $$('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var target = $(targetId);
            if (target) {
                e.preventDefault();
                var offset = parseInt(getComputedStyle(document.documentElement)
                    .getPropertyValue('--navbar-h'), 10) || 80;

                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

})();