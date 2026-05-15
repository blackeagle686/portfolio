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
    const PLANETS = [
        // LAYER 1: DEEP TECH (Outer Orbits)
        { label: 'PHX-QUANTUM',  icon: '⚛️', color: NEON.cyan,    size: 32, orbit: 620, speed: 0.02,  phase: 0.0, tilt: 0.45 },
        { label: 'PHX-PTC',      icon: '⚡', color: NEON.magenta, size: 28, orbit: 580, speed: 0.025, phase: 1.2, tilt: 0.40 },
        { label: 'PHX-LLM',      icon: '🧠', color: NEON.purple,  size: 30, orbit: 540, speed: 0.03,  phase: 2.5, tilt: 0.35 },
        { label: 'MYAGENT-AGI',  icon: '🔮', color: NEON.emerald, size: 26, orbit: 500, speed: 0.035, phase: 3.8, tilt: 0.30 },

        // LAYER 2: HASHIRA AGENTS (Mid Orbits)
        { label: 'ASHBORN',      icon: '💀', color: NEON.rose,    size: 24, orbit: 450, speed: 0.045, phase: 0.5, tilt: 0.25 },
        { label: 'GIYU-SENTINEL', icon: '🌊', color: NEON.blue,    size: 22, orbit: 410, speed: 0.05,  phase: 1.8, tilt: 0.22 },
        { label: 'RENGOKU-POWER', icon: '🔥', color: NEON.orange,  size: 22, orbit: 370, speed: 0.055, phase: 3.0, tilt: 0.20 },
        { label: 'SHINOBU-BRIDGE',icon: '🦋', color: NEON.purple,  size: 20, orbit: 330, speed: 0.06,  phase: 4.2, tilt: 0.18 },

        // LAYER 3: CORE SYSTEMS
        { label: 'GYOMEI-CORE',   icon: '🪨', color: NEON.gold,    size: 18, orbit: 290, speed: 0.07,  phase: 0.2, tilt: 0.15 },
        { label: 'OBANAI-RULES',  icon: '🐍', color: NEON.emerald, size: 16, orbit: 260, speed: 0.08,  phase: 1.5, tilt: 0.12 },
        { label: 'MUICHIRO-MEM',  icon: '🌫️', color: NEON.cyan,    size: 16, orbit: 230, speed: 0.09,  phase: 2.8, tilt: 0.10 },
        { label: 'TENGEN-IO',     icon: '💎', color: NEON.magenta, size: 14, orbit: 200, speed: 0.10,  phase: 4.0, tilt: 0.08 },
        { label: 'SANEMI-NET',    icon: '🌪️', color: NEON.white,   size: 14, orbit: 175, speed: 0.11,  phase: 5.2, tilt: 0.06 },

        // LAYER 4: FRAMEWORKS & APPS
        { label: 'PHOENIX-AI',    icon: '🐦', color: NEON.orange,  size: 20, orbit: 480, speed: 0.04,  phase: 1.0, tilt: 0.28 },
        { label: 'SKYGUARD',      icon: '🛡️', color: NEON.rose,    size: 18, orbit: 310, speed: 0.065, phase: 2.2, tilt: 0.18 },
        { label: 'MAFQOOD-AI',    icon: '🔍', color: NEON.blue,    size: 16, orbit: 390, speed: 0.052, phase: 3.5, tilt: 0.24 },
        { label: 'MITSURI-REC',   icon: '💖', color: NEON.magenta, size: 14, orbit: 245, speed: 0.085, phase: 4.8, tilt: 0.14 },

        // LAYER 5: WEB & TOOLS (Inner & Far)
        { label: 'PHX-DOCS',      icon: '📄', color: NEON.cyan,    size: 10, orbit: 150, speed: 0.13,  phase: 0.8, tilt: 0.05 },
        { label: 'ASH-WEB',       icon: '🌐', color: NEON.purple,  size: 12, orbit: 130, speed: 0.15,  phase: 2.1, tilt: 0.04 },
        { label: 'SMART-GIT',     icon: '🎋', color: NEON.emerald, size: 10, orbit: 110, speed: 0.18,  phase: 3.4, tilt: 0.03 },
        { label: 'IRYM-WEB',      icon: '🏠', color: NEON.gold,    size: 10, orbit: 95,  speed: 0.20,  phase: 4.7, tilt: 0.02 },

        // LAYER 6: SPECIALIZED BOTS
        { label: 'EDU-CHAT',      icon: '🎓', color: NEON.blue,    size: 12, orbit: 350, speed: 0.058, phase: 0.3, tilt: 0.20 },
        { label: 'REAL-STATE',    icon: '🏢', color: NEON.orange,  size: 12, orbit: 430, speed: 0.048, phase: 1.6, tilt: 0.26 },
        { label: 'SVU-BOT',       icon: '🤖', color: NEON.rose,    size: 12, orbit: 515, speed: 0.032, phase: 2.9, tilt: 0.32 },
        { label: 'MARKET-BOT',    icon: '🛒', color: NEON.emerald, size: 12, orbit: 560, speed: 0.028, phase: 4.1, tilt: 0.38 },
        { label: 'AI-GRADER',     icon: '📝', color: NEON.gold,    size: 12, orbit: 600, speed: 0.022, phase: 5.4, tilt: 0.42 },
        { label: 'CODER-V2',      icon: '💻', color: NEON.cyan,    size: 12, orbit: 640, speed: 0.018, phase: 0.7, tilt: 0.48 },
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

    /* ── GET PLANET POSITION ── */
    function getPlanetPos(p, t) {
        const angle = t * p.speed + p.phase;
        const scale = W > 768 ? Math.min(W / 1400, 1.2) : 0.45;
        
        // Scroll-based expansion: orbits grow as you scroll
        const scrollFactor = 1 + (scrollY / H) * 0.5;
        const rx = p.orbit * scale * scrollFactor;
        const ry = p.orbit * p.tilt * scale * scrollFactor;
        
        // Parallax offset from mouse
        const mx = (mouse.x - 0.5) * 40 * (1 - p.tilt);
        const my = (mouse.y - 0.5) * 25 * (1 - p.tilt);
        
        // Scroll vertical parallax: shift planets up as we scroll down
        const sy = scrollY * (0.15 + p.tilt * 0.2);
        
        return {
            x: cx + Math.cos(angle) * rx + mx,
            y: cy + Math.sin(angle) * ry + my - sy,
        };
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

    function drawNebula() {
        const nebulaConfigs = [
            { x: cx - W * 0.25, y: cy - H * 0.2, r: W * 0.5, color: [168, 85, 247], a: 0.10 },
            { x: cx + W * 0.3, y: cy + H * 0.15, r: W * 0.45, color: [0, 212, 255], a: 0.07 },
            { x: cx, y: cy - H * 0.35, r: W * 0.4, color: [224, 64, 251], a: 0.06 },
            { x: cx - W * 0.2, y: cy + H * 0.3, r: W * 0.35, color: [0, 255, 213], a: 0.05 },
            { x: cx + W * 0.15, y: cy, r: W * 0.3, color: [255, 107, 0], a: 0.04 },
        ];
        nebulaConfigs.forEach((n, i) => {
            const drift = Math.sin(time * 0.08 + i * 1.5) * 30;
            const mx = (mouse.x - 0.5) * 50;
            const my = (mouse.y - 0.5) * 35;
            const g = ctx.createRadialGradient(n.x + drift + mx, n.y + my, 0, n.x + drift + mx, n.y + my, n.r);
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
            // Parallax
            const px = s.x + (mouse.x - 0.5) * 15 * s.depth;
            const py = s.y + (mouse.y - 0.5) * 10 * s.depth;
            ctx.beginPath();
            ctx.arc(px, py, s.s, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200,210,255,${a})`;
            ctx.fill();
            // Bright stars get a cross
            if (s.s > 1.5 && twinkle > 0.7) {
                ctx.strokeStyle = `rgba(200,220,255,${a * 0.3})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(px - s.s * 3, py);
                ctx.lineTo(px + s.s * 3, py);
                ctx.moveTo(px, py - s.s * 3);
                ctx.lineTo(px, py + s.s * 3);
                ctx.stroke();
            }
        });
    }

    function drawOrbitPaths() {
        const scale = W > 768 ? Math.min(W / 1400, 1.2) : 0.45;
        const scrollFactor = 1 + (scrollY / H) * 0.5;
        const sy = scrollY * 0.1; // subtle orbit parallax

        ctx.setLineDash([2, 6]);
        PLANETS.forEach(p => {
            const rx = p.orbit * scale * scrollFactor;
            const ry = p.orbit * p.tilt * scale * scrollFactor;
            ctx.beginPath();
            ctx.ellipse(cx, cy - sy, rx, ry, 0, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255,255,255,0.05)`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
        });
        ctx.setLineDash([]);
    }

    function drawCore() {
        const mx = (mouse.x - 0.5) * 10;
        const my = (mouse.y - 0.5) * 8;
        const coreX = cx + mx;
        const coreY = cy + my - scrollY * 0.15; // Subtle core parallax
        const pulse = 1 + Math.sin(time * 0.3) * 0.15;

        // Outer halo
        const halo = ctx.createRadialGradient(coreX, coreY, 0, coreX, coreY, 80 * pulse);
        halo.addColorStop(0, 'rgba(168,85,247,0.25)');
        halo.addColorStop(0.3, 'rgba(168,85,247,0.08)');
        halo.addColorStop(1, 'transparent');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(coreX, coreY, 80 * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Rotating rings
        for (let r = 0; r < 2; r++) {
            ctx.save();
            ctx.translate(coreX, coreY);
            ctx.rotate(time * (r === 0 ? 0.2 : -0.15) + r * 1.5);
            ctx.beginPath();
            ctx.ellipse(0, 0, 40 + r * 12, 12 + r * 4, 0, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(168,85,247,${0.15 - r * 0.05})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.restore();
        }

        // Core orb
        const coreGrad = ctx.createRadialGradient(coreX, coreY, 0, coreX, coreY, 18 * pulse);
        coreGrad.addColorStop(0, 'rgba(255,255,255,0.95)');
        coreGrad.addColorStop(0.3, 'rgba(192,132,252,0.7)');
        coreGrad.addColorStop(0.7, 'rgba(168,85,247,0.3)');
        coreGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(coreX, coreY, 18 * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Inner bright spot
        ctx.beginPath();
        ctx.arc(coreX, coreY, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.fill();

        return { x: coreX, y: coreY };
    }

    function drawConnections(planetPositions, corePos) {
        // Core to planets
        planetPositions.forEach((pos, i) => {
            const p = PLANETS[i];
            const pulse = 0.12 + Math.sin(time * 0.3 + i * 1.2) * 0.06;

            // Draw as a slightly curved glowing line
            ctx.beginPath();
            ctx.moveTo(corePos.x, corePos.y);
            const cpx = (corePos.x + pos.x) / 2 + Math.sin(time * 0.2 + i) * 30;
            const cpy = (corePos.y + pos.y) / 2 + Math.cos(time * 0.2 + i) * 20;
            ctx.quadraticCurveTo(cpx, cpy, pos.x, pos.y);
            ctx.strokeStyle = hexToRGBA(p.color, pulse + 0.06);
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Glow layer for the connection line
            ctx.beginPath();
            ctx.moveTo(corePos.x, corePos.y);
            ctx.quadraticCurveTo(cpx, cpy, pos.x, pos.y);
            ctx.strokeStyle = hexToRGBA(p.color, pulse * 0.3);
            ctx.lineWidth = 4;
            ctx.stroke();

            // Spawn energy pulse occasionally
            if (Math.random() < 0.008) {
                spawnPulse(corePos, pos, p.color);
            }
        });

        // Planet to planet connections (nearest neighbors)
        for (let i = 0; i < planetPositions.length; i++) {
            const next = (i + 1) % planetPositions.length;
            const a = planetPositions[i], b = planetPositions[next];
            const dist = Math.hypot(a.x - b.x, a.y - b.y);
            if (dist < 400) {
                const op = (1 - dist / 400) * 0.06;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = `rgba(100,200,255,${op})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
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
            // Glow
            const g = ctx.createRadialGradient(x, y, 0, x, y, 10);
            g.addColorStop(0, hexToRGBA(p.color, a * 0.5));
            g.addColorStop(1, 'transparent');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function drawPlanets(t) {
        const positions = [];
        PLANETS.forEach((p, i) => {
            const pos = getPlanetPos(p, t);
            positions.push(pos);

            // Planet glow aura — much larger and brighter
            const glowR = p.size * 4.5;
            const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, glowR);
            glow.addColorStop(0, hexToRGBA(p.color, 0.45));
            glow.addColorStop(0.3, hexToRGBA(p.color, 0.15));
            glow.addColorStop(0.7, hexToRGBA(p.color, 0.04));
            glow.addColorStop(1, 'transparent');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, glowR, 0, Math.PI * 2);
            ctx.fill();

            // Planet body — richer gradient
            const bodyGrad = ctx.createRadialGradient(
                pos.x - p.size * 0.3, pos.y - p.size * 0.3, p.size * 0.1,
                pos.x, pos.y, p.size
            );
            bodyGrad.addColorStop(0, 'rgba(255,255,255,0.7)');
            bodyGrad.addColorStop(0.3, hexToRGBA(p.color, 0.95));
            bodyGrad.addColorStop(0.8, hexToRGBA(p.color, 0.6));
            bodyGrad.addColorStop(1, hexToRGBA(p.color, 0.2));
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = bodyGrad;
            ctx.fill();

            // Planet border — brighter
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, p.size, 0, Math.PI * 2);
            ctx.strokeStyle = hexToRGBA(p.color, 0.7);
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Outer ring for larger planets
            if (p.size >= 26) {
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, p.size + 8, 0, Math.PI * 2);
                ctx.strokeStyle = hexToRGBA(p.color, 0.15);
                ctx.lineWidth = 1;
                ctx.setLineDash([3, 4]);
                ctx.stroke();
                ctx.setLineDash([]);
            }

            // Label — bolder
            ctx.font = '700 11px "Fira Code", monospace';
            ctx.textAlign = 'center';
            ctx.fillStyle = hexToRGBA(p.color, 0.9);
            ctx.fillText(p.label, pos.x, pos.y + p.size + 20);

            // Sub-label glow
            ctx.font = '500 8px "Fira Code", monospace';
            ctx.fillStyle = hexToRGBA(p.color, 0.4);
            ctx.fillText('● ACTIVE', pos.x, pos.y + p.size + 32);

            // Spawn trail particles
            if (Math.random() < 0.3) {
                spawnTrail(pos.x, pos.y, p.color);
            }
        });
        return positions;
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
    const LERP = 0.04; // smooth interpolation factor

    function lerpMouse() {
        mouse.x += (targetMouse.x - mouse.x) * LERP;
        mouse.y += (targetMouse.y - mouse.y) * LERP;
        scrollY += (targetScrollY - scrollY) * LERP;
    }

    /* ── MAIN LOOP ── */
    function render() {
        time += 0.016;
        lerpMouse();

        drawBackground();
        drawNebula();
        drawStars();
        drawOrbitPaths();

        const corePos = drawCore();
        const planetPositions = drawPlanets(time);

        drawConnections(planetPositions, corePos);
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
