/**
 * COSMOS ENGINE — 3D Cosmic Solar System Hero
 * Orbiting project planets, neural connections, nebula, stars, particle trails.
 * GPU-optimized: RAF-driven, transform-only, spatial grid.
 */
(function () {
    'use strict';

    const canvas = document.getElementById('cosmos-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, cx, cy, time = 0;
    let mouse = { x: 0.5, y: 0.5 }; // normalized 0-1
    let scrollY = 0;
    let targetScrollY = 0;

    /* ── PRIME COLOR PALETTE ── */
    const NEON = {
        cyan:    '#00f2ff', // Electric Cyan
        purple:  '#7000ff', // Deep Indigo
        magenta: '#ff00d4', // Neon Fuchsia
        emerald: '#00ffa2', // Emerald Tech
        orange:  '#ff6b00', // Solar Flare
        gold:    '#ffd700', // Stellar Gold
        blue:    '#3b82f6', // Royal Blue
        rose:    '#f43f5e', // Rose
        white:   '#ffffff',
    };

    /* ── AI EMPIRE: 27 PROJECT PLANETS ── */
    /* ── SOLAR CLUSTERS (SUNS) ── */
    const SUNS = {
        TECH:  { id: 'tech',  label: 'HIGH-TECH',    color: NEON.cyan,   xOff: -450, yOff: -120, size: 28 },
        AGENT: { id: 'agent', label: 'AGENT NEXUS',  color: NEON.purple, xOff: 0,    yOff: 20,   size: 38 },
        BOT:   { id: 'bot',   label: 'APPS & BOTS',  color: NEON.orange, xOff: 450,  yOff: 160,  size: 25 },
    };

    /* ── AI EMPIRE — ORGANIC Z-SORTED LAYOUT ── */
    const PLANETS = [
        // ══════ HIGH-TECH CLUSTER ══════
        { label: 'PHX-QUANTUM',   icon: '⚛️', color: NEON.cyan,    size: 22, orbit: 80,  speed: 0.08,  phase: 0.5, tilt: 0.35, sun: 'TECH' },
        { label: 'PHX-PTC',       icon: '⚡', color: NEON.magenta, size: 20, orbit: 125, speed: 0.065, phase: 2.1, tilt: 0.38, sun: 'TECH' },
        { label: 'PHX-LLM',       icon: '🧠', color: NEON.purple,  size: 24, orbit: 175, speed: 0.05,  phase: 4.2, tilt: 0.32, sun: 'TECH' },
        { label: 'MYAGENT-AGI',   icon: '🔮', color: NEON.emerald, size: 18, orbit: 220, speed: 0.04,  phase: 1.1, tilt: 0.40, sun: 'TECH' },
        { label: 'GYOMEI-CORE',   icon: '🪨', color: NEON.gold,    size: 16, orbit: 270, speed: 0.035, phase: 3.5, tilt: 0.34, sun: 'TECH' },
        { label: 'PHOENIX-AI',    icon: '🐦', color: NEON.orange,  size: 18, orbit: 320, speed: 0.03,  phase: 5.8, tilt: 0.37, sun: 'TECH' },
        { label: 'OBANAI-RULES',  icon: '🐍', color: NEON.emerald, size: 14, orbit: 370, speed: 0.025, phase: 1.9, tilt: 0.31, sun: 'TECH' },
        { label: 'MUICHIRO-MEM',  icon: '🌫️', color: NEON.cyan,    size: 14, orbit: 420, speed: 0.02,  phase: 4.0, tilt: 0.36, sun: 'TECH' },
        { label: 'TENGEN-IO',     icon: '💎', color: NEON.magenta, size: 14, orbit: 480, speed: 0.015, phase: 6.1, tilt: 0.33, sun: 'TECH' },

        // ══════ AGENT CLUSTER ══════
        { label: 'ASHBORN',       icon: '💀', color: NEON.rose,    size: 26, orbit: 95,  speed: 0.075, phase: 1.0, tilt: 0.35, sun: 'AGENT' },
        { label: 'GIYU',          icon: '🌊', color: NEON.blue,    size: 24, orbit: 145, speed: 0.06,  phase: 3.1, tilt: 0.38, sun: 'AGENT' },
        { label: 'RENGOKU',       icon: '🔥', color: NEON.orange,  size: 24, orbit: 195, speed: 0.05,  phase: 5.2, tilt: 0.32, sun: 'AGENT' },
        { label: 'SHINOBU',       icon: '🦋', color: NEON.purple,  size: 20, orbit: 250, speed: 0.04,  phase: 0.7, tilt: 0.40, sun: 'AGENT' },
        { label: 'SKYGUARD',      icon: '🛡️', color: NEON.rose,    size: 18, orbit: 305, speed: 0.035, phase: 2.8, tilt: 0.34, sun: 'AGENT' },
        { label: 'SANEMI-NET',    icon: '🌪️', color: NEON.white,   size: 16, orbit: 365, speed: 0.03,  phase: 4.9, tilt: 0.37, sun: 'AGENT' },
        { label: 'MITSURI-REC',   icon: '💖', color: NEON.magenta, size: 16, orbit: 425, speed: 0.025, phase: 1.5, tilt: 0.31, sun: 'AGENT' },
        { label: 'CODER-V2',      icon: '💻', color: NEON.cyan,    size: 14, orbit: 490, speed: 0.02,  phase: 3.6, tilt: 0.36, sun: 'AGENT' },
        { label: 'SMART-GIT',     icon: '🎋', color: NEON.emerald, size: 14, orbit: 560, speed: 0.015, phase: 5.7, tilt: 0.33, sun: 'AGENT' },

        // ══════ APPS & BOTS CLUSTER ══════
        { label: 'MAFQOOD-AI',    icon: '🔍', color: NEON.blue,    size: 20, orbit: 75,  speed: 0.09,  phase: 0.0, tilt: 0.35, sun: 'BOT' },
        { label: 'EDU-CHAT',      icon: '🎓', color: NEON.cyan,    size: 16, orbit: 115, speed: 0.07,  phase: 2.2, tilt: 0.38, sun: 'BOT' },
        { label: 'SVU-BOT',       icon: '🤖', color: NEON.rose,    size: 16, orbit: 160, speed: 0.055, phase: 4.4, tilt: 0.32, sun: 'BOT' },
        { label: 'REAL-STATE',    icon: '🏢', color: NEON.orange,  size: 14, orbit: 210, speed: 0.045, phase: 0.5, tilt: 0.40, sun: 'BOT' },
        { label: 'MARKET-BOT',    icon: '🛒', color: NEON.emerald, size: 14, orbit: 265, speed: 0.035, phase: 2.7, tilt: 0.34, sun: 'BOT' },
        { label: 'AI-GRADER',     icon: '📝', color: NEON.gold,    size: 14, orbit: 325, speed: 0.03,  phase: 4.9, tilt: 0.37, sun: 'BOT' },
        { label: 'PHX-DOCS',      icon: '📄', color: NEON.cyan,    size: 12, orbit: 390, speed: 0.025, phase: 1.0, tilt: 0.31, sun: 'BOT' },
        { label: 'ASH-WEB',       icon: '🌐', color: NEON.purple,  size: 12, orbit: 460, speed: 0.02,  phase: 3.2, tilt: 0.36, sun: 'BOT' },
        { label: 'IRYM-WEB',      icon: '🏠', color: NEON.gold,    size: 12, orbit: 540, speed: 0.015, phase: 5.4, tilt: 0.33, sun: 'BOT' },
    ];

    /* ── STARS ── */
    let stars = [];
    const STAR_COUNT = 400;

    function initStars() {
        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * W,
                y: Math.random() * H,
                s: Math.random() * 1.8 + 0.3,
                a: Math.random() * 0.7 + 0.3,
                speed: Math.random() * 0.5 + 0.1,
                phase: Math.random() * Math.PI * 2,
                depth: Math.random(), // 0=far, 1=near
            });
        }
    }

    /* ── PARTICLES (trails) ── */
    let particles = [];
    const MAX_PARTICLES = 120;

    function spawnTrail(x, y, color) {
        if (particles.length > MAX_PARTICLES) return;
        particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            life: 1.0,
            decay: Math.random() * 0.015 + 0.008,
            size: Math.random() * 2 + 0.5,
            color,
        });
    }

    /* ── ENERGY PULSES on connections ── */
    let pulses = [];
    const MAX_PULSES = 20;

    function spawnPulse(from, to, color) {
        if (pulses.length > MAX_PULSES) return;
        pulses.push({ fx: from.x, fy: from.y, tx: to.x, ty: to.y, t: 0, speed: 0.008 + Math.random() * 0.006, color });
    }

    /* ── SHOOTING STARS ── */
    let shootingStars = [];

    function maybeShootingStar() {
        if (Math.random() > 0.003 || shootingStars.length > 2) return;
        const side = Math.random() > 0.5;
        shootingStars.push({
            x: side ? -50 : W + 50,
            y: Math.random() * H * 0.6,
            vx: side ? (3 + Math.random() * 4) : -(3 + Math.random() * 4),
            vy: 1 + Math.random() * 2,
            life: 1.0,
            len: 60 + Math.random() * 80,
        });
    }

    /* ── RESIZE ── */
    function resize() {
        W = canvas.width = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
        cx = W / 2;
        cy = H / 2;
        initStars();
    }

    /* ── SCENE GRAPH (Z-SORTED) ── */
    function buildScene(t) {
        let elements = [];
        const scale = W > 768 ? Math.min(W / 1400, 1.2) : 0.45;
        const scrollFactor = 1 + (scrollY / H) * 0.4;
        const sunPositions = {};

        // 1. Calculate Suns
        Object.values(SUNS).forEach(sun => {
            const offScale = W > 768 ? 1 : 0.45; // Compress horizontal spread on mobile
            const sx = cx + (sun.xOff * offScale * scale) + (mouse.x - 0.5) * 20;
            const sy = cy + (sun.yOff * offScale * scale) + (mouse.y - 0.5) * 15 - scrollY * 0.1;
            sunPositions[sun.id] = { x: sx, y: sy };
            elements.push({ type: 'sun', data: sun, x: sx, y: sy, z: 0 }); // Suns at local depth 0
        });

        // 2. Calculate Planets
        PLANETS.forEach((p, i) => {
            const sunPos = sunPositions[p.sun || 'AGENT'];
            const angle = t * p.speed + p.phase;
            const rx = p.orbit * scale * scrollFactor;
            const ry = p.orbit * p.tilt * scale * scrollFactor;
            
            // Parallax
            const mx = (mouse.x - 0.5) * 50 * (1 - p.tilt);
            const my = (mouse.y - 0.5) * 30 * (1 - p.tilt);
            const syOffset = scrollY * (0.15 + p.tilt * 0.2);

            const px = sunPos.x + Math.cos(angle) * rx + mx;
            const py = sunPos.y + Math.sin(angle) * ry + my - syOffset;
            const pz = Math.sin(angle) * p.orbit * p.tilt; // Depth determines Z-index

            elements.push({ type: 'planet', data: p, x: px, y: py, z: pz, sunPos, rx, ry, index: i });
        });

        // 3. Sort back-to-front (Z-Sorting for true 3D occlusion)
        elements.sort((a, b) => a.z - b.z);
        return { elements, sunPositions };
    }

    /* ── DRAW FUNCTIONS ── */

    function drawBackground() {
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.7);
        grad.addColorStop(0, '#0a0018');
        grad.addColorStop(0.3, '#050012');
        grad.addColorStop(0.7, '#020008');
        grad.addColorStop(1, '#000000');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
    }

    function drawNebula(sunPositions) {
        const nebulaConfigs = [
            { id: 'TECH', r: W * 0.4, color: [0, 212, 255], a: 0.08 },
            { id: 'AGENT', r: W * 0.5, color: [112, 0, 255], a: 0.10 },
            { id: 'BOT', r: W * 0.4, color: [255, 107, 0], a: 0.07 },
            { id: 'BG', x: cx, y: cy - H * 0.3, r: W * 0.6, color: [43, 4, 113], a: 0.05 },
        ];
        
        nebulaConfigs.forEach((n, i) => {
            const drift = Math.sin(time * 0.08 + i * 1.5) * 30;
            const mx = (mouse.x - 0.5) * 50;
            const my = (mouse.y - 0.5) * 35;
            
            const nx = n.id === 'BG' ? n.x : sunPositions[n.id.toLowerCase()].x;
            const ny = n.id === 'BG' ? n.y : sunPositions[n.id.toLowerCase()].y;

            const g = ctx.createRadialGradient(nx + drift + mx, ny + my, 0, nx + drift + mx, ny + my, n.r);
            const pulse = 0.7 + Math.sin(time * 0.12 + i) * 0.3;
            g.addColorStop(0, `rgba(${n.color[0]},${n.color[1]},${n.color[2]},${n.a * pulse})`);
            g.addColorStop(0.4, `rgba(${n.color[0]},${n.color[1]},${n.color[2]},${n.a * pulse * 0.4})`);
            g.addColorStop(1, 'transparent');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, W, H);
        });
    }

    function drawStars() {
        stars.forEach(s => {
            const twinkle = 0.5 + Math.sin(time * s.speed + s.phase) * 0.5;
            const a = s.a * twinkle;
            const px = s.x + (mouse.x - 0.5) * 15 * s.depth;
            const py = s.y + (mouse.y - 0.5) * 10 * s.depth;
            ctx.beginPath();
            ctx.arc(px, py, s.s, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200,210,255,${a})`;
            ctx.fill();
        });
    }

    function drawOrbitPaths(elements) {
        ctx.setLineDash([2, 6]);
        elements.forEach(el => {
            if (el.type !== 'planet') return;
            ctx.beginPath();
            ctx.ellipse(el.sunPos.x, el.sunPos.y, el.rx, el.ry, 0, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255,255,255,0.02)`; // Very faint
            ctx.lineWidth = 0.5;
            ctx.stroke();
        });
        ctx.setLineDash([]);
    }

    function drawConnections(elements) {
        elements.forEach(el => {
            if (el.type !== 'planet') return;
            const p = el.data;
            const pulse = 0.12 + Math.sin(time * 0.3 + el.index * 1.2) * 0.06;

            ctx.beginPath();
            ctx.moveTo(el.sunPos.x, el.sunPos.y);
            const cpx = (el.sunPos.x + el.x) / 2 + Math.sin(time * 0.2 + el.index) * 30;
            const cpy = (el.sunPos.y + el.y) / 2 + Math.cos(time * 0.2 + el.index) * 20;
            ctx.quadraticCurveTo(cpx, cpy, el.x, el.y);
            ctx.strokeStyle = hexToRGBA(p.color, pulse * 0.3); // Subtle connections
            ctx.lineWidth = 1.0;
            ctx.stroke();

            if (Math.random() < 0.003) spawnPulse(el.sunPos, {x: el.x, y: el.y}, p.color);
        });
    }

    function drawElement(el, t) {
        if (el.type === 'sun') {
            const sun = el.data;
            const pulse = 1 + Math.sin(t * 0.3) * 0.15;
            const glowR = sun.size * 3.5 * pulse;

            // Sun Halo
            const halo = ctx.createRadialGradient(el.x, el.y, 0, el.x, el.y, glowR);
            halo.addColorStop(0, hexToRGBA(sun.color, 0.3));
            halo.addColorStop(0.5, hexToRGBA(sun.color, 0.05));
            halo.addColorStop(1, 'transparent');
            ctx.fillStyle = halo;
            ctx.beginPath(); ctx.arc(el.x, el.y, glowR, 0, Math.PI * 2); ctx.fill();

            // Sun Core
            const coreGrad = ctx.createRadialGradient(el.x, el.y, 0, el.x, el.y, sun.size * pulse);
            coreGrad.addColorStop(0, '#ffffff');
            coreGrad.addColorStop(0.3, 'rgba(255,255,255,0.8)');
            coreGrad.addColorStop(0.8, hexToRGBA(sun.color, 0.5));
            coreGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = coreGrad;
            ctx.beginPath(); ctx.arc(el.x, el.y, sun.size * pulse, 0, Math.PI * 2); ctx.fill();

            // Sun Label
            ctx.font = '800 13px "Inter", sans-serif';
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.textAlign = 'center';
            ctx.fillText(sun.label, el.x, el.y - sun.size - 15);
        } 
        else if (el.type === 'planet') {
            const p = el.data;
            
            // Planet Glow
            const glowR = p.size * 3.5;
            const glow = ctx.createRadialGradient(el.x, el.y, 0, el.x, el.y, glowR);
            glow.addColorStop(0, hexToRGBA(p.color, 0.5));
            glow.addColorStop(0.4, hexToRGBA(p.color, 0.1));
            glow.addColorStop(1, 'transparent');
            ctx.fillStyle = glow;
            ctx.beginPath(); ctx.arc(el.x, el.y, glowR, 0, Math.PI * 2); ctx.fill();

            // Planet Body
            const bodyGrad = ctx.createRadialGradient(el.x - p.size*0.3, el.y - p.size*0.3, 0, el.x, el.y, p.size);
            bodyGrad.addColorStop(0, '#ffffff');
            bodyGrad.addColorStop(0.4, hexToRGBA(p.color, 0.9));
            bodyGrad.addColorStop(1, hexToRGBA(p.color, 0.3));
            ctx.fillStyle = bodyGrad;
            ctx.beginPath(); ctx.arc(el.x, el.y, p.size, 0, Math.PI * 2); ctx.fill();

            // Data-Vis Tactical UI Brackets
            const b = p.size + 6;
            ctx.strokeStyle = hexToRGBA(p.color, 0.6);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(el.x - b, el.y - b/2); ctx.lineTo(el.x - b, el.y - b); ctx.lineTo(el.x - b/2, el.y - b);
            ctx.moveTo(el.x + b, el.y - b/2); ctx.lineTo(el.x + b, el.y - b); ctx.lineTo(el.x + b/2, el.y - b);
            ctx.moveTo(el.x - b, el.y + b/2); ctx.lineTo(el.x - b, el.y + b); ctx.lineTo(el.x - b/2, el.y + b);
            ctx.moveTo(el.x + b, el.y + b/2); ctx.lineTo(el.x + b, el.y + b); ctx.lineTo(el.x + b/2, el.y + b);
            ctx.stroke();

            // Planet Label
            ctx.font = '600 11px "Inter", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = hexToRGBA(p.color, 0.95);
            ctx.fillText(p.label, el.x, el.y + p.size + 20);

            // Technical Sub-label
            ctx.font = '400 9px "Inter", monospace';
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.fillText(`ORBIT ${Math.floor(p.orbit)}`, el.x, el.y + p.size + 32);

            if (Math.random() < 0.2) spawnTrail(el.x, el.y, p.color);
        }
    }

    function drawPulses() {
        for (let i = pulses.length - 1; i >= 0; i--) {
            const p = pulses[i];
            p.t += p.speed;
            if (p.t > 1) { pulses.splice(i, 1); continue; }
            const x = p.fx + (p.tx - p.fx) * p.t;
            const y = p.fy + (p.ty - p.fy) * p.t;
            const a = Math.sin(p.t * Math.PI) * 0.8;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = hexToRGBA(p.color, a);
            ctx.fill();
        }
    }

    function drawParticles() {
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;
            if (p.life <= 0) { particles.splice(i, 1); continue; }
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            ctx.fillStyle = hexToRGBA(p.color, p.life * 0.4);
            ctx.fill();
        }
    }

    function drawShootingStars() {
        maybeShootingStar();
        for (let i = shootingStars.length - 1; i >= 0; i--) {
            const s = shootingStars[i];
            s.x += s.vx;
            s.y += s.vy;
            s.life -= 0.008;
            if (s.life <= 0 || s.x < -100 || s.x > W + 100) {
                shootingStars.splice(i, 1); continue;
            }
            const tailX = s.x - s.vx * s.len / Math.hypot(s.vx, s.vy);
            const tailY = s.y - s.vy * s.len / Math.hypot(s.vx, s.vy);
            const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
            grad.addColorStop(0, `rgba(200,220,255,${s.life * 0.8})`);
            grad.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(tailX, tailY);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }
    }

    /* ── HELPER ── */
    function hexToRGBA(hex, alpha) {
        if (hex.startsWith('rgba') || hex.startsWith('rgb')) return hex;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r},${g},${b},${alpha})`;
    }

    /* ── SMOOTH MOUSE TRACKING ── */
    let targetMouse = { x: 0.5, y: 0.5 };
    const LERP = 0.04;

    function lerpMouse() {
        mouse.x += (targetMouse.x - mouse.x) * LERP;
        mouse.y += (targetMouse.y - mouse.y) * LERP;
        scrollY += (targetScrollY - scrollY) * LERP;
    }

    /* ── MAIN LOOP ── */
    function render() {
        time += 0.016;
        lerpMouse();

        // 1. Build Scene Graph
        const { elements, sunPositions } = buildScene(time);

        // 2. Draw Backgrounds
        drawBackground();
        drawNebula(sunPositions);
        drawStars();
        
        // 3. Draw Infrastructure (Orbits & Lines)
        drawOrbitPaths(elements);
        drawConnections(elements);

        // 4. Draw Z-Sorted Elements (Suns & Planets back-to-front)
        elements.forEach(el => drawElement(el, time));

        // 5. Draw Effects
        drawPulses();
        drawParticles();
        drawShootingStars();

        requestAnimationFrame(render);
    }

    /* ── EVENTS — listen on the hero section, not the canvas ── */
    const heroSection = document.getElementById('hero');
    const listenTarget = heroSection || canvas;

    listenTarget.addEventListener('mousemove', (e) => {
        const r = canvas.getBoundingClientRect();
        targetMouse.x = (e.clientX - r.left) / W;
        targetMouse.y = (e.clientY - r.top) / H;
    }, { passive: true });
    listenTarget.addEventListener('mouseleave', () => {
        targetMouse.x = 0.5; targetMouse.y = 0.5;
    }, { passive: true });
    listenTarget.addEventListener('touchmove', (e) => {
        const r = canvas.getBoundingClientRect();
        targetMouse.x = (e.touches[0].clientX - r.left) / W;
        targetMouse.y = (e.touches[0].clientY - r.top) / H;
    }, { passive: true });

    window.addEventListener('scroll', () => {
        targetScrollY = window.scrollY;
    }, { passive: true });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 200);
    });

    resize();
    requestAnimationFrame(render);
})();
