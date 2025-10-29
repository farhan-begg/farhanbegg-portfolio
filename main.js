// main.js
import gsap from "https://cdn.skypack.dev/gsap@3.12.5";
import { CustomEase } from "https://cdn.skypack.dev/gsap/CustomEase";
import { SplitText } from "https://cdn.skypack.dev/gsap/SplitText";
import { ScrollTrigger } from "https://cdn.skypack.dev/gsap/ScrollTrigger";

console.log("✅ main.js is loaded and running!");

gsap.registerPlugin(CustomEase, SplitText, ScrollTrigger);
CustomEase.create("hop", ".8, 0, .3, 1");

document.addEventListener("DOMContentLoaded", () => {
  // --- SplitText Helper ---
  const splitTextElements = (selector, type = "words,chars", addFirstChar = false) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      const splitText = new SplitText(el, {
        type,
        wordsClass: "word",
        charsClass: "char",
      });

      if (type.includes("chars")) {
        splitText.chars.forEach((char, index) => {
          const originalText = char.textContent;
          char.innerHTML = `<span>${originalText}</span>`;
          if (addFirstChar && index === 0) char.classList.add("first-char");
        });
      }
    });
  };

  // --- SplitText Elements ---
  splitTextElements(".preloader .intro-title h1", "words,chars", true);
  splitTextElements(".preloader .outro-title h1", "words,chars");
  splitTextElements(".split-overlay .intro-title h1", "words,chars", true);
  splitTextElements(".split-overlay .outro-title h1", "words,chars");
  splitTextElements(".tag p", "words");
  splitTextElements(".card h1", "words,chars", true);

  const isMobile = window.innerWidth <= 1000;

  // --- Initial States ---
  gsap.set([".split-overlay .intro-title .first-char span", ".split-overlay .outro-title .char span"], { y: "0%" });
  gsap.set(".split-overlay .intro-title .first-char", {
    x: isMobile ? "7.5rem" : "18rem",
    y: isMobile ? "-1rem" : "-2.75rem",
    fontWeight: "900",
    scale: 0.75,
  });
  gsap.set(".split-overlay .outro-title .char", {
    x: isMobile ? "-3rem" : "-8rem",
    fontSize: isMobile ? "6rem" : "14rem",
    fontWeight: "500",
  });

  // --- Preloader Animation Timeline ---
  const tl = gsap.timeline({ defaults: { ease: "hop" } });
  const tags = gsap.utils.toArray(".tag");

  tags.forEach((tag, index) => {
    tl.to(tag.querySelectorAll("p .word"), { y: "0%", duration: 0.75 }, 0.5 + index * 0.1);
  });

  tl.to(".preloader .intro-title .char span", { y: "0%", duration: 0.75, stagger: 0.05 }, 0.5)
    .to(".preloader .intro-title .char:not(.first-char) span", { y: "100%", duration: 0.75, stagger: 0.05 }, 2)
    .to(".preloader .outro-title .char span", { y: "0%", duration: 0.75, stagger: 0.075 }, 2.5)
    .to(".preloader .intro-title .first-char", { x: isMobile ? "9rem" : "21.25rem", duration: 1 }, 3.5)
    .to(".preloader .outro-title .char", { x: isMobile ? "-3rem" : "-8rem", duration: 1 }, 3.5)
    .to(".preloader .intro-title .first-char", {
      x: isMobile ? "7.5rem" : "18rem",
      y: isMobile ? "-1rem" : "-2.75rem",
      fontWeight: "900",
      scale: 0.75,
      duration: 0.75,
    }, 4.5)
    .to(".preloader .outro-title .char", {
      x: isMobile ? "-3rem" : "-8rem",
      fontSize: isMobile ? "6rem" : "14rem",
      fontWeight: "500",
      duration: 0.75,
      onComplete: () => {
        gsap.set(".preloader", { clipPath: "polygon(0,0, 100% 0, 100% 50%, 0 50%)" });
        gsap.set(".split-overlay", { clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)" });
      },
    }, 4.5)
    .to(".container", { clipPath: "polygon(0% 48%, 100% 48%, 100% 52%, 0% 52%)", duration: 1 }, 5);

  tags.forEach((tag, index) => {
    tl.to(tag.querySelectorAll("p.word"), { y: "100%", duration: 0.75 }, 5.5 + index * 0.1);
  });

  tl.to([".preloader", ".split-overlay"], { y: (i) => (i === 0 ? "-50%" : "50%"), duration: 1 }, 6)
    .to(".container", { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 1 }, 6)
    .to(".container .card", { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 0.75 }, 6.25)
    .to(".container .card h1 .char span", { y: "0%", duration: 0.75, stagger: 0.05 }, 6.5);

  // --- Robot + Hero + Panels ---
  gsap.to("#robot", {
    y: "+=20",
    repeat: -1,
    yoyo: true,
    duration: 3,
    ease: "sine.inOut",
  });

  gsap.utils.toArray(".tech-icons img").forEach((icon, i) => {
    gsap.to(icon, { y: "+=10", repeat: -1, yoyo: true, duration: 2 + i * 0.2, ease: "sine.inOut" });
  });

  // Hero border draw
  const borderTL = gsap.timeline({ delay: 0.4 });
  borderTL.to(".hero-border .top", { width: "100%", duration: 0.6, ease: "power2.out" })
    .to(".hero-border .right", { height: "100%", duration: 0.6, ease: "power2.out" }, "<0.1")
    .to(".hero-border .bottom", { width: "100%", duration: 0.6, ease: "power2.out" }, "<0.1")
    .to(".hero-border .left", { height: "100%", duration: 0.6, ease: "power2.out" }, "<0.1");

  // Parallax BG
  gsap.to(".hero-bg-layer", {
    scale: 1.2,
    y: "-10vh",
    opacity: 0,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  // Floating cards
  gsap.utils.toArray(".glass-card").forEach((card, i) => {
    gsap.from(card, {
      opacity: 0,
      y: 60,
      scale: 0.95,
      duration: 1,
      delay: i * 0.2,
      ease: "power3.out",
    });
    gsap.to(card, {
      yPercent: -10 - i * 5,
      opacity: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  // Panels + Robot transitions
  const panels = gsap.utils.toArray(".panel");
  const progress = document.querySelector(".progress-bar-fill");

  const scrollTween = gsap.to(panels, {
    xPercent: -100 * (panels.length - 1),
    ease: "none",
    scrollTrigger: {
      trigger: ".experience",
      pin: true,
      scrub: 1.2,
      end: () => "+=" + window.innerWidth * (panels.length - 1),
      onUpdate: (self) => (progress.style.width = self.progress * 100 + "%"),
    },
  });

  panels.forEach((p) => {
    const n = p.querySelector(".company-name"),
      l = p.querySelector(".line"),
      d = p.querySelector(".company-description"),
      i = p.querySelector(".screenshot");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: p,
        containerAnimation: scrollTween,
        start: "left center",
        end: "right center",
        scrub: true,
      },
    });

    tl.to(n, { opacity: 1, y: 0, duration: 1 })
      .to(l, { width: "100%", duration: 0.8 }, "<0.2")
      .to(d, { opacity: 1, y: 0, duration: 1 }, "<0.2")
      .to(i, { opacity: 1, scale: 1.05, duration: 1.2 }, "<0.3");
  });
});
