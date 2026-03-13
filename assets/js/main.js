document.addEventListener("DOMContentLoaded", () => {
    // ── MENU MOBILE
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', navLinks.classList.contains('active'));
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

    const AUTOPLAY_DELAY = 5000;
    let currentIndex = 0;
    let autoplay = null;
    let isTransitioning = false;

    const totalSlides = slides.length;

    function updateIndicators() {
        slides.forEach(s => s.classList.remove("active"));
        dots.forEach(d => d.classList.remove("active"));

        slides[currentIndex].classList.add("active");
        dots[currentIndex].classList.add("active");

        // Acessibilidade
        dots.forEach((dot, i) => {
            dot.setAttribute("aria-selected", i === currentIndex);
        });
    }

    function goToSlide(targetIndex) {
        if (isTransitioning) return;
        isTransitioning = true;

        // Normaliza o índice (loop infinito)
        const newIndex = (targetIndex + totalSlides) % totalSlides;

        // Detecta se é uma transição de "volta ao início/fim"
        const isJumping = 
            (newIndex === 0 && currentIndex === totalSlides - 1) ||
            (newIndex === totalSlides - 1 && currentIndex === 0);

        currentIndex = newIndex;

        if (isJumping) {
            // Remove transição → move instantaneamente → restaura transição
            slidesContainer.style.transition = "none";
            slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;

            // Força o browser a aplicar a mudança sem transição
            void slidesContainer.offsetWidth;

            // Volta a transição normal para os próximos slides
            setTimeout(() => {
                slidesContainer.style.transition = "transform 0.8s ease-in-out";
            }, 20);
        } else {
            // Transição normal
            slidesContainer.style.transition = "transform 0.8s ease-in-out";
            slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        updateIndicators();

        // Libera o controle depois da animação
        setTimeout(() => {
            isTransitioning = false;
        }, 850);
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    // Eventos dos botões
    if (nextBtn) nextBtn.addEventListener("click", () => { nextSlide(); resetAutoplay(); });
    if (prevBtn) prevBtn.addEventListener("click", () => { prevSlide(); resetAutoplay(); });

    // Dots (clique + teclado)
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

    // Autoplay
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

    // Pausar no hover
    if (carousel) {
        carousel.addEventListener("mouseenter", stopAutoplay);
        carousel.addEventListener("mouseleave", startAutoplay);
    }

    // Suporte a swipe (toque) no mobile
    let touchStartX = 0;
    let touchEndX = 0;

    if (carousel) {
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
    }

    // Inicializa
    slidesContainer.style.transition = "transform 0.8s ease-in-out";
    goToSlide(0);
    startAutoplay();
});