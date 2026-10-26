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
