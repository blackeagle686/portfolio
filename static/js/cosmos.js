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
        TECH:  { id: 'tech',  label: 'HIGH-TECH HUB', color: NEON.cyan,    xOff: -550, yOff: -100, size: 40 },
        AGENT: { id: 'agent', label: 'AGENT NEXUS',  color: NEON.purple,  xOff: 0,    yOff: 0,    size: 50 },
        BOT:   { id: 'bot',   label: 'SYSTEM BOTS',  color: NEON.orange,  xOff: 550,  yOff: 150,  size: 35 }
    };

    /* ── AI EMPIRE: CLUSTERED PLANETS ── */
    const PLANETS = [
        // --- HIGH-TECH CLUSTER (Singularity) ---
        { label: 'PHX-QUANTUM',  icon: '⚛️', color: NEON.cyan,    size: 32, orbit: 300, speed: 0.02,  phase: 0.0, tilt: 0.45, sun: 'TECH' },
        { label: 'PHX-PTC',      icon: '⚡', color: NEON.magenta, size: 28, orbit: 420, speed: 0.025, phase: 1.2, tilt: 0.40, sun: 'TECH' },
        { label: 'PHX-LLM',      icon: '🧠', color: NEON.purple,  size: 30, orbit: 540, speed: 0.03,  phase: 2.5, tilt: 0.35, sun: 'TECH' },
        { label: 'MYAGENT-AGI',  icon: '🔮', color: NEON.emerald, size: 26, orbit: 660, speed: 0.035, phase: 3.8, tilt: 0.30, sun: 'TECH' },
        { label: 'GYOMEI-CORE',   icon: '🪨', color: NEON.gold,    size: 18, orbit: 220, speed: 0.07,  phase: 0.2, tilt: 0.15, sun: 'TECH' },

        // --- AGENT CLUSTER (Nexus) ---
        { label: 'ASHBORN',      icon: '💀', color: NEON.rose,    size: 24, orbit: 320, speed: 0.045, phase: 0.5, tilt: 0.25, sun: 'AGENT' },
        { label: 'GIYU-SENTINEL', icon: '🌊', color: NEON.blue,    size: 22, orbit: 440, speed: 0.05,  phase: 1.8, tilt: 0.22, sun: 'AGENT' },
        { label: 'RENGOKU-POWER', icon: '🔥', color: NEON.orange,  size: 22, orbit: 560, speed: 0.055, phase: 3.0, tilt: 0.20, sun: 'AGENT' },
        { label: 'SHINOBU-BRIDGE',icon: '🦋', color: NEON.purple,  size: 20, orbit: 680, speed: 0.06,  phase: 4.2, tilt: 0.18, sun: 'AGENT' },
        { label: 'PHOENIX-AI',    icon: '🐦', color: NEON.orange,  size: 20, orbit: 200, speed: 0.04,  phase: 1.0, tilt: 0.28, sun: 'AGENT' },
        { label: 'SKYGUARD',      icon: '🛡️', color: NEON.rose,    size: 18, orbit: 800, speed: 0.065, phase: 2.2, tilt: 0.18, sun: 'AGENT' },

        // --- BOTS CLUSTER (Automaton) ---
        { label: 'MAFQOOD-AI',    icon: '🔍', color: NEON.blue,    size: 18, orbit: 280, speed: 0.052, phase: 3.5, tilt: 0.24, sun: 'BOT' },
        { label: 'EDU-CHAT',      icon: '🎓', color: NEON.blue,    size: 14, orbit: 380, speed: 0.058, phase: 0.3, tilt: 0.20, sun: 'BOT' },
        { label: 'REAL-STATE',    icon: '🏢', color: NEON.orange,  size: 14, orbit: 480, speed: 0.048, phase: 1.6, tilt: 0.26, sun: 'BOT' },
        { label: 'SVU-BOT',       icon: '🤖', color: NEON.rose,    size: 14, orbit: 580, speed: 0.032, phase: 2.9, tilt: 0.32, sun: 'BOT' },
        { label: 'MARKET-BOT',    icon: '🛒', color: NEON.emerald, size: 14, orbit: 680, speed: 0.028, phase: 4.1, tilt: 0.38, sun: 'BOT' },
        { label: 'AI-GRADER',     icon: '📝', color: NEON.gold,    size: 14, orbit: 780, speed: 0.022, phase: 5.4, tilt: 0.42, sun: 'BOT' },
        
        // --- SHARED INFRASTRUCTURE (Nexus Orbits) ---
        { label: 'OBANAI-RULES',  icon: '🐍', color: NEON.emerald, size: 16, orbit: 900, speed: 0.08,  phase: 1.5, tilt: 0.12, sun: 'AGENT' },
        { label: 'MUICHIRO-MEM',  icon: '🌫️', color: NEON.cyan,    size: 16, orbit: 1000, speed: 0.09,  phase: 2.8, tilt: 0.10, sun: 'AGENT' },
        { label: 'TENGEN-IO',     icon: '💎', color: NEON.magenta, size: 14, orbit: 1100, speed: 0.10,  phase: 4.0, tilt: 0.08, sun: 'AGENT' },
        { label: 'SANEMI-NET',    icon: '🌪️', color: NEON.white,   size: 14, orbit: 1200, speed: 0.11,  phase: 5.2, tilt: 0.06, sun: 'AGENT' },
        { label: 'MITSURI-REC',   icon: '💖', color: NEON.magenta, size: 14, orbit: 1300, speed: 0.085, phase: 4.8, tilt: 0.14, sun: 'AGENT' },

        // --- TOOLS (Nexus Inner) ---
        { label: 'PHX-DOCS',      icon: '📄', color: NEON.cyan,    size: 10, orbit: 140, speed: 0.13,  phase: 0.8, tilt: 0.05, sun: 'AGENT' },
        { label: 'ASH-WEB',       icon: '🌐', color: NEON.purple,  size: 12, orbit: 120, speed: 0.15,  phase: 2.1, tilt: 0.04, sun: 'AGENT' },
        { label: 'SMART-GIT',     icon: '🎋', color: NEON.emerald, size: 10, orbit: 100, speed: 0.18,  phase: 3.4, tilt: 0.03, sun: 'AGENT' },
        { label: 'IRYM-WEB',      icon: '🏠', color: NEON.gold,    size: 10, orbit: 80,  speed: 0.20,  phase: 4.7, tilt: 0.02, sun: 'AGENT' },
        { label: 'CODER-V2',      icon: '💻', color: NEON.cyan,    size: 12, orbit: 1400, speed: 0.018, phase: 0.7, tilt: 0.48, sun: 'AGENT' },
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
        const sun = SUNS[p.sun || 'AGENT'];
        const angle = t * p.speed + p.phase;
        const scale = W > 768 ? Math.min(W / 1400, 1.2) : 0.45;
        
        // Scroll-based expansion
        const scrollFactor = 1 + (scrollY / H) * 0.5;
        const rx = p.orbit * scale * scrollFactor;
        const ry = p.orbit * p.tilt * scale * scrollFactor;
        
        // Parallax
        const mx = (mouse.x - 0.5) * 40 * (1 - p.tilt);
        const my = (mouse.y - 0.5) * 25 * (1 - p.tilt);
        const sy = scrollY * (0.15 + p.tilt * 0.2);

        // Origin point (Sun's position)
        const ox = cx + sun.xOff * scale + (mouse.x - 0.5) * 20;
        const oy = cy + sun.yOff * scale + (mouse.y - 0.5) * 15 - scrollY * 0.1;
        
        return {
            x: ox + Math.cos(angle) * rx + mx,
            y: oy + Math.sin(angle) * ry + my - sy,
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

        ctx.setLineDash([2, 6]);
        PLANETS.forEach(p => {
            const sun = SUNS[p.sun || 'AGENT'];
            const ox = cx + sun.xOff * scale + (mouse.x - 0.5) * 20;
            const oy = cy + sun.yOff * scale + (mouse.y - 0.5) * 15 - scrollY * 0.1;
            
            const rx = p.orbit * scale * scrollFactor;
            const ry = p.orbit * p.tilt * scale * scrollFactor;
            
            ctx.beginPath();
            ctx.ellipse(ox, oy, rx, ry, 0, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255,255,255,0.03)`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
        });
        ctx.setLineDash([]);
    }

    function drawSuns() {
        const scale = W > 768 ? Math.min(W / 1400, 1.2) : 0.45;
        const sunPositions = {};

        Object.values(SUNS).forEach(sun => {
            const sx = cx + sun.xOff * scale + (mouse.x - 0.5) * 20;
            const sy = cy + sun.yOff * scale + (mouse.y - 0.5) * 15 - scrollY * 0.1;
            sunPositions[sun.id] = { x: sx, y: sy };

            const pulse = 1 + Math.sin(time * 0.3) * 0.15;
            const glowR = sun.size * 3 * pulse;

            // Halo
            const halo = ctx.createRadialGradient(sx, sy, 0, sx, sy, glowR);
            halo.addColorStop(0, hexToRGBA(sun.color, 0.25));
            halo.addColorStop(0.5, hexToRGBA(sun.color, 0.05));
            halo.addColorStop(1, 'transparent');
            ctx.fillStyle = halo;
            ctx.beginPath();
            ctx.arc(sx, sy, glowR, 0, Math.PI * 2);
            ctx.fill();

            // Radiant Core
            const coreGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, sun.size * 0.8 * pulse);
            coreGrad.addColorStop(0, 'rgba(255,255,255,1)');
            coreGrad.addColorStop(0.3, 'rgba(255,255,255,0.8)');
            coreGrad.addColorStop(0.7, hexToRGBA(sun.color, 0.4));
            coreGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = coreGrad;
            ctx.beginPath();
            ctx.arc(sx, sy, sun.size * 0.8 * pulse, 0, Math.PI * 2);
            ctx.fill();

            // Label
            ctx.font = '900 12px "Fira Code", monospace';
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.textAlign = 'center';
            ctx.fillText(sun.label, sx, sy - sun.size - 10);
        });

        return sunPositions;
    }

    function drawConnections(planetPositions, sunPositions) {
        planetPositions.forEach((pos, i) => {
            const p = PLANETS[i];
            const sunPos = sunPositions[SUNS[p.sun || 'AGENT'].id];
            const pulse = 0.12 + Math.sin(time * 0.3 + i * 1.2) * 0.06;

            ctx.beginPath();
            ctx.moveTo(sunPos.x, sunPos.y);
            const cpx = (sunPos.x + pos.x) / 2 + Math.sin(time * 0.2 + i) * 30;
            const cpy = (sunPos.y + pos.y) / 2 + Math.cos(time * 0.2 + i) * 20;
            ctx.quadraticCurveTo(cpx, cpy, pos.x, pos.y);
            ctx.strokeStyle = hexToRGBA(p.color, pulse + 0.04);
            ctx.lineWidth = 1.2;
            ctx.stroke();

            if (Math.random() < 0.005) {
                spawnPulse(sunPos, pos, p.color);
            }
        });
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

        const sunPositions = drawSuns();
        const planetPositions = drawPlanets(time);

        drawConnections(planetPositions, sunPositions);
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
