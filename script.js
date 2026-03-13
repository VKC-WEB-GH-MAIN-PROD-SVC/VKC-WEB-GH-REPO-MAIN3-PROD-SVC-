(() => {
  // Year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // =========================
  // Smooth scroll helpers
  // =========================
  function scrollToTarget(selector) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // =========================
  // Scroll spy (nav underline)
  // =========================
  const sections = Array.from(document.querySelectorAll("section[id]"));
  const navLinks = Array.from(document.querySelectorAll(".nav__links a"));

  function updateActiveNav() {
    let current = "";
    const mid = window.innerHeight * 0.35;

    for (const sec of sections) {
      const r = sec.getBoundingClientRect();
      if (r.top <= mid && r.bottom >= mid) {
        current = sec.id;
        break;
      }
    }

    navLinks.forEach(a => {
      a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
    });
  }
  window.addEventListener("scroll", updateActiveNav, { passive: true });
  window.addEventListener("load", updateActiveNav);

  // =========================
  // Reveal on scroll (IO)
  // =========================
  const revealEls = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    entries => {
      for (const e of entries) {
        if (e.isIntersecting) e.target.classList.add("visible");
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
  );
  revealEls.forEach(el => io.observe(el));

  // =========================
  // Top progress line
  // =========================
  const progressBar = document.createElement("div");
  Object.assign(progressBar.style, {
    position: "fixed",
    top: "4px",
    left: "0",
    height: "3px",
    width: "0%",
    background: "linear-gradient(90deg,#0f6f4a,#19c37d)",
    zIndex: "1001",
    transition: "width 0.12s linear"
  });
  document.body.appendChild(progressBar);

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("load", updateProgress);

  // =========================
  // Spotlight cursor for framed panels
  // =========================
  function attachSpotlight(el) {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width) * 100;
      const my = ((e.clientY - r.top) / r.height) * 100;
      el.style.setProperty("--mx", `${mx}%`);
      el.style.setProperty("--my", `${my}%`);
    }, { passive: true });
  }
  document.querySelectorAll("[data-spotlight]").forEach(attachSpotlight);

  // =========================
  // Magnetic buttons (subtle)
  // =========================
  document.querySelectorAll(".magnetic").forEach(btn => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.10}px, ${y * 0.10}px) translateZ(0)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0,0) translateZ(0)";
    });
  });

  // =========================
  // Mobile menu
  // =========================
  const burger = document.querySelector(".nav__burger");
  const mobile = document.getElementById("mobileMenu");
  if (burger && mobile) {
    const toggle = () => {
      const isOpen = !mobile.hasAttribute("hidden");
      if (isOpen) {
        mobile.setAttribute("hidden", "");
        burger.setAttribute("aria-expanded", "false");
      } else {
        mobile.removeAttribute("hidden");
        burger.setAttribute("aria-expanded", "true");
      }
    };

    burger.addEventListener("click", toggle);

    mobile.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        mobile.setAttribute("hidden", "");
        burger.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !mobile.hasAttribute("hidden")) {
        mobile.setAttribute("hidden", "");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  // =========================
  // Modal (engagement intake)
  // =========================
  const modal = document.getElementById("modal-engage");
  const panel = modal?.querySelector(".modal__panel");
  let lastFocus = null;

  function openModal() {
    if (!modal || !panel) return;
    lastFocus = document.activeElement;
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    panel.focus();

    // focus trap
    document.addEventListener("keydown", trapTab);
  }

  function closeModal() {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", trapTab);
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  function trapTab(e) {
    if (e.key !== "Tab" || !modal || modal.getAttribute("aria-hidden") === "true") return;
    const focusable = modal.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])');
    const list = Array.from(focusable).filter(el => !el.hasAttribute("disabled"));
    if (!list.length) return;

    const first = list[0];
    const last = list[list.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  document.querySelectorAll('[data-open-modal="engage"]').forEach(btn => {
    btn.addEventListener("click", openModal);
  });
  document.querySelectorAll("[data-close-modal]").forEach(btn => {
    btn.addEventListener("click", closeModal);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal?.getAttribute("aria-hidden") === "false") closeModal();
  });

  // =========================
  // Form => mailto generator
  // =========================
  const form = document.getElementById("engageForm");
  const out = document.getElementById("formOut");
  const mailtoLink = document.getElementById("mailtoLink");

  function encode(s) {
    return encodeURIComponent(String(s || "").trim());
  }

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);

    const name = data.get("name");
    const email = data.get("email");
    const org = data.get("org");
    const size = data.get("size");
    const brief = data.get("brief");
    const driver = data.get("driver");
    const timeframe = data.get("timeframe");

    const subject = `Architecture Advisory — Scoping Call (${org || "Organisation"})`;

    const body =
`Hello Archonex,

I’d like to request a scoping call for architecture advisory.

Name: ${name}
Email: ${email}
Organisation: ${org}
Estate size: ${size}
Primary driver: ${driver}
Timeframe: ${timeframe}

Brief:
${brief}

Thanks,
${name}`;

    const href = `mailto:hello@Archonex.com?subject=${encode(subject)}&body=${encode(body)}`;

    if (mailtoLink) mailtoLink.href = href;
    if (out) out.hidden = false;

    // Attempt to open mail client
    window.location.href = href;
  });

  // =========================
  // Hero buttons with data-scroll
  // =========================
  document.querySelectorAll("[data-scroll]").forEach(btn => {
    btn.addEventListener("click", () => scrollToTarget(btn.dataset.scroll));
  });

  // =========================
  // Subtle orb parallax (performance-safe)
  // =========================
  const orbA = document.querySelector(".orb-a");
  const orbB = document.querySelector(".orb-b");
  let mx = 0, my = 0;

  window.addEventListener("mousemove", (e) => {
    mx = (e.clientX / window.innerWidth) - 0.5;
    my = (e.clientY / window.innerHeight) - 0.5;
  }, { passive: true });

  function parallax() {
    const s = Math.min((window.scrollY || 0) / 900, 1);
    if (orbA) orbA.style.transform = `translate3d(${mx * 24}px, ${my * 18 + s * 8}px, 0)`;
    if (orbB) orbB.style.transform = `translate3d(${mx * -20}px, ${my * -14 + s * -6}px, 0)`;
    requestAnimationFrame(parallax);
  }
  requestAnimationFrame(parallax);
  const archonexAudioBtn = document.querySelector('.spec-audio');
const archonexAudio = document.getElementById('archonexAudio');

if (archonexAudioBtn && archonexAudio) {
  archonexAudioBtn.addEventListener('click', () => {
    archonexAudio.currentTime = 0;
    archonexAudio.play();
  });
}
})();