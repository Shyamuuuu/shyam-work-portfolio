const nav = document.querySelector(".nav");
const revealElements = document.querySelectorAll(".reveal");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function onScroll() {
  nav.classList.toggle("nav--scrolled", window.scrollY > 8);
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

if (prefersReducedMotion) {
  revealElements.forEach((el) => el.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* Dark mode toggle */
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const THEME_KEY = "shyam-portfolio-theme";

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  if (themeToggle) themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
}

const storedTheme = localStorage.getItem(THEME_KEY);
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(storedTheme || (systemPrefersDark ? "dark" : "light"));

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);

    if (!prefersReducedMotion) {
      themeToggle.classList.remove("is-spinning");
      // eslint-disable-next-line no-unused-expressions
      themeToggle.offsetWidth; // force reflow so the animation can replay
      themeToggle.classList.add("is-spinning");
    }
  });
}

/* Button ripple — every click leaves a little "test passed" pulse */
function spawnRipple(event) {
  if (prefersReducedMotion) return;

  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 1.6;
  const ripple = document.createElement("span");
  ripple.className = "ripple";
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;

  const originX = (event.clientX ?? rect.left + rect.width / 2) - rect.left - size / 2;
  const originY = (event.clientY ?? rect.top + rect.height / 2) - rect.top - size / 2;
  ripple.style.left = `${originX}px`;
  ripple.style.top = `${originY}px`;

  target.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove());
}

document
  .querySelectorAll(".btn, .nav__cta, .nav__icon-link, .theme-toggle, .contact-card")
  .forEach((el) => el.addEventListener("click", spawnRipple));