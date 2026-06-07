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
       5. Leaflet Map Configuration (Dark Skinned)
       ========================================================================== */
    // Location coordinates for 구월동 1176 2층, Incheon
    const yomiKayaCoords = [37.447545, 126.702958];
    
    // Initialize map
    const map = L.map('map', {
        center: yomiKayaCoords,
        zoom: 16,
        scrollWheelZoom: false, // Prevent zoom scroll hijacking
        zoomControl: true
    });

    // Add CartoDB Dark Matter tile layer for premium dark aesthetics
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // Custom Glowing Purple Marker Icon
    const purpleIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
            <div style="
                width: 20px; 
                height: 20px; 
                background: #ff9e00; 
                border: 3px solid #9d4edd; 
                border-radius: 50%; 
                box-shadow: 0 0 15px #d500f9, 0 0 30px #d500f9;
                animation: floating-anim 2s infinite alternate;
            "></div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });

    // Add marker
    const marker = L.marker(yomiKayaCoords, { icon: purpleIcon }).addTo(map);
    
    // Bind aesthetic popup
    marker.bindPopup(`
        <div style="color: #ffffff; font-family: 'Noto Sans KR', sans-serif; text-align: center; padding: 5px;">
            <strong style="color: #c77dff; font-size: 14px;">요미카야 (Yomi Kaya)</strong><br>
            <span style="font-size: 12px; color: #a39cb4;">인천 남동구 남동대로691번길 17 2층</span>
        </div>
    `, {
        className: 'dark-popup'
    }).openPopup();

    /* ==========================================================================
       6. Booking Modal & Form Handler
       ========================================================================== */
    const bookingModal = document.getElementById('booking-modal');
    const reserveBtnNav = document.getElementById('reserve-btn-nav');
    const reserveBtnHero = document.getElementById('reserve-btn-hero');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const successCloseBtn = document.getElementById('success-close-btn');
    const reservationForm = document.getElementById('reservation-form');
    const modalSuccessState = document.getElementById('modal-success-state');
    
    // Form input references
    const bookingName = document.getElementById('booking-name');
    const bookingPhone = document.getElementById('booking-phone');
    const bookingDate = document.getElementById('booking-date');
    const bookingTime = document.getElementById('booking-time');
    const bookingGuests = document.getElementById('booking-guests');
    const bookingRequest = document.getElementById('booking-request');
    
    // Receipt element references
    const receiptName = document.getElementById('receipt-name');
    const receiptDatetime = document.getElementById('receipt-datetime');
    const receiptGuests = document.getElementById('receipt-guests');

    // Instagram DM references
    const copyDmBtn = document.getElementById('copy-dm-btn');
    const copyToast = document.getElementById('copy-toast');

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    bookingDate.setAttribute('min', today);

    // Open Modal
    const openModal = () => {
        bookingModal.classList.add('open');
        document.body.classList.add('no-scroll');
    };

    // Close Modal
    const closeModal = () => {
        bookingModal.classList.remove('open');
        document.body.classList.remove('no-scroll');
        
        // Reset form and states after transition
        setTimeout(() => {
            reservationForm.style.display = 'block';
            modalSuccessState.style.display = 'none';
            if (copyToast) {
                copyToast.style.display = 'none';
            }
            reservationForm.reset();
        }, 400);
    };

    reserveBtnNav.addEventListener('click', openModal);
    if (reserveBtnHero) reserveBtnHero.addEventListener('click', openModal);
    
    modalCloseBtn.addEventListener('click', closeModal);
    successCloseBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside of modal container
    bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            closeModal();
        }
    });

    // Form Submission Handler
    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Get values
        const nameVal = bookingName.value;
        const phoneVal = bookingPhone.value;
        const dateVal = bookingDate.value;
        const timeVal = bookingTime.value;
        const guestsVal = bookingGuests.value;
        
        // 2. Set receipt details
        receiptName.textContent = nameVal;
        receiptDatetime.textContent = `${dateVal} / ${timeVal}`;
        receiptGuests.textContent = `${guestsVal}명`;

        // 3. Switch states in modal
        reservationForm.style.display = 'none';
        modalSuccessState.style.display = 'block';

        // 4. Save to localStorage (mock DB check)
        const reservationData = {
            name: nameVal,
            phone: phoneVal,
            date: dateVal,
            time: timeVal,
            guests: guestsVal,
            request: bookingRequest ? bookingRequest.value : '',
            timestamp: new Date().toISOString()
        };
        
        const existingBookings = JSON.parse(localStorage.getItem('yomi_bookings') || '[]');
        existingBookings.push(reservationData);
        localStorage.setItem('yomi_bookings', JSON.stringify(existingBookings));
    });

    // Instagram DM Copy & Redirect Handler
    if (copyDmBtn) {
        copyDmBtn.addEventListener('click', () => {
            const nameVal = bookingName.value || '';
            const phoneVal = bookingPhone.value || '';
            const dateVal = bookingDate.value || '';
            const timeVal = bookingTime.value || '';
            const guestsVal = bookingGuests.value || '';
            const requestVal = bookingRequest ? bookingRequest.value.trim() : '';

            // Format reservation details matching user request form structure
            const dmText = `[요미카야 테이블 예약 신청]
• 예약자명: ${nameVal}
• 연락처: ${phoneVal}
• 예약 날짜: ${dateVal}
• 예약 시간: ${timeVal}
• 예약 인원: ${guestsVal}명
• 요청 사항: ${requestVal || '없음'}`;

            // Helper to handle visual feedback and redirection
            const handleCopySuccess = () => {
                if (copyToast) {
                    copyToast.style.display = 'block';
                    copyToast.style.color = '#c77dff';
                    copyToast.textContent = '📋 예약 양식이 복사되었습니다! DM 창에 붙여넣기(Ctrl+V) 해주세요.';
                }
                
                // Redirect to Instagram DM after a brief delay
                setTimeout(() => {
                    window.open('https://ig.me/m/yomi_kaya', '_blank');
                }, 1500);
            };

            // Clipboard copy with browser API
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(dmText)
                    .then(handleCopySuccess)
                    .catch(err => {
                        console.warn('Clipboard API failed, using fallback:', err);
                        fallbackCopy(dmText, handleCopySuccess);
                    });
            } else {
                fallbackCopy(dmText, handleCopySuccess);
            }
        });
    }

    // Fallback copy implementation for non-HTTPS or legacy browsers
    function fallbackCopy(text, successCallback) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        
        // Prevent scrolling and style invisibly
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = '0';
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                successCallback();
            } else {
                showCopyFailureMessage();
            }
        } catch (err) {
            console.error('Fallback copy command failed:', err);
            showCopyFailureMessage();
        }
        
        document.body.removeChild(textArea);
    }

    function showCopyFailureMessage() {
        if (copyToast) {
            copyToast.style.display = 'block';
            copyToast.style.color = '#ff4d4d';
            copyToast.textContent = '📋 자동 복사에 실패했습니다. 모바일 브라우저의 보안 정책으로 인해 직접 복사해 주세요.';
        }
    }
});
