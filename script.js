document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".site-header");
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelectorAll(".nav-links a");
    const navCta = document.querySelector(".nav-cta");
    const scrollTopButton = document.querySelector(".scroll-top");
    const demoButton = document.querySelector("[data-scroll-target]");
    const videoModal = document.querySelector("[data-video-modal]");
    const videoPlayer = document.querySelector("[data-video-player]");
    const videoTitle = document.querySelector("[data-video-title]");
    const videoTriggers = document.querySelectorAll("[data-video-src]");
    const leadForm = document.getElementById("leadForm");
    const formMessage = document.getElementById("formMessage");
    const fields = document.querySelectorAll(".field");
    const revealItems = document.querySelectorAll(".reveal");
    const counterItems = document.querySelectorAll("[data-counter]");
    const faqItems = document.querySelectorAll(".faq-item");
    const track = document.querySelector("[data-testimonials-track]");
    const prevButton = document.querySelector("[data-slider-prev]");
    const nextButton = document.querySelector("[data-slider-next]");

    /* =========================================
       Helpers
       ========================================= */
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lastVideoTrigger = null;

    const setHeaderState = () => {
        if (!header) {
            return;
        }

        header.classList.toggle("scrolled", window.scrollY > 12);
    };

    const closeMenu = () => {
        if (!header || !menuToggle) {
            return;
        }

        header.classList.remove("menu-open");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-lock");
    };

    const openMenu = () => {
        if (!header || !menuToggle) {
            return;
        }

        header.classList.add("menu-open");
        menuToggle.setAttribute("aria-expanded", "true");
        document.body.classList.add("nav-lock");
    };

    const toggleMenu = () => {
        if (!header || !menuToggle) {
            return;
        }

        const isOpen = header.classList.contains("menu-open");
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    const scrollToTarget = (selector) => {
        const target = document.querySelector(selector);
        if (!target) {
            return;
        }

        target.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "start"
        });
    };

    const updateFieldState = (field) => {
        const control = field.querySelector("input, select, textarea");
        if (!control) {
            return;
        }

        field.classList.toggle("filled", Boolean(control.value && control.value.trim ? control.value.trim() : control.value));
    };

    const setMessage = (text, type = "success") => {
        if (!formMessage) {
            return;
        }

        formMessage.textContent = text;
        formMessage.classList.remove("success", "error", "is-visible");
        formMessage.classList.add(type, "is-visible");
    };

    const clearMessage = () => {
        if (!formMessage) {
            return;
        }

        formMessage.textContent = "";
        formMessage.classList.remove("success", "error", "is-visible");
    };

    const closeVideoModal = async ({ exitFullscreen = true } = {}) => {
        if (!videoModal || !videoPlayer) {
            return;
        }

        videoModal.classList.remove("is-open");
        videoModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-lock");

        videoPlayer.pause();
        videoPlayer.removeAttribute("src");
        videoPlayer.load();

        if (exitFullscreen && document.fullscreenElement) {
            try {
                await document.exitFullscreen();
            } catch {
                // Ignore fullscreen exit failures and keep the overlay state clean.
            }
        }

        if (lastVideoTrigger instanceof HTMLElement) {
            lastVideoTrigger.focus();
        }

        lastVideoTrigger = null;
    };

    const openVideoModal = async (trigger) => {
        if (!videoModal || !videoPlayer || !videoTitle) {
            return;
        }

        const source = trigger?.dataset?.videoSrc;
        if (!source) {
            return;
        }

        closeMenu();
        const title = trigger.dataset.videoTitle || "Video Preview";
        lastVideoTrigger = trigger instanceof HTMLElement ? trigger : null;

        videoTitle.textContent = title;
        videoPlayer.src = source;
        videoModal.classList.add("is-open");
        videoModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-lock");
        videoPlayer.load();

        if (videoModal.requestFullscreen) {
            try {
                await videoModal.requestFullscreen();
            } catch {
                // Fullscreen is a progressive enhancement. The overlay still fills the viewport.
            }
        }

        try {
            await videoPlayer.play();
        } catch {
            // Browsers may require explicit playback, so leave controls visible.
        }

        const closeButton = videoModal.querySelector(".video-modal__close");
        closeButton?.focus();
    };

    const animateCounter = (element) => {
        if (element.dataset.counted === "true") {
            return;
        }

        element.dataset.counted = "true";

        const target = Number.parseFloat(element.dataset.counter || "0");
        const decimals = Number.parseInt(element.dataset.decimals || "0", 10);
        const suffix = element.dataset.suffix || "";
        const duration = prefersReducedMotion ? 0 : 1200;
        const startTime = performance.now();

        const tick = (now) => {
            const elapsed = Math.min((now - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - elapsed, 3);
            const value = target * ease;

            element.textContent = `${value.toFixed(decimals)}${suffix}`;

            if (elapsed < 1) {
                window.requestAnimationFrame(tick);
            } else {
                element.textContent = `${target.toFixed(decimals)}${suffix}`;
            }
        };

        if (duration === 0) {
            element.textContent = `${target.toFixed(decimals)}${suffix}`;
            return;
        }

        window.requestAnimationFrame(tick);
    };

    const openFaqItem = (item, open) => {
        item.classList.toggle("is-open", open);
        const button = item.querySelector(".faq-question");
        if (button) {
            button.setAttribute("aria-expanded", open ? "true" : "false");
        }
    };

    const getSlideStep = () => {
        if (!track) {
            return 0;
        }

        const card = track.querySelector(".testimonial-card");
        if (!card) {
            return track.clientWidth * 0.9;
        }

        const styles = window.getComputedStyle(track);
        const gap = Number.parseFloat(styles.columnGap || styles.gap || "0");
        return card.getBoundingClientRect().width + gap;
    };

    /* =========================================
       Sticky Header / Nav
       ========================================= */
    setHeaderState();
    window.addEventListener("scroll", setHeaderState, { passive: true });

    if (menuToggle) {
        menuToggle.addEventListener("click", toggleMenu);
    }

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 900) {
                closeMenu();
            }
        });
    });

    navCta?.addEventListener("click", () => {
        if (window.innerWidth <= 900) {
            closeMenu();
        }
    });

    document.addEventListener("click", (event) => {
        if (!header || !header.classList.contains("menu-open")) {
            return;
        }

        const clickedInsideHeader = header.contains(event.target);
        if (!clickedInsideHeader) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            if (videoModal?.classList.contains("is-open")) {
                closeVideoModal({ exitFullscreen: true });
            }

            closeMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) {
            closeMenu();
        }
    }, { passive: true });

    /* =========================================
       Smooth Scroll Actions
       ========================================= */
    if (demoButton) {
        demoButton.addEventListener("click", () => {
            scrollToTarget(demoButton.getAttribute("data-scroll-target"));
        });
    }

    scrollTopButton?.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? "auto" : "smooth"
        });
    });

    videoTriggers.forEach((trigger) => {
        trigger.addEventListener("click", () => {
            openVideoModal(trigger);
        });

        trigger.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openVideoModal(trigger);
            }
        });
    });

    videoModal?.addEventListener("click", (event) => {
        const target = event.target;

        if (!(target instanceof HTMLElement)) {
            return;
        }

        if (target.matches("[data-close-video]")) {
            closeVideoModal({ exitFullscreen: true });
        }
    });

    document.addEventListener("fullscreenchange", () => {
        if (videoModal?.classList.contains("is-open") && !document.fullscreenElement) {
            closeVideoModal({ exitFullscreen: false });
        }
    });

    /* =========================================
       Hero Form State + Submission
       ========================================= */
    fields.forEach(updateFieldState);

    fields.forEach((field) => {
        const control = field.querySelector("input, select, textarea");
        if (!control) {
            return;
        }

        control.addEventListener("input", () => updateFieldState(field));
        control.addEventListener("change", () => updateFieldState(field));
        control.addEventListener("blur", () => updateFieldState(field));
    });

    if (leadForm) {
        leadForm.addEventListener("submit", (event) => {
            event.preventDefault();

            clearMessage();

            if (!leadForm.checkValidity()) {
                setMessage("Please complete all required fields before submitting.", "error");
                return;
            }

            const submitButton = leadForm.querySelector(".form-submit");
            const originalText = submitButton?.textContent || "Submit Request";

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Sending...";
            }

            window.setTimeout(() => {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                }

                leadForm.reset();
                fields.forEach(updateFieldState);
                setMessage("Thanks! We received your request and will respond within one business day.", "success");

                window.setTimeout(() => {
                    clearMessage();
                }, 4200);
            }, prefersReducedMotion ? 0 : 1100);
        });
    }

    /* =========================================
       FAQ Accordion
       ========================================= */
    faqItems.forEach((item) => {
        const button = item.querySelector(".faq-question");

        if (!button) {
            return;
        }

        button.addEventListener("click", () => {
            const isOpen = item.classList.contains("is-open");

            faqItems.forEach((otherItem) => openFaqItem(otherItem, false));
            openFaqItem(item, !isOpen);
        });
    });

    /* =========================================
       Testimonials Slider
       ========================================= */
    if (track && prevButton && nextButton) {
        prevButton.addEventListener("click", () => {
            track.scrollBy({
                left: -getSlideStep(),
                behavior: prefersReducedMotion ? "auto" : "smooth"
            });
        });

        nextButton.addEventListener("click", () => {
            track.scrollBy({
                left: getSlideStep(),
                behavior: prefersReducedMotion ? "auto" : "smooth"
            });
        });
    }

    /* =========================================
       Scroll Reveal + Counters
       ========================================= */
    if (!prefersReducedMotion && "IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");

                if (entry.target.hasAttribute("data-counter")) {
                    animateCounter(entry.target);
                }

                observer.unobserve(entry.target);
            });
        }, {
            rootMargin: "0px 0px -10% 0px",
            threshold: 0.15
        });

        revealItems.forEach((item) => revealObserver.observe(item));
        counterItems.forEach((item) => revealObserver.observe(item));
    } else {
        revealItems.forEach((item) => item.classList.add("is-visible"));
        counterItems.forEach((item) => animateCounter(item));
    }

    /* =========================================
       Scroll-To-Top Visibility
       ========================================= */
    const updateScrollTopVisibility = () => {
        if (!scrollTopButton) {
            return;
        }

        scrollTopButton.classList.toggle("is-visible", window.scrollY > 500);
    };

    updateScrollTopVisibility();
    window.addEventListener("scroll", updateScrollTopVisibility, { passive: true });
});
