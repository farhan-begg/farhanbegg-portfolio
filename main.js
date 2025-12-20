import gsap from "https://cdn.skypack.dev/gsap@3.12.5";
import { ScrollTrigger } from "https://cdn.skypack.dev/gsap/ScrollTrigger";
import { CustomEase } from "https://cdn.skypack.dev/gsap/CustomEase";
import { SplitText } from "https://cdn.skypack.dev/gsap/SplitText";
import { ScrollSmoother } from "https://cdn.skypack.dev/gsap/ScrollSmoother";

console.log("✅ script.js is loaded and running!");

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText, ScrollSmoother);
  CustomEase.create("hop", ".8, 0, .3, 1");

  const isMobile = window.innerWidth <= 1000;

  // ✅ Create ScrollSmoother ONCE (you had it twice / too late before)
  const smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1.25,
    effects: true,
    normalizeScroll: true,
    ignoreMobileResize: true,
  });

  // ================= HERO SECTION =================
  // ✅ Use one timeline to avoid fighting triggers/jank
  const heroTL = gsap.timeline({
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 0.9,
      fastScrollEnd: true,
      preventOverlaps: true,
      // markers: true,
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

  // ================= REMOVE GLASS CARDS =================
  // ✅ You said remove them for now — so this is gone.

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

  // Horizontal scroll for panels
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

  // ================= NEW: GRND HORIZONTAL PROJECTS =================
  // Requires:
  //  - section id="grnd-hscroll-projects"
  //  - div class="grnd-hscroll-projects__rail"
  //  - cards class="grnd-hscroll-projects__card"
  const projSection = document.querySelector("#grnd-hscroll-projects");
  const projRail = projSection?.querySelector(".grnd-hscroll-projects__rail");
  const projCards = projSection
    ? gsap.utils.toArray("#grnd-hscroll-projects .grnd-hscroll-projects__card")
    : [];

  if (projSection && projRail && projCards.length) {
    const getDistance = () => Math.max(0, projRail.scrollWidth - window.innerWidth);

    gsap.set(projCards, { opacity: 0.85, scale: 0.98 });

    const railTween = gsap.to(projRail, {
      x: () => -getDistance(),
      ease: "none",
      scrollTrigger: {
        trigger: projSection,
        start: "top top",
        end: () => "+=" + getDistance(),
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        fastScrollEnd: true,
        snap: {
          snapTo: (value) => {
            const snaps = projCards.length - 1;
            return snaps > 0 ? Math.round(value * snaps) / snaps : value;
          },
          duration: 0.35,
          ease: "power2.out",
        },
      },
    });

    projCards.forEach((card) => {
      gsap.to(card, {
        opacity: 1,
        scale: 1,
        scrollTrigger: {
          trigger: card,
          containerAnimation: railTween,
          start: "left center",
          end: "right center",
          scrub: true,
        },
      });
    });
  }

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

  // ✅ Important with ScrollSmoother
  ScrollTrigger.refresh();
});
