// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile navigation toggle
(function initNav() {
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("mobileNav");
  if (!toggle || !menu) return;

  function closeMenu() {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }

  toggle.addEventListener("click", function () {
    const isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  // Close after tapping a link
  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });
})();

// Our Work carousel
(function initCarousel() {
  const carousel = document.getElementById("carousel");
  const track = document.getElementById("carouselTrack");
  const prevBtn = document.getElementById("carouselPrev");
  const nextBtn = document.getElementById("carouselNext");
  const dotsWrap = document.getElementById("carouselDots");
  if (!carousel || !track) return;

  const slides = Array.from(track.children);
  const total = slides.length;
  let index = 0;
  let autoplayId = null;
  const AUTOPLAY_MS = 5000;

  // Build dots
  slides.forEach(function (_, i) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", "Go to project " + (i + 1));
    dot.addEventListener("click", function () {
      goTo(i);
      restartAutoplay();
    });
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function update() {
    track.style.transform = "translateX(-" + index * 100 + "%)";
    dots.forEach(function (dot, i) {
      dot.classList.toggle("active", i === index);
      dot.setAttribute("aria-selected", String(i === index));
    });
  }

  function goTo(i) {
    index = (i + total) % total;
    update();
  }

  function next() {
    goTo(index + 1);
  }

  function prev() {
    goTo(index - 1);
  }

  nextBtn.addEventListener("click", function () {
    next();
    restartAutoplay();
  });
  prevBtn.addEventListener("click", function () {
    prev();
    restartAutoplay();
  });

  // Keyboard support
  carousel.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") {
      next();
      restartAutoplay();
    } else if (e.key === "ArrowLeft") {
      prev();
      restartAutoplay();
    }
  });

  // Touch / swipe support
  let startX = 0;
  let deltaX = 0;
  let dragging = false;
  const viewport = carousel.querySelector(".carousel-viewport");

  viewport.addEventListener(
    "touchstart",
    function (e) {
      startX = e.touches[0].clientX;
      deltaX = 0;
      dragging = true;
      stopAutoplay();
    },
    { passive: true }
  );
  viewport.addEventListener(
    "touchmove",
    function (e) {
      if (!dragging) return;
      deltaX = e.touches[0].clientX - startX;
    },
    { passive: true }
  );
  viewport.addEventListener("touchend", function () {
    if (!dragging) return;
    dragging = false;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) next();
      else prev();
    }
    restartAutoplay();
  });

  // Autoplay (pauses on hover)
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function startAutoplay() {
    if (prefersReducedMotion) return;
    stopAutoplay();
    autoplayId = window.setInterval(next, AUTOPLAY_MS);
  }
  function stopAutoplay() {
    if (autoplayId) {
      window.clearInterval(autoplayId);
      autoplayId = null;
    }
  }
  function restartAutoplay() {
    startAutoplay();
  }

  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);

  update();
  startAutoplay();
})();
