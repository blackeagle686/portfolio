/**
 * Interactive Particle Network — Hero Background
 * GPU-optimized: spatial grid for O(n) connections, RAF-driven, transform-only.
 */
(function () {
    'use strict';

    const canvas = document.getElementById('network-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H, particles = [], gridCols, gridRows;
    let mouse = { x: -9999, y: -9999, r: 150 };
    const CELL = 150;          // Grid cell size = connection distance
    const CONNECT = 140;       // Max connection distance
    const SPEED = 0.3;
    const MIN_P = 40, MAX_P = 140;

    const COLORS = [
        [168, 85, 247],   // purple
        [192, 132, 252],  // light purple
        [207, 10, 10],    // red
        [220, 95, 0],     // orange
        [139, 92, 246],   // violet
    ];

    class Particle {
        constructor() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.s = Math.random() * 2 + 0.8;
            this.vx = (Math.random() - 0.5) * SPEED * 2;
            this.vy = (Math.random() - 0.5) * SPEED * 2;
            const c = COLORS[(Math.random() * COLORS.length) | 0];
            this.r = c[0]; this.g = c[1]; this.b = c[2];
            this.a = Math.random() * 0.4 + 0.35;
            this.phase = Math.random() * 6.28;
        }
        update() {
            this.phase += 0.015;
            // Mouse attraction
            const dx = mouse.x - this.x, dy = mouse.y - this.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < mouse.r * mouse.r && d2 > 1) {
                const d = Math.sqrt(d2);
                const f = (mouse.r - d) / mouse.r * 0.01;
                this.vx += dx * f;
                this.vy += dy * f;
            }
            this.vx *= 0.998;
            this.vy *= 0.998;
            this.x += this.vx;
            this.y += this.vy;
            // Wrap
            if (this.x < -10) this.x = W + 10;
            else if (this.x > W + 10) this.x = -10;
            if (this.y < -10) this.y = H + 10;
            else if (this.y > H + 10) this.y = -10;
        }
    }

    function resize() {
        W = canvas.width = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
        gridCols = Math.ceil(W / CELL) + 1;
        gridRows = Math.ceil(H / CELL) + 1;
        let count = Math.min(MAX_P, Math.max(MIN_P, (W * H * 0.00005) | 0));
        particles = [];
        for (let i = 0; i < count; i++) particles.push(new Particle());
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

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

        // Draw connections using grid neighbors only
        ctx.lineWidth = 0.5;
        for (let gy = 0; gy < gridRows; gy++) {
            for (let gx = 0; gx < gridCols; gx++) {
                const cell = grid[gy * gridCols + gx];
                if (!cell.length) continue;
                // Check this cell + right, below, and diagonal neighbors
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
                                const dist = Math.sqrt(dx * dx + dy * dy);
                                if (dist < CONNECT) {
                                    const op = (1 - dist / CONNECT) * 0.22;
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

        // Mouse connections
        if (mouse.x > 0) {
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                const dx = p.x - mouse.x, dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.r) {
                    const op = (1 - dist / mouse.r) * 0.3;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(192,132,252,${op})`;
                    ctx.lineWidth = 0.7;
                    ctx.stroke();
                }
            }
        }

        // Draw particles (batched by similar alpha for fewer state changes)
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.update();
            const sz = p.s + Math.sin(p.phase) * 0.4;
            ctx.globalAlpha = p.a;
            ctx.beginPath();
            ctx.arc(p.x, p.y, sz, 0, 6.28);
            ctx.fillStyle = `rgb(${p.r},${p.g},${p.b})`;
            ctx.fill();
        }
        ctx.globalAlpha = 1;

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
