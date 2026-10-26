// ================= MENU (celular) =================
(function () {
    var btn = document.getElementById('menu-toggle');
    var nav = document.getElementById('nav');
    if (!btn || !nav) return;
    btn.addEventListener('click', function () {
        var open = nav.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
})();

// ================= CONVERSÃO "CLIQUE WHATSAPP" (Google Ads) =================
// Ação "Clique no WhatsApp" (mesmo rótulo do site anterior, mantém o histórico)
var CONVERSAO_WHATSAPP = 'AW-18440633107/MI2HCJXI8KMdEJP2ltlE';

// Os links de WhatsApp abrem em nova aba, então o site continua aberto
// e o envio por "beacon" garante o registro do clique.
document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href*="wa.me"], a[href*="whatsapp.com"]');
    if (!link) return;
    if (typeof gtag === 'function') {
        gtag('event', 'click_whatsapp', {
            event_category: 'engajamento',
            event_label: location.pathname
        });
        gtag('event', 'conversion', {
            'send_to': CONVERSAO_WHATSAPP,
            'value': 1.0,
            'currency': 'BRL',
            'transport_type': 'beacon'
        });
    }
});

// ================= CARROSSEL (home) =================
(function () {
    var car = document.getElementById('carousel');
    if (!car) return;
    var slides = car.querySelectorAll('.slide');
    var dots = car.querySelectorAll('.dot');
    var i = 0, timer = null, DELAY = 6000;

    function go(n) {
        slides[i].classList.remove('active');
        if (dots[i]) dots[i].classList.remove('active');
        i = (n + slides.length) % slides.length;
        slides[i].classList.add('active');
        if (dots[i]) dots[i].classList.add('active');
    }
    function start() { if (!timer) timer = setInterval(function () { go(i + 1); }, DELAY); }
    function stop() { clearInterval(timer); timer = null; }
    function restart() { stop(); start(); }

    var prev = car.querySelector('.car-prev'), next = car.querySelector('.car-next');
    if (prev) prev.addEventListener('click', function () { go(i - 1); restart(); });
    if (next) next.addEventListener('click', function () { go(i + 1); restart(); });
    dots.forEach(function (d, n) { d.addEventListener('click', function () { go(n); restart(); }); });

    car.addEventListener('mouseenter', stop);
    car.addEventListener('mouseleave', start);

    var x0 = 0;
    car.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    car.addEventListener('touchend', function (e) {
        var dx = x0 - e.changedTouches[0].clientX;
        if (Math.abs(dx) > 50) { go(dx > 0 ? i + 1 : i - 1); restart(); }
    }, { passive: true });

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) start();
})();
