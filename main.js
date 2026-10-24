(() => {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const hero = document.querySelector(".heroContainer");
  const heroControls = document.querySelectorAll(".heroSlideBtn a");
  let currentSlide = 0;

  if (hero && slides.length) {
    hero.style.overflow = "hidden";
    hero.style.zIndex = "1";

    const showSlide = (index) => {
      currentSlide = (index + slides.length) % slides.length;

      slides.forEach((slide, slideIndex) => {
        slide.style.left = `${(slideIndex - currentSlide) * 100}%`;
        slide.style.transition = "left 500ms ease";
        slide.setAttribute("aria-hidden", String(slideIndex !== currentSlide));
      });
    };

    showSlide(0);

    heroControls.forEach((control, index) => {
      control.setAttribute("aria-label", index === 0 ? "Previous slide" : "Next slide");
      control.addEventListener("click", (event) => {
        event.preventDefault();
        showSlide(currentSlide + (index === 0 ? -1 : 1));
      });
    });

    if (slides.length > 1) {
      window.setInterval(() => {
        if (!document.hidden) {
          showSlide(currentSlide + 1);
        }
      }, 5000);
    }
  }

  const testimonialCards = Array.from(document.querySelectorAll(".testimonialCard"));
  const testimonialDots = Array.from(document.querySelectorAll(".testimonialDots span"));

  if (testimonialCards.length && testimonialDots.length) {
    let activeTestimonial = Math.max(
      0,
      testimonialCards.findIndex((card) => card.classList.contains("active"))
    );

    const showTestimonial = (index) => {
      activeTestimonial = index;

      testimonialCards.forEach((card, cardIndex) => {
        card.classList.toggle("active", cardIndex === activeTestimonial);
      });

      testimonialDots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === activeTestimonial;
        dot.hidden = dotIndex >= testimonialCards.length;
        dot.classList.toggle("active", isActive);
        dot.setAttribute("role", "button");
        dot.setAttribute("tabindex", dot.hidden ? "-1" : "0");
        dot.setAttribute("aria-label", `Show testimonial ${dotIndex + 1}`);
        dot.setAttribute("aria-pressed", String(isActive));
      });
    };

    testimonialDots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        if (index < testimonialCards.length) {
          showTestimonial(index);
        }
      });

      dot.addEventListener("keydown", (event) => {
        if ((event.key === "Enter" || event.key === " ") && index < testimonialCards.length) {
          event.preventDefault();
          showTestimonial(index);
        }
      });
    });

    showTestimonial(activeTestimonial);

    if (testimonialCards.length > 1) {
      window.setInterval(() => {
        if (!document.hidden) {
          showTestimonial((activeTestimonial + 1) % testimonialCards.length);
        }
      }, 6000);
    }
  }

  const sectionLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'))
    .filter((link) => link.getAttribute("href").length > 1);
  const navigationSections = Array.from(
    new Set(
      sectionLinks
        .map((link) => document.querySelector(link.getAttribute("href")))
        .filter(Boolean)
    )
  );

  if (sectionLinks.length && navigationSections.length) {
    const updateActiveNavigation = () => {
      const nav = document.querySelector("nav");
      const navBottom = nav ? nav.getBoundingClientRect().bottom : 0;
      const activationLine = navBottom + 150;
      let activeSection = null;
      let activeSectionTop = Number.NEGATIVE_INFINITY;

      navigationSections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= activationLine && sectionTop > activeSectionTop) {
          activeSection = section;
          activeSectionTop = sectionTop;
        }
      });

      const isAtPageBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1;
      if (isAtPageBottom) {
        activeSection = navigationSections.reduce((lastSection, section) =>
          section.getBoundingClientRect().top > lastSection.getBoundingClientRect().top
            ? section
            : lastSection
        );
      } else if (!activeSection) {
        activeSection = navigationSections[0];
      }

      const activeId = activeSection.id;
      const isPageSection = ["categories", "instructors", "testimonials"].includes(activeId);

      sectionLinks.forEach((link) => {
        const isActive =
          link.getAttribute("href") === `#${activeId}` ||
          (isPageSection && link.textContent.trim().startsWith("PAGES") && link.closest(".dropdown")?.contains(link));

        link.classList.toggle("active", isActive);
        if (isActive) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };

    window.addEventListener("scroll", updateActiveNavigation, { passive: true });
    window.addEventListener("resize", updateActiveNavigation);
    window.addEventListener("hashchange", updateActiveNavigation);
    updateActiveNavigation();
  }

  const sidebar = document.querySelector(".sidebar");
  const menuButton = document.querySelector(".menu-button a");
  const closeButton = document.querySelector(".sidebar li:first-child a");

  if (sidebar && menuButton) {
    const setSidebarOpen = (isOpen) => {
      sidebar.style.display = isOpen ? "flex" : "none";
      sidebar.setAttribute("aria-hidden", String(!isOpen));
      menuButton.setAttribute("aria-expanded", String(isOpen));
    };

    menuButton.setAttribute("aria-controls", "mobile-navigation");
    sidebar.id = "mobile-navigation";
    setSidebarOpen(false);

    menuButton.addEventListener("click", (event) => {
      event.preventDefault();
      setSidebarOpen(true);
    });

    if (closeButton) {
      closeButton.setAttribute("aria-label", "Close menu");
      closeButton.addEventListener("click", (event) => {
        event.preventDefault();
        setSidebarOpen(false);
      });
    }

    sidebar.querySelectorAll("a").forEach((link) => {
      if (link !== closeButton) {
        link.addEventListener("click", () => setSidebarOpen(false));
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && sidebar.style.display === "flex") {
        setSidebarOpen(false);
        menuButton.focus();
      }
    });
  }

  const newsletter = document.querySelector(".newsletterForm");

  if (newsletter) {
    const email = newsletter.querySelector('input[type="email"]');
    const submitButton = newsletter.querySelector("button");

    if (email && submitButton) {
      email.required = true;
      email.setAttribute("aria-label", "Your email address");
      submitButton.type = "button";

      const status = document.createElement("p");
      status.setAttribute("role", "status");
      status.setAttribute("aria-live", "polite");
      status.hidden = true;
      newsletter.insertAdjacentElement("afterend", status);

      const submit = () => {
        if (!email.reportValidity()) {
          return;
        }

        status.textContent = "Thanks! Newsletter signup is not connected to a mailing service yet.";
        status.hidden = false;
      };

      submitButton.addEventListener("click", submit);
      email.addEventListener("input", () => {
        status.textContent = "";
        status.hidden = true;
      });
      email.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          submit();
        }
      });
    }
  }
})();
