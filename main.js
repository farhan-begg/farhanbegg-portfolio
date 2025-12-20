// main.js (UPDATED: smoother GRND entry + cleaner refresh flow)

import gsap from "https://cdn.skypack.dev/gsap@3.12.5";
import { ScrollTrigger } from "https://cdn.skypack.dev/gsap/ScrollTrigger";
import { CustomEase } from "https://cdn.skypack.dev/gsap/CustomEase";
import { SplitText } from "https://cdn.skypack.dev/gsap/SplitText";
import { ScrollSmoother } from "https://cdn.skypack.dev/gsap/ScrollSmoother";

console.log("✅ main.js is loaded and running!");

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText, ScrollSmoother);
  CustomEase.create("hop", ".8, 0, .3, 1");

  const isMobile = window.innerWidth <= 1000;

  // ✅ Create ScrollSmoother ONCE
  const smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1.25,
    effects: true,
    normalizeScroll: true,
    ignoreMobileResize: true,
  });

  // ================= HERO SECTION =================
  const heroTL = gsap.timeline({
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 0.9,
      fastScrollEnd: true,
      preventOverlaps: true,
    },
  });

  heroTL
    .to("#heroText", { yPercent: -100, ease: "none" }, 0)
    .to(".hero-bg-layer", { scale: 1.2, y: "-10vh", autoAlpha: 0, ease: "none" }, 0)
    .to(".hero-side-text span:nth-child(1)", { yPercent: -30, ease: "none" }, 0)
    .to(".hero-side-text span:nth-child(2)", { yPercent: -40, ease: "none" }, 0)
    .to(".hero-side-text span:nth-child(3)", { yPercent: -50, ease: "none" }, 0);

  // Border draw (load-only)
  gsap.timeline({ delay: 0.25 })
    .to(".hero-border .top", { width: "100%", duration: 0.6, ease: "power2.out" })
    .to(".hero-border .right", { height: "100%", duration: 0.6, ease: "power2.out" }, "<0.08")
    .to(".hero-border .bottom", { width: "100%", duration: 0.6, ease: "power2.out" }, "<0.08")
    .to(".hero-border .left", { height: "100%", duration: 0.6, ease: "power2.out" }, "<0.08");

  // ================= EXPERIENCE SECTION =================
  gsap.to("#robot", {
    scale: 0.35,
    x: "45vw",
    y: "30vh",
    ease: "none",
    scrollTrigger: {
      trigger: ".experience",
      start: "top bottom",
      end: "top top",
      scrub: 0.9,
      fastScrollEnd: true,
      anticipatePin: 1,
    },
  });

  const panels = gsap.utils.toArray(".panel");
  const progress = document.querySelector(".progress-bar-fill");

  if (panels.length) {
    const scrollTween = gsap.to(panels, {
      xPercent: -100 * (panels.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: ".experience",
        pin: true,
        scrub: 1.1,
        anticipatePin: 1,
        // ✅ helps reduce the "twitch" at the start of pinning
        pinSpacing: true,
        end: () => "+=" + window.innerWidth * (panels.length - 1),
        onUpdate: (self) => {
          if (progress) progress.style.width = self.progress * 100 + "%";
        },
      },
    });

    panels.forEach((p) => {
      const n = p.querySelector(".company-name");
      const l = p.querySelector(".line");
      const d = p.querySelector(".company-description");
      const img = p.querySelector(".screenshot");
      if (!n || !l || !d || !img) return;

      gsap.timeline({
        scrollTrigger: {
          trigger: p,
          containerAnimation: scrollTween,
          start: "left center",
          end: "right center",
          scrub: 0.9,
          fastScrollEnd: true,
        },
      })
        .to(n, { opacity: 1, y: 0, duration: 0.8 })
        .to(l, { width: "100%", duration: 0.7 }, "<0.2")
        .to(d, { opacity: 1, y: 0, duration: 0.8 }, "<0.15")
        .to(img, { opacity: 1, scale: 1.05, duration: 0.9 }, "<0.2");
    });
  }

  // ================= GRND: CINEMATIC ENTER + HORIZONTAL PROJECTS =================
  (function initGRNDProjectsShowcase() {
    const section = document.querySelector("#grnd-hscroll-projects");
    if (!section) return;

    const bg = section.querySelector(".grnd-hscroll-projects__bg");
    const overlay = section.querySelector(".grnd-hscroll-projects__bgOverlay");
    const header = section.querySelector(".grnd-hscroll-projects__header");
    const rail = section.querySelector(".grnd-hscroll-projects__rail");
    const cards = gsap.utils.toArray("#grnd-hscroll-projects .grnd-hscroll-projects__card");

    if (!rail || !cards.length) return;

    // --- Entry reveal (before pin)
    gsap.set([header, ...cards], { willChange: "transform,opacity" });
    if (header) gsap.set(header, { autoAlpha: 0, y: 24 });
    gsap.set(cards, { autoAlpha: 0, y: 24, scale: 0.98 });
    if (bg) gsap.set(bg, { autoAlpha: 0, scale: 1.06 });
    if (overlay) gsap.set(overlay, { autoAlpha: 0 });

    gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "top 40%",
        scrub: 0.9,
        fastScrollEnd: true,
      },
    })
      .to(bg, { autoAlpha: 1, scale: 1, ease: "none" }, 0)
      .to(overlay, { autoAlpha: 1, ease: "none" }, 0)
      .to(header, { autoAlpha: 1, y: 0, ease: "none" }, 0.05)
      .to(cards, { autoAlpha: 1, y: 0, scale: 1, stagger: 0.08, ease: "none" }, 0.1);

    // --- Horizontal pin scroll
    const getDistance = () => Math.max(0, rail.scrollWidth - window.innerWidth);

    // pre-set for smoother transforms
    gsap.set(rail, { willChange: "transform", transform: "translate3d(0,0,0)" });
    gsap.set(cards, { autoAlpha: 0.8, scale: 0.985 });

    const railTween = gsap.to(rail, {
      x: () => -getDistance(),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => "+=" + getDistance(),
        pin: true,
        scrub: 1.35, // ✅ smoother feel than 1
        anticipatePin: 1.2,
        invalidateOnRefresh: true,
        fastScrollEnd: true,
        // ✅ helps in ScrollSmoother layouts
        pinType: document.querySelector("#smooth-wrapper") ? "transform" : "fixed",
        snap: {
          snapTo: (value) => {
            const snaps = cards.length - 1;
            return snaps > 0 ? Math.round(value * snaps) / snaps : value;
          },
          duration: 0.45,
          ease: "power2.out",
        },
      },
    });

    // --- Center-focus effect (premium, not “blended”)
    cards.forEach((card) => {
      gsap.to(card, {
        autoAlpha: 1,
        scale: 1.02,
        scrollTrigger: {
          trigger: card,
          containerAnimation: railTween,
          start: "left 60%",
          end: "right 40%",
          scrub: true,
        },
      });

      gsap.to(card, {
        autoAlpha: 0.75,
        scale: 0.985,
        scrollTrigger: {
          trigger: card,
          containerAnimation: railTween,
          start: "left 95%",
          end: "left 60%",
          scrub: true,
        },
      });

      gsap.to(card, {
        autoAlpha: 0.75,
        scale: 0.985,
        scrollTrigger: {
          trigger: card,
          containerAnimation: railTween,
          start: "right 40%",
          end: "right 5%",
          scrub: true,
        },
      });
    });
  })();

  // ================= BACKGROUND + TEXT COLOR TRANSITION =================
  gsap.timeline({
    scrollTrigger: {
      trigger: ".flow--lg",
      start: "top bottom",
      scrub: 0.9,
      fastScrollEnd: true,
    },
  })
    .to("body", { backgroundColor: "#0d0d0d", color: "#ffffff", duration: 1, ease: "none" })
    .to("body", { backgroundColor: "#3e2a1a", color: "#ffffff", duration: 1, ease: "none" })
    .to("body", { backgroundColor: "#f5e8d5", color: "#111111", duration: 1, ease: "none" })
    .to("body", { backgroundColor: "#121212", color: "#b7ff72", duration: 1, ease: "none" });

  // ================= SplitText stagger =================
  if (document.querySelector("#split-stagger")) {
    gsap.set(".heading", { yPercent: -150, opacity: 1 });

    const mySplitText = new SplitText("#split-stagger", { type: "words,chars" });
    const chars = mySplitText.chars || [];

    chars.forEach((char, i) => {
      if (smoother?.effects) smoother.effects(char, { speed: 1, lag: (i + 1) * 0.1 });
    });
  }

  // ✅ refresh after layout settles (helps reduce pin jumps)
  requestAnimationFrame(() => ScrollTrigger.refresh());
  setTimeout(() => ScrollTrigger.refresh(), 250);
});
