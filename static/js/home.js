/**
 * Home Page — Optimized Animations
 * Typing effect, counter animation, carousel, scroll reveal.
 * All animations use requestAnimationFrame and transform/opacity for GPU compositing.
 */
(function () {
    'use strict';

    /* ═══════════════════════════════════════
       1. TYPING EFFECT
       ═══════════════════════════════════════ */
    const typingTarget = document.getElementById('typing-target');
    if (typingTarget) {
        const phrases = [
            'AI Engineer & Backend Developer',
            'Building Production-Ready AI Systems',
            'Scalable APIs & Microservices',
            'NLP • Computer Vision • MLOps',
        ];
        let phraseIdx = 0, charIdx = 0, isDeleting = false;
        const TYPE_SPEED = 65, DELETE_SPEED = 35, PAUSE = 2200;

        function typeLoop() {
            const current = phrases[phraseIdx];
            if (!isDeleting) {
                typingTarget.textContent = current.substring(0, charIdx + 1);
                charIdx++;
                if (charIdx === current.length) {
                    isDeleting = true;
                    setTimeout(typeLoop, PAUSE);
                    return;
                }
            } else {
                typingTarget.textContent = current.substring(0, charIdx - 1);
                charIdx--;
                if (charIdx === 0) {
                    isDeleting = false;
                    phraseIdx = (phraseIdx + 1) % phrases.length;
                }
            }
            setTimeout(typeLoop, isDeleting ? DELETE_SPEED : TYPE_SPEED);
        }
        // Stagger start after hero entrance
        setTimeout(typeLoop, 1200);
    }

    /* ═══════════════════════════════════════
       2. ANIMATED COUNTERS (IntersectionObserver)
       ═══════════════════════════════════════ */
    const counters = document.querySelectorAll('[data-count]');
    let countersDone = false;

    function animateCounters() {
        if (countersDone) return;
        countersDone = true;
        counters.forEach((el) => {
            const target = parseInt(el.dataset.count, 10);
            const duration = 1800;
            const start = performance.now();

            function step(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease-out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(target * eased);
                if (progress < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        });
    }

    if (counters.length) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) animateCounters();
            });
        }, { threshold: 0.5 });
        counters.forEach((el) => counterObserver.observe(el));
    }

    /* ═══════════════════════════════════════
       3. CINEMATIC CAROUSEL
       ═══════════════════════════════════════ */
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const currentEl = document.getElementById('carousel-current');
    const progressBar = document.getElementById('carousel-progress-bar');
    let current = 0, total = slides.length, autoTimer = null;
    const AUTO_INTERVAL = 6000;

    function goTo(index) {
        if (!total) return;
        slides[current].classList.remove('active');
        if (dots[current]) dots[current].classList.remove('active');
        current = ((index % total) + total) % total;
        slides[current].classList.add('active');
        if (dots[current]) dots[current].classList.add('active');
        if (currentEl) currentEl.textContent = String(current + 1).padStart(2, '0');
        resetProgress();
    }

    function resetProgress() {
        if (!progressBar) return;
        progressBar.style.transition = 'none';
        progressBar.style.width = '0%';
        // Force reflow then animate
        void progressBar.offsetWidth;
        progressBar.style.transition = 'width ' + AUTO_INTERVAL + 'ms linear';
        progressBar.style.width = '100%';
    }

    function startAuto() {
        stopAuto();
        if (total <= 1) return;
        resetProgress();
        autoTimer = setInterval(() => goTo(current + 1), AUTO_INTERVAL);
    }
    function stopAuto() { clearInterval(autoTimer); }

    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });
    dots.forEach((d) => d.addEventListener('click', () => { goTo(+d.dataset.index); startAuto(); }));

    // Touch swipe support
    let touchStartX = 0;
    const track = document.querySelector('.carousel-track');
    if (track) {
        track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) { diff > 0 ? goTo(current + 1) : goTo(current - 1); startAuto(); }
        }, { passive: true });
    }

    if (total > 0) startAuto();

    /* ═══════════════════════════════════════
       4. SCROLL REVEAL (GPU-optimized)
       ═══════════════════════════════════════ */
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length) {
        const revealObs = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add('revealed');
                    revealObs.unobserve(e.target); // Stop watching once revealed
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        reveals.forEach((el) => revealObs.observe(el));
    }

    /* ═══════════════════════════════════════
       5. HUD STATUS TEXT CYCLING
       ═══════════════════════════════════════ */
    const hudText = document.getElementById('hud-status-text');
    if (hudText) {
        const statuses = [
            'SYSTEM ONLINE',
            'NEURAL SYNC: 98.7%',
            'AI CORE: ACTIVE',
            'QUANTUM LINK: STABLE',
            'THREAT LEVEL: ZERO',
            'ALL SYSTEMS NOMINAL',
        ];
        let statusIdx = 0;
        setInterval(() => {
            statusIdx = (statusIdx + 1) % statuses.length;
            hudText.style.opacity = '0';
            setTimeout(() => {
                hudText.textContent = statuses[statusIdx];
                hudText.style.opacity = '0.8';
            }, 300);
        }, 4000);
    }

})();
