// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Smooth scroll (controlled)
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// Scroll spy (underline only; CSS handles underline)
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav__links a");

function updateActiveNav() {
  let current = "";
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    const mid = window.innerHeight * 0.35;
    if (rect.top <= mid && rect.bottom >= mid) current = section.id;
  });

  navLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
}

window.addEventListener("scroll", updateActiveNav, { passive: true });
window.addEventListener("load", updateActiveNav);

// Reveal on scroll (Cards = fade + slide)
const reveals = document.querySelectorAll(".reveal");
function revealOnScroll() {
  reveals.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.86) el.classList.add("visible");
  });
}
window.addEventListener("scroll", revealOnScroll, { passive: true });
window.addEventListener("load", revealOnScroll);

// Top progress line (gradient)
const progressBar = document.createElement("div");
progressBar.style.position = "fixed";
progressBar.style.top = "0";
progressBar.style.left = "0";
progressBar.style.height = "3px";
progressBar.style.width = "0%";
progressBar.style.background = "linear-gradient(90deg,#7c5cff,#22d3ee)";
progressBar.style.zIndex = "2000";
progressBar.style.transition = "width 0.12s linear";
document.body.appendChild(progressBar);

function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}
window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("load", updateProgress);

// Magnetic buttons (subtle boutique)
document.querySelectorAll(".magnetic").forEach(btn => {
  btn.addEventListener("mousemove", (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px) translateZ(0)`;
  });

  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "translate(0,0) translateZ(0)";
  });
});

// Card/Case spotlight follows cursor (premium, not loud)
function attachSpotlight(el) {
  el.addEventListener("mousemove", (e) => {
    const r = el.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width) * 100;
    const my = ((e.clientY - r.top) / r.height) * 100;
    el.style.setProperty("--mx", `${mx}%`);
    el.style.setProperty("--my", `${my}%`);
  });
}
document.querySelectorAll("[data-spotlight]").forEach(attachSpotlight);

// Hero parallax orbs (mouse + scroll) — controlled
const orbs = {
  a: document.querySelector(".orb--a"),
  b: document.querySelector(".orb--b"),
  c: document.querySelector(".orb--c"),
};

let mouseX = 0, mouseY = 0;
window.addEventListener("mousemove", (e) => {
  mouseX = (e.clientX / window.innerWidth) - 0.5;   // -0.5..0.5
  mouseY = (e.clientY / window.innerHeight) - 0.5;  // -0.5..0.5
}, { passive: true });

function parallaxTick() {
  const scroll = window.scrollY || 0;
  const s = Math.min(scroll / 900, 1);

  if (orbs.a) orbs.a.style.transform = `translate3d(${mouseX * 28}px, ${mouseY * 18 + s * 10}px, 0)`;
  if (orbs.b) orbs.b.style.transform = `translate3d(${mouseX * -22}px, ${mouseY * -16 + s * -8}px, 0)`;
  if (orbs.c) orbs.c.style.transform = `translate3d(${mouseX * -16}px, ${mouseY * 14 + s * 6}px, 0)`;

  requestAnimationFrame(parallaxTick);
}
requestAnimationFrame(parallaxTick);
