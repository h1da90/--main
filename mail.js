
document.addEventListener('DOMContentLoaded', () => {

    // ---------- Элементы ----------
    const start = document.getElementById('start');
    const book = document.getElementById('book');
    const cover = document.getElementById('cover');
    const btn = document.querySelector('.button1');
    const canvas = document.getElementById('fx');

    if (!start || !book || !cover || !btn || !canvas) {
        console.warn('Не найдены нужные элементы страницы (start, book, cover, button1, fx)');
        return;
    }

    const ctx = canvas.getContext('2d');

    let W, H, dpr, opened = false;

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    // ---------- Частицы ----------
    const EMOJI = ['🌸', '🤍', '✨', '🐾'];
    const parts = [];

    function petal(randomY) {
        parts.push({
            x: Math.random() * W,
            y: randomY ? Math.random() * H : -30,
            vx: (Math.random() - 0.5) * 0.4,
            vy: 0.6 + Math.random() * 0.9,
            g: 0,
            size: 14 + Math.random() * 14,
            rot: Math.random() * 6.28,
            vr: (Math.random() - 0.5) * 0.03,
            sway: Math.random() * 6.28,
            e: EMOJI[Math.floor(Math.random() * 3)],
            alpha: 0.35 + Math.random() * 0.3,
            life: 1, decay: 0, ambient: true
        });
    }

    function burst(x, y, n) {
        for (let i = 0; i < n; i++) {
            const a = Math.random() * 6.28;
            const s = 4 + Math.random() * 9;
            parts.push({
                x, y,
                vx: Math.cos(a) * s,
                vy: Math.sin(a) * s - 4,
                g: 0.18,
                size: 18 + Math.random() * 18,
                rot: Math.random() * 6.28,
                vr: (Math.random() - 0.5) * 0.25,
                sway: 0,
                e: EMOJI[Math.floor(Math.random() * EMOJI.length)],
                alpha: 1, life: 1, decay: 0.010, ambient: false
            });
        }
    }

    function sparkle(x, y) {
        parts.push({
            x: x + (Math.random() - 0.5) * 10,
            y: y + (Math.random() - 0.5) * 10,
            vx: (Math.random() - 0.5) * 1.2,
            vy: Math.random() * 1 + 0.3,
            g: 0.03,
            size: 10 + Math.random() * 8,
            rot: 0, vr: 0.05, sway: 0,
            e: '✨', alpha: 0.9, life: 1, decay: 0.03, ambient: false
        });
    }

    for (let i = 0; i < 14; i++) petal(true);
    setInterval(() => {
        if (parts.filter(p => p.ambient).length < 22) petal(false);
    }, 700);

    function loop() {
        ctx.clearRect(0, 0, W, H);
        for (let i = parts.length - 1; i >= 0; i--) {
            const p = parts[i];
            p.vy += p.g;
            p.x += p.vx + (p.ambient ? Math.sin(p.sway) * 0.5 : 0);
            p.y += p.vy;
            p.sway += 0.02;
            p.rot += p.vr;
            p.life -= p.decay;

            if ((p.ambient && p.y > H + 40) || (!p.ambient && p.life <= 0)) {
                parts.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.globalAlpha = p.ambient ? p.alpha : Math.max(p.life, 0);
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.font = p.size + 'px "Apple Color Emoji","Segoe UI Emoji",sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.e, 0, 0);
            ctx.restore();
        }
        requestAnimationFrame(loop);
    }
    loop();

    // ---------- 3D-наклон, блик и искры за курсором ----------
    let lastSpark = 0;
    window.addEventListener('mousemove', e => {
        if (!opened) {
            const nx = e.clientX / W - 0.5;
            const ny = e.clientY / H - 0.5;
            book.style.setProperty('--ry', (nx * 14).toFixed(2) + 'deg');
            book.style.setProperty('--rx', (-ny * 10).toFixed(2) + 'deg');

            const r = cover.getBoundingClientRect();
            cover.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            cover.style.setProperty('--my', (e.clientY - r.top) + 'px');
        }
        const now = performance.now();
        if (now - lastSpark > 45) {
            sparkle(e.clientX, e.clientY);
            lastSpark = now;
        }
    });

    // ---------- Печатающийся подзаголовок ----------
    const sub = document.querySelector('.album-subtitle');
    if (sub) {
        const text = sub.textContent.trim();
        sub.textContent = '';
        sub.classList.add('typing');
        let i = 0;
        setTimeout(function type() {
            sub.textContent = text.slice(0, ++i);
            if (i < text.length) {
                setTimeout(type, 35);
            } else {
                sub.classList.remove('typing');
            }
        }, 1400);
    }

    // ---------- Переход на следующую страницу (твоя логика) ----------
    function goNext() {
        console.log('Кнопка нажата, перехожу на event.html...');

        // Берём адрес текущей папки и добавляем имя файла
        const currentPath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);

        // Переход с учётом правильного пути репозитория GitHub
        window.location.href = window.location.origin + currentPath + 'event.html';
    }

    // ---------- Клик: открытие альбома, салют, потом переход ----------
    btn.addEventListener('click', () => {
        if (opened) return;
        opened = true;

        const r = btn.getBoundingClientRect();
        burst(r.left + r.width / 2, r.top + r.height / 2, 70);

        book.style.setProperty('--rx', '0deg');
        book.style.setProperty('--ry', '0deg');
        start.classList.add('opened');

        setTimeout(() => burst(W * 0.62, H * 0.5, 60), 900);
        setTimeout(() => start.classList.add('leaving'), 2700);
        setTimeout(goNext, 3500);
    });

});