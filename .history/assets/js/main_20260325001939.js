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

// ── TRACK CLIQUE WHATSAPP
document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', () => {
        if (typeof gtag === 'function') {
            gtag('event', 'click_whatsapp', {
                event_category: 'engajamento',
                event_label: 'botao_whatsapp'
            });
        }
    });
});