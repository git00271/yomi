/**
 * YOMI KAYA - Interactive Scripts
 * Features:
 * - Scrolled Header effect
 * - Mobile Navigation Toggle
 * - Scrollspy Active Navigation
 * - Scroll-triggered fade-in animations (Intersection Observer)
 * - Interactive Menu Board Filter
 * - Skinned Dark Map (Leaflet.js)
 * - Booking Form & Modal Logic
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Header scrolled styling & Mobile menu
       ========================================================================== */
    const header = document.getElementById('site-header');
    const mobileToggle = document.getElementById('mobile-toggle-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-item');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile nav toggle
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
        document.body.classList.toggle('no-scroll');
    });

    // Close menu when clicking nav items
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('open');
            navMenu.classList.remove('open');
            document.body.classList.remove('no-scroll');
            
            // Set active class manually
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    /* ==========================================================================
       2. Scrollspy Active Nav Tracking
       ========================================================================== */
    const sections = document.querySelectorAll('section, header');
    const scrollspyOptions = {
        threshold: 0.3,
        rootMargin: '-80px 0px 0px 0px'
    };

    const scrollspyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, scrollspyOptions);

    sections.forEach(section => {
        scrollspyObserver.observe(section);
    });

    /* ==========================================================================
       3. Scroll-triggered Fade In Animations
       ========================================================================== */
    const fadeElements = document.querySelectorAll('section, .grid-layout-2, .menu-card, .insta-item, .info-item');
    
    // Add fade-in classes
    fadeElements.forEach(el => {
        el.classList.add('fade-in-section');
    });

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // stop observing once visible
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(el => {
        fadeObserver.observe(el);
    });

    /* ==========================================================================
       4. Menu Category Filter Board
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            menuCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Hide with transition, then toggle display
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'flex';
                        // Force reflow
                        card.offsetHeight;
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    } else {
                        card.style.display = 'none';
                    }
                }, 250);
            });
        });
    });



    /* ==========================================================================
       5. Copyright Year Update
       ========================================================================== */
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    /* ==========================================================================
       6. Booking Modal Handler
       ========================================================================== */
    const bookingModal = document.getElementById('booking-modal');
    const reserveBtnNav = document.getElementById('reserve-btn-nav');
    const reserveBtnHero = document.getElementById('reserve-btn-hero');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    // Open Modal
    const openModal = () => {
        bookingModal.classList.add('open');
        document.body.classList.add('no-scroll');
    };

    // Close Modal
    const closeModal = () => {
        bookingModal.classList.remove('open');
        document.body.classList.remove('no-scroll');
    };

    if (reserveBtnNav) reserveBtnNav.addEventListener('click', openModal);
    if (reserveBtnHero) reserveBtnHero.addEventListener('click', openModal);
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside of modal container
    if (bookingModal) {
        bookingModal.addEventListener('click', (e) => {
            if (e.target === bookingModal) {
                closeModal();
            }
        });
    }

    /* ==========================================================================
       7. BGM Player Controller (Autoplay on first interaction)
       ========================================================================== */
    const bgmPlayer = document.getElementById('bgm-player');
    const bgmToggleBtn = document.getElementById('bgm-toggle-btn');
    const bgmPlayIcon = document.getElementById('bgm-play-icon');
    const bgmPauseIcon = document.getElementById('bgm-pause-icon');
    const bgmStatusText = document.getElementById('bgm-status-text');
    const bgmWidget = document.getElementById('bgm-widget');

    let bgmStarted = false;

    // Update UI to playing state
    const setBgmPlaying = () => {
        bgmPlayIcon.style.display = 'none';
        bgmPauseIcon.style.display = 'block';
        if (bgmStatusText) bgmStatusText.textContent = 'Playing';
        if (bgmWidget) bgmWidget.classList.add('playing');
    };

    // Update UI to paused state
    const setBgmPaused = () => {
        bgmPlayIcon.style.display = 'block';
        bgmPauseIcon.style.display = 'none';
        if (bgmStatusText) bgmStatusText.textContent = 'Paused';
        if (bgmWidget) bgmWidget.classList.remove('playing');
    };

    // Attempt to start BGM
    const startBgm = () => {
        if (bgmStarted) return;
        bgmStarted = true;

        bgmPlayer.volume = 0.35;
        bgmPlayer.play()
            .then(() => {
                setBgmPlaying();
                // Remove first-interaction listeners once playing
                document.removeEventListener('click', startBgm);
                document.removeEventListener('scroll', startBgm);
                document.removeEventListener('keydown', startBgm);
                document.removeEventListener('touchstart', startBgm);
            })
            .catch(() => {
                // Autoplay blocked - wait for user interaction
                bgmStarted = false;
            });
    };

    if (bgmPlayer && bgmToggleBtn) {
        // 1. Try immediate autoplay on page load
        bgmPlayer.load();
        bgmPlayer.play()
            .then(() => {
                bgmStarted = true;
                setBgmPlaying();
            })
            .catch(() => {
                // Autoplay blocked by browser policy
                // Start on first user interaction instead
                document.addEventListener('click', startBgm, { once: false });
                document.addEventListener('scroll', startBgm, { once: false });
                document.addEventListener('keydown', startBgm, { once: false });
                document.addEventListener('touchstart', startBgm, { once: false });
            });

        // 2. Toggle button: manual play/pause
        bgmToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent triggering startBgm
            bgmStarted = true;

            if (bgmPlayer.paused) {
                bgmPlayer.play()
                    .then(setBgmPlaying)
                    .catch(err => {
                        console.warn('BGM 재생 실패:', err);
                        if (bgmStatusText) bgmStatusText.textContent = 'Error';
                    });
            } else {
                bgmPlayer.pause();
                setBgmPaused();
            }
        });

        // Loop fallback
        bgmPlayer.addEventListener('ended', setBgmPaused);

        // Error fallback
        bgmPlayer.addEventListener('error', () => {
            console.warn('BGM 소스 로드 실패');
            if (bgmStatusText) bgmStatusText.textContent = 'Unavailable';
        });
    }
});
