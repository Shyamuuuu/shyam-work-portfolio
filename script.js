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