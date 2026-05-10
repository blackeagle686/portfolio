/**
 * Interactive Particle Network — Hero Background
 * GPU-optimized: spatial grid for O(n) connections, RAF-driven, transform-only.
 */
(function () {
    'use strict';

    const canvas = document.getElementById('network-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false }); // Optimization: no alpha channel for canvas background
    let W, H, particles = [], gridCols, gridRows;
    let mouse = { x: -9999, y: -9999, r: 180 };
    const CELL = 140;          // Grid cell size
    const CONNECT = 130;       // Max connection distance
    const SPEED = 0.4;
    const MIN_P = 80, MAX_P = 220; // Increased density

    const COLORS = [
        [168, 85, 247],   // purple
        [192, 132, 252],  // light purple
        [207, 10, 10],    // red
        [220, 95, 0],     // orange
        [139, 92, 246],   // violet
    ];

    class Particle {
        constructor() {
            this.init();
        }
        init(fromBottom = false) {
            this.x = Math.random() * W;
            this.y = fromBottom ? H + 20 : Math.random() * H;
            this.s = Math.random() * 1.5 + 0.6;
            this.vx = (Math.random() - 0.5) * SPEED;
            this.vy = (Math.random() - 0.5) * SPEED - 0.2; // Antigravity: initial upward bias
            this.driftY = -Math.random() * 0.15 - 0.05;    // Constant upward force
            const c = COLORS[(Math.random() * COLORS.length) | 0];
            this.r = c[0]; this.g = c[1]; this.b = c[2];
            this.a = Math.random() * 0.3 + 0.2;
            this.phase = Math.random() * 6.28;
        }
        update() {
            this.phase += 0.015;
            
            // Antigravity drift
            this.vy += this.driftY * 0.05;
            
            // Mouse interaction (Repulsion/Antigravity feel)
            const dx = mouse.x - this.x, dy = mouse.y - this.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < mouse.r * mouse.r && d2 > 1) {
                const d = Math.sqrt(d2);
                const f = (mouse.r - d) / mouse.r * 0.15;
                this.vx -= dx * f; // Push away
                this.vy -= dy * f; // Push away
            }
            
            // Friction/Damping
            this.vx *= 0.98;
            this.vy *= 0.98;
            
            this.x += this.vx;
            this.y += this.vy;

            // Wrap logic for Antigravity (Bottom to Top)
            if (this.x < -20) this.x = W + 20;
            else if (this.x > W + 20) this.x = -20;
            
            if (this.y < -20) {
                this.y = H + 20;
                this.x = Math.random() * W;
            } else if (this.y > H + 20) {
                this.y = -20;
            }
        }
    }

    function resize() {
        W = canvas.width = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
        gridCols = Math.ceil(W / CELL) + 1;
        gridRows = Math.ceil(H / CELL) + 1;
        let count = Math.min(MAX_P, Math.max(MIN_P, (W * H * 0.0001) | 0));
        particles = [];
        for (let i = 0; i < count; i++) particles.push(new Particle());
    }

    function draw() {
        // Fast clear
        ctx.fillStyle = '#0a0a0a'; // Match background
        ctx.fillRect(0, 0, W, H);

        // Build spatial grid
        const grid = new Array(gridCols * gridRows);
        for (let i = 0; i < grid.length; i++) grid[i] = [];
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const cx = (p.x / CELL) | 0, cy = (p.y / CELL) | 0;
            if (cx >= 0 && cx < gridCols && cy >= 0 && cy < gridRows) {
                grid[cy * gridCols + cx].push(i);
            }
        }

        // Draw connections
        ctx.lineWidth = 0.4;
        for (let gy = 0; gy < gridRows; gy++) {
            for (let gx = 0; gx < gridCols; gx++) {
                const cell = grid[gy * gridCols + gx];
                if (!cell.length) continue;
                for (let ny = gy; ny <= gy + 1 && ny < gridRows; ny++) {
                    for (let nx = (ny === gy ? gx : gx - 1); nx <= gx + 1 && nx < gridCols; nx++) {
                        if (nx < 0) continue;
                        const ncell = grid[ny * gridCols + nx];
                        if (!ncell.length) continue;
                        for (let i = 0; i < cell.length; i++) {
                            const a = particles[cell[i]];
                            const jStart = (ny === gy && nx === gx) ? i + 1 : 0;
                            for (let j = jStart; j < ncell.length; j++) {
                                const b = particles[ncell[j]];
                                const dx = a.x - b.x, dy = a.y - b.y;
                                const d2 = dx * dx + dy * dy;
                                if (d2 < CONNECT * CONNECT) {
                                    const dist = Math.sqrt(d2);
                                    const op = (1 - dist / CONNECT) * 0.2;
                                    ctx.beginPath();
                                    ctx.moveTo(a.x, a.y);
                                    ctx.lineTo(b.x, b.y);
                                    ctx.strokeStyle = `rgba(168,85,247,${op})`;
                                    ctx.stroke();
                                }
                            }
                        }
                    }
                }
            }
        }

        // Draw particles & Mouse interaction
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.update();
            
            const sz = p.s + Math.sin(p.phase) * 0.3;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, sz, 0, 6.28);
            ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${p.a})`;
            ctx.fill();

            // Interactive mouse connections
            if (mouse.x > 0) {
                const dx = p.x - mouse.x, dy = p.y - mouse.y;
                const d2 = dx * dx + dy * dy;
                if (d2 < mouse.r * mouse.r) {
                    const dist = Math.sqrt(d2);
                    const op = (1 - dist / mouse.r) * 0.25;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(192,132,252,${op})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(draw);
    }

    // Events (passive for perf)
    canvas.addEventListener('mousemove', (e) => {
        const r = canvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
    }, { passive: true });
    canvas.addEventListener('mouseleave', () => { mouse.x = -9999; }, { passive: true });
    canvas.addEventListener('touchmove', (e) => {
        const r = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - r.left;
        mouse.y = e.touches[0].clientY - r.top;
    }, { passive: true });
    canvas.addEventListener('touchend', () => { mouse.x = -9999; }, { passive: true });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 200);
    });

    resize();
    requestAnimationFrame(draw);
})();
