document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       Sticky Header
       ========================================================================== */
    const header = document.getElementById('main-header');

    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });


    /* ==========================================================================
       Hero Slider
       ========================================================================== */
    const slides        = document.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.slider-dots');
    const prevBtn       = document.querySelector('.prev-btn');
    const nextBtn       = document.querySelector('.next-btn');

    let currentSlide = 0;
    const slideCount = slides.length;
    let slideInterval;

    // Create dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.setAttribute('aria-label', `Ir a la diapositiva ${i + 1}`);
        dot.setAttribute('role', 'tab');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function updateSlider() {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => { d.classList.remove('active'); d.setAttribute('aria-selected', 'false'); });
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        dots[currentSlide].setAttribute('aria-selected', 'true');
    }

    function nextSlide() { currentSlide = (currentSlide + 1) % slideCount; updateSlider(); }
    function prevSlide() { currentSlide = (currentSlide - 1 + slideCount) % slideCount; updateSlider(); }
    function goToSlide(i) { currentSlide = i; updateSlider(); resetInterval(); }

    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 6000);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });

    // Touch/swipe support for slider
    let touchStartX = 0;
    const slider = document.getElementById('hero-slider');
    if (slider) {
        slider.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
        slider.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? nextSlide() : prevSlide();
                resetInterval();
            }
        }, { passive: true });
    }

    resetInterval();


    /* ==========================================================================
       Mobile Menu Toggle
       ========================================================================== */
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('open');
            menuToggle.classList.toggle('open', isOpen);
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            mobileMenu.setAttribute('aria-hidden', String(!isOpen));
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                menuToggle.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            });
        });

        // Close on outside click
        document.addEventListener('click', e => {
            if (mobileMenu.classList.contains('open') &&
                !mobileMenu.contains(e.target) &&
                !menuToggle.contains(e.target)) {
                mobileMenu.classList.remove('open');
                menuToggle.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        });
    }


    /* ==========================================================================
       Scroll Reveal (Intersection Observer)
       ========================================================================== */
    const revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, idx) => {
                if (entry.isIntersecting) {
                    // Stagger siblings
                    const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
                    const delay = siblings.indexOf(entry.target) * 80;
                    setTimeout(() => entry.target.classList.add('visible'), delay);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealEls.forEach(el => el.classList.add('visible'));
    }


    /* ==========================================================================
       Smooth Scrolling for Anchor Links
       ========================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = header.offsetHeight + 16;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });


    /* ==========================================================================
       Auto-update year in footer
       ========================================================================== */
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();


    /* ==========================================================================
       Active nav link on scroll
       ========================================================================== */
    const sections = document.querySelectorAll('section[id], div[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle(
                        'active',
                        link.getAttribute('href') === `#${entry.target.id}`
                    );
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => sectionObserver.observe(s));

});
