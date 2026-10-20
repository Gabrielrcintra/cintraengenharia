(() => {

    // ── MENU MOBILE
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    if (menuToggle && navLinks) {

        // abrir / fechar botão
        menuToggle.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive);
        });

        // fechar ao clicar em link
        navItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', false);
            });
        });

        // fechar ao clicar fora
        document.addEventListener('click', (e) => {
            const isClickInside =
                navLinks.contains(e.target) ||
                menuToggle.contains(e.target);

            if (!isClickInside) {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', false);
            }
        });
    }

    // ── CARROSSEL
    const slidesContainer = document.querySelector(".slides");
    const slides = document.querySelectorAll(".slide");
    const nextBtn = document.querySelector(".next");
    const prevBtn = document.querySelector(".prev");
    const dots = document.querySelectorAll(".dot");
    const carousel = document.querySelector(".carousel");

    if (!slides.length || !slidesContainer || !carousel) return;

    const AUTOPLAY_DELAY = 4000;
    const TRANSITION_TIME = 800;

    let currentIndex = 0;
    let autoplay = null;
    let isTransitioning = false;

    const totalSlides = slides.length;

    function updateIndicators() {
        slides.forEach(s => s.classList.remove("active"));
        dots.forEach(d => d.classList.remove("active"));

        if (slides[currentIndex]) {
            slides[currentIndex].classList.add("active");
        }

        if (dots[currentIndex]) {
            dots[currentIndex].classList.add("active");
        }

        dots.forEach((dot, i) => {
            dot.setAttribute("aria-selected", i === currentIndex);
        });
    }

    function goToSlide(targetIndex) {
        if (isTransitioning) return;

        isTransitioning = true;

        const newIndex = (targetIndex + totalSlides) % totalSlides;

        const isJumping =
            (newIndex === 0 && currentIndex === totalSlides - 1) ||
            (newIndex === totalSlides - 1 && currentIndex === 0);

        currentIndex = newIndex;

        if (isJumping) {
            slidesContainer.style.transition = "none";
            slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;

            slidesContainer.offsetHeight;

            setTimeout(() => {
                slidesContainer.style.transition = "transform 0.8s ease-in-out";
            }, 20);
        } else {
            slidesContainer.style.transition = "transform 0.8s ease-in-out";
            slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        updateIndicators();

        setTimeout(() => {
            isTransitioning = false;
        }, TRANSITION_TIME);
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    // ── BOTÕES
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            nextSlide();
            resetAutoplay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            prevSlide();
            resetAutoplay();
        });
    }

    // ── DOTS
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            goToSlide(index);
            resetAutoplay();
        });

        dot.addEventListener("keydown", e => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                goToSlide(index);
                resetAutoplay();
            }
        });
    });

    // ── AUTOPLAY
    function startAutoplay() {
        if (!autoplay) {
            autoplay = setInterval(nextSlide, AUTOPLAY_DELAY);
        }
    }

    function stopAutoplay() {
        if (autoplay) {
            clearInterval(autoplay);
            autoplay = null;
        }
    }

    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    // ── PAUSA NO HOVER
    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);

    // ── SWIPE MOBILE
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener("touchstart", e => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    carousel.addEventListener("touchend", e => {
        touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 60) {
            if (diff > 0) nextSlide();
            else prevSlide();
            resetAutoplay();
        }
    }, { passive: true });

    // ── INICIALIZA
    slidesContainer.style.transition = "transform 0.8s ease-in-out";
    goToSlide(0);
    startAutoplay();

})();

// ── TRACK CLIQUE WHATSAPP + CONVERSÃO GOOGLE ADS
// Um único listener para todos os botões de WhatsApp do site.
// Envia o evento de engajamento e a conversão do Google Ads, e só então abre o WhatsApp.
document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href*="wa.me"], a[href*="whatsapp.com"]');
    if (!link || typeof gtag !== 'function') return;

    // evento de engajamento (já existia no site)
    gtag('event', 'click_whatsapp', {
        event_category: 'engajamento',
        event_label: 'botao_whatsapp'
    });

    var conversao = {
        'send_to': 'AW-18440633107/MI2HCJXI8KMdEJP2ltlE'
    };

    // Ctrl/Cmd/Shift + clique ou link em nova aba: só registra, não interfere na navegação
    if (e.ctrlKey || e.metaKey || e.shiftKey || link.target === '_blank') {
        gtag('event', 'conversion', conversao);
        return;
    }

    // clique normal: espera o envio da conversão antes de sair da página
    e.preventDefault();

    var url = link.href;
    var feito = false;

    function ir() {
        if (feito) return;
        feito = true;
        window.location.href = url;
    }

    conversao.event_callback = ir;
    gtag('event', 'conversion', conversao);

    // garantia caso o Google demore a responder
    setTimeout(ir, 1000);
});