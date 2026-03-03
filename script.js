(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Year
  const yearEls = document.querySelectorAll("#year");
  yearEls.forEach(el => (el.textContent = String(new Date().getFullYear())));

  // Scroll progress
  const progressBar = document.getElementById("progressBar");
  const onScrollProgress = () => {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = (doc.scrollHeight || document.body.scrollHeight) - doc.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = `${pct}%`;
  };
  window.addEventListener("scroll", onScrollProgress, { passive: true });
  onScrollProgress();

  // Reveal animations
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  if (revealEls.length) {
    if (prefersReducedMotion) {
      revealEls.forEach(el => el.classList.add("visible"));
    } else {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.14, rootMargin: "0px 0px -10% 0px" });
      revealEls.forEach(el => io.observe(el));
    }
  }

  // Spotlight hover
  document.querySelectorAll("[data-spotlight]").forEach(el => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width) * 100;
      const my = ((e.clientY - r.top) / r.height) * 100;
      el.style.setProperty("--mx", `${mx}%`);
      el.style.setProperty("--my", `${my}%`);
    }, { passive: true });
  });

  // Magnetic buttons
  if (!prefersReducedMotion) {
    document.querySelectorAll(".magnetic").forEach(btn => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.10}px, ${y * 0.10}px) translateZ(0)`;
      }, { passive: true });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate(0,0) translateZ(0)";
      }, { passive: true });
    });
  }

  // Scroll spy for nav
  const navLinks = Array.from(document.querySelectorAll(".nav__links a[href^='#']"));
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const setActive = (id) => {
    navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${id}`));
  };

  if (navLinks.length && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      const best = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (best?.target?.id) setActive(best.target.id);
    }, { threshold: [0.25, 0.35, 0.5, 0.65], rootMargin: "-20% 0px -55% 0px" });
    sections.forEach(s => spy.observe(s));
  }

  // Mobile menu
  const burgerBtn = document.getElementById("burgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileBackdrop = document.getElementById("mobileBackdrop");
  const closeMobileBtn = document.getElementById("closeMobileBtn");
  const mobilePanel = mobileMenu?.querySelector(".mobile__panel");
  let lastFocus = null;

  const openMobile = () => {
    if (!mobileMenu || !burgerBtn || !mobilePanel) return;
    lastFocus = document.activeElement;
    mobileMenu.hidden = false;
    burgerBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    (mobileMenu.querySelector(".mobile__links a") || closeMobileBtn || mobilePanel).focus();
  };

  const closeMobile = () => {
    if (!mobileMenu || !burgerBtn) return;
    mobileMenu.hidden = true;
    burgerBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  };

  burgerBtn?.addEventListener("click", () => {
    const expanded = burgerBtn.getAttribute("aria-expanded") === "true";
    expanded ? closeMobile() : openMobile();
  });
  mobileBackdrop?.addEventListener("click", closeMobile);
  closeMobileBtn?.addEventListener("click", closeMobile);
  mobileMenu?.querySelectorAll("a[href^='#']").forEach(a => a.addEventListener("click", closeMobile));

  // Modal (engage)
  const modal = document.getElementById("engageModal");
  const openModalBtns = Array.from(document.querySelectorAll("[data-open-modal='engage']"));
  const closeModalBtns = Array.from(document.querySelectorAll("[data-close-modal]"));
  const template = document.getElementById("scopingTemplate");
  const copyBtn = document.getElementById("copyTemplateBtn");
  const emailLink = document.getElementById("emailLink");
  const toast = document.getElementById("toast");
  const modalPanel = modal?.querySelector(".modal__panel");

  const makeMailto = () => {
    // Change this anytime (or leave placeholder)
    const to = "hello@archinexus.com";
    const subject = encodeURIComponent("Archinexus Advisory Request");
    const body = encodeURIComponent((template?.textContent || "").trim());
    return `mailto:${to}?subject=${subject}&body=${body}`;
  };

  const openModal = () => {
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    if (emailLink) emailLink.href = makeMailto();
    setTimeout(() => modalPanel?.focus?.(), 0);
  };

  const closeModal = () => {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
    if (toast) toast.textContent = "";
  };

  openModalBtns.forEach(b => b.addEventListener("click", openModal));
  closeModalBtns.forEach(b => b.addEventListener("click", closeModal));

  copyBtn?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText((template?.textContent || "").trim());
      if (toast) toast.textContent = "Copied.";
      setTimeout(() => { if (toast) toast.textContent = ""; }, 1200);
    } catch {
      if (toast) toast.textContent = "Copy blocked by browser policy.";
      setTimeout(() => { if (toast) toast.textContent = ""; }, 1500);
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (mobileMenu && !mobileMenu.hidden) closeMobile();
    if (modal && !modal.hidden) closeModal();
  });

  // STANDARD PREMIUM LOGO LOOP
  const svg = document.querySelector(".brand__svg");
  const tl = document.getElementById("logoTL");
  const br = document.getElementById("logoBR");

  const getLen = (p) => p.getTotalLength();

  const resetPath = (p) => {
    p.style.transition = "none";
    const len = getLen(p);
    p.style.strokeDasharray = String(len);
    p.style.strokeDashoffset = String(len);
    // force reflow
    p.getBoundingClientRect();
  };

  const drawPath = (p, ms) => {
    p.style.transition = `stroke-dashoffset ${ms}ms cubic-bezier(.22,1,.36,1)`;
    p.style.strokeDashoffset = "0";
  };

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const runLogoLoop = async () => {
    if (!svg || !tl || !br) return;
    if (prefersReducedMotion) return;

    const drawMs = 1350;
    const gapMs = 220;
    const pulseMs = 520;
    const holdMs = 3200;
    const resetGapMs = 240;

    while (true) {
      if (document.hidden) { await sleep(500); continue; }

      resetPath(tl);
      resetPath(br);
      svg.classList.remove("logo-pulse");

      await sleep(80);
      drawPath(tl, drawMs);
      await sleep(drawMs + gapMs);
      drawPath(br, drawMs);

      await sleep(drawMs + 80);
      svg.classList.add("logo-pulse");
      await sleep(pulseMs);
      svg.classList.remove("logo-pulse");

      await sleep(holdMs);

      resetPath(tl);
      resetPath(br);
      await sleep(resetGapMs);
    }
  };

  window.addEventListener("load", () => {
    if (!prefersReducedMotion) setTimeout(() => { runLogoLoop(); }, 420);
  });
})();
