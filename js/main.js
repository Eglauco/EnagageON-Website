/* ============================================================
   ENGAGEON — Interações & Animações
   GSAP + ScrollTrigger + SplitText + Lenis
   ============================================================ */
(function () {
  "use strict";

  document.documentElement.classList.add("js");
  document.body.classList.add("js");

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  gsap.registerPlugin(ScrollTrigger, SplitText);

  /* ------------------------------------------------------------
     Smooth scroll (Lenis)
  ------------------------------------------------------------ */
  let lenis = null;
  if (!prefersReduced) {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  function scrollToTarget(target) {
    if (lenis) {
      lenis.scrollTo(target, { offset: -70, duration: 1.4 });
    } else {
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }

  document.querySelectorAll("[data-scrollto]").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        scrollToTarget(href);
      }
    });
  });

  /* ------------------------------------------------------------
     Preloader
  ------------------------------------------------------------ */
  const preloader = document.getElementById("preloader");
  const preloaderCount = document.getElementById("preloaderCount");
  const preloaderPath = document.getElementById("preloaderPath");

  function initHeroIntro() {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    const lines = document.querySelectorAll(".hero__line");
    lines.forEach((line) => {
      const gradChild = line.querySelector(".grad-text");
      if (gradChild) {
        // linha com gradiente: anima como bloco (SplitText quebraria o background-clip)
        gsap.set(gradChild, { yPercent: 115 });
        line._chars = [gradChild];
      } else {
        const split = new SplitText(line, { type: "chars" });
        gsap.set(split.chars, { yPercent: 115 });
        line._chars = split.chars;
      }
    });

    tl.to(".nav", { y: 0, opacity: 1, duration: 0.8 }, 0)
      .to(".hero__eyebrow", { opacity: 1, y: 0, duration: 0.7 }, 0.1);

    lines.forEach((line, i) => {
      tl.to(line._chars, {
        yPercent: 0,
        duration: 1.05,
        stagger: 0.022,
        ease: "power4.out",
      }, 0.15 + i * 0.12);
    });

    tl.to(".hero__sub", { opacity: 1, y: 0, duration: 0.8 }, 0.75)
      .to(".hero__canvas", { opacity: 1, duration: 1.2 }, 0.9)
      .to(".hero__scrollcue", { opacity: 1, duration: 0.8 }, 1.1);
  }

  function setupHeroIntroStates() {
    gsap.set(".nav", { y: -20, opacity: 0 });
    gsap.set(".hero__eyebrow", { opacity: 0, y: 16 });
    gsap.set(".hero__sub", { opacity: 0, y: 24 });
    gsap.set(".hero__canvas", { opacity: 0 });
    gsap.set(".hero__scrollcue", { opacity: 0 });
  }

  if (prefersReduced) {
    preloader.style.display = "none";
  } else {
    setupHeroIntroStates();
    if (lenis) lenis.stop();

    // draw the pulse line
    const pathLen = preloaderPath.getTotalLength();
    gsap.set(preloaderPath, { strokeDasharray: pathLen, strokeDashoffset: pathLen });

    const counter = { value: 0 };
    const loadTl = gsap.timeline({
      onComplete: () => {
        gsap.to(preloader, {
          yPercent: -100,
          duration: 0.9,
          ease: "power4.inOut",
          onComplete: () => {
            preloader.style.display = "none";
            if (lenis) lenis.start();
          },
        });
        initHeroIntro();
      },
    });

    loadTl
      .to(preloaderPath, { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" }, 0)
      .to(counter, {
        value: 100,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => { preloaderCount.textContent = Math.round(counter.value); },
      }, 0)
      .to(".preloader__inner", { opacity: 0, y: -18, duration: 0.4, ease: "power2.in" }, 1.65);
  }

  /* ------------------------------------------------------------
     Custom cursor
  ------------------------------------------------------------ */
  if (finePointer && !prefersReduced) {
    const dot = document.getElementById("cursorDot");
    const ring = document.getElementById("cursorRing");
    const pos = { x: innerWidth / 2, y: innerHeight / 2 };
    const ringPos = { x: pos.x, y: pos.y };

    window.addEventListener("mousemove", (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      gsap.set(dot, { x: pos.x, y: pos.y });
    });

    gsap.ticker.add(() => {
      ringPos.x += (pos.x - ringPos.x) * 0.14;
      ringPos.y += (pos.y - ringPos.y) * 0.14;
      gsap.set(ring, { x: ringPos.x, y: ringPos.y });
    });

    document.querySelectorAll("a, button, .panel__row, .oque__card, .stat").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => ring.classList.remove("is-hover"));
    });
  }

  /* ------------------------------------------------------------
     Magnetic nav links
  ------------------------------------------------------------ */
  if (finePointer && !prefersReduced) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        gsap.to(el, { x: dx * 0.3, y: dy * 0.35, duration: 0.4, ease: "power3.out" });
      });
      el.addEventListener("mouseleave", () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
      });
    });
  }

  /* ------------------------------------------------------------
     Nav state + scroll progress
  ------------------------------------------------------------ */
  const nav = document.getElementById("nav");
  ScrollTrigger.create({
    start: 60,
    onUpdate: (self) => nav.classList.toggle("is-scrolled", self.scroll() > 60),
    onEnter: () => nav.classList.add("is-scrolled"),
    onLeaveBack: () => nav.classList.remove("is-scrolled"),
  });

  gsap.to("#scrollProgress", {
    scaleX: 1,
    ease: "none",
    scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
  });

  /* ------------------------------------------------------------
     Hero canvas — linha de pulso (ECG) interativa
  ------------------------------------------------------------ */
  const canvas = document.getElementById("heroCanvas");
  const ctx = canvas.getContext("2d");
  let cw = 0, ch = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  const mouse = { x: -9999, active: false };

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    cw = rect.width;
    ch = rect.height;
    canvas.width = cw * dpr;
    canvas.height = ch * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  canvas.parentElement.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.active = true;
  });
  canvas.parentElement.addEventListener("mouseleave", () => { mouse.active = false; });

  // formato de batimento cardíaco (P, QRS, T)
  function ekgShape(u) {
    const g = (c, w) => Math.exp(-Math.pow((u - c) / w, 2));
    return (
      0.18 * g(0.22, 0.035) -   // P
      0.14 * g(0.40, 0.012) +   // Q
      1.00 * g(0.45, 0.013) -   // R
      0.28 * g(0.50, 0.014) +   // S
      0.30 * g(0.72, 0.05)      // T
    );
  }

  let ekgT = 0;
  let mouseBoost = 0;

  function drawEkg() {
    ctx.clearRect(0, 0, cw, ch);
    const baseY = ch * 0.55;
    const period = Math.max(cw * 0.38, 320);
    ekgT += 2.4;

    mouseBoost += ((mouse.active ? 1 : 0) - mouseBoost) * 0.06;

    const grad = ctx.createLinearGradient(0, 0, cw, 0);
    grad.addColorStop(0, "rgba(70, 95, 255, 0)");
    grad.addColorStop(0.12, "rgba(70, 95, 255, 0.9)");
    grad.addColorStop(0.65, "rgba(139, 154, 255, 0.9)");
    grad.addColorStop(0.92, "rgba(155, 107, 255, 0.85)");
    grad.addColorStop(1, "rgba(155, 107, 255, 0)");

    ctx.beginPath();
    const step = Math.max(2, Math.floor(cw / 640) * 2);
    for (let x = 0; x <= cw; x += step) {
      const u = (((x + ekgT) % period) + period) % period / period;
      let amp = ch * 0.28;
      if (mouseBoost > 0.01) {
        const d = Math.abs(x - mouse.x);
        amp += ch * 0.30 * mouseBoost * Math.exp(-Math.pow(d / 220, 2));
      }
      const y = baseY - ekgShape(u) * amp;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2.2;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.shadowColor = "rgba(70, 95, 255, 0.55)";
    ctx.shadowBlur = 14;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  if (!prefersReduced) {
    gsap.ticker.add(drawEkg);
  } else {
    resizeCanvas();
    drawEkg();
  }

  /* ------------------------------------------------------------
     Marquee — velocidade reage ao scroll
  ------------------------------------------------------------ */
  const marqueeTrack = document.getElementById("marqueeTrack");
  if (!prefersReduced && marqueeTrack) {
    const half = () => marqueeTrack.scrollWidth / 2;
    let marqueeX = 0;
    let speed = 0.7;
    let targetSpeed = 0.7;

    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        targetSpeed = 0.7 + Math.min(Math.abs(self.getVelocity()) / 900, 4);
      },
    });

    gsap.ticker.add(() => {
      speed += (targetSpeed - speed) * 0.05;
      targetSpeed += (0.7 - targetSpeed) * 0.04;
      marqueeX -= speed;
      const h = half();
      if (h > 0 && Math.abs(marqueeX) >= h) marqueeX += h;
      gsap.set(marqueeTrack, { x: marqueeX });
    });
  }

  /* ------------------------------------------------------------
     Reveals genéricos
  ------------------------------------------------------------ */
  if (!prefersReduced) {
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 86%",
        once: true,
        onEnter: () => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            onStart: () => el.classList.add("is-revealed"),
            clearProps: "transform",
          });
        },
      });
    });
  } else {
    document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-revealed"));
  }

  /* ------------------------------------------------------------
     Parallax simples em imagens
  ------------------------------------------------------------ */
  if (!prefersReduced) {
    document.querySelectorAll("[data-parallax]").forEach((el) => {
      const amount = parseFloat(el.dataset.parallax) || -10;
      gsap.fromTo(el, { yPercent: -amount }, {
        yPercent: amount,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    });
  }

  /* ------------------------------------------------------------
     Showcase — troca de telas do app (pinned)
  ------------------------------------------------------------ */
  const steps = gsap.utils.toArray(".showcase__step");
  const phones = gsap.utils.toArray(".showcase__img");
  const ticks = gsap.utils.toArray(".showcase__progress span");
  let currentStep = 0;

  function setStep(i) {
    if (i === currentStep) return;
    currentStep = i;
    steps.forEach((s, k) => s.classList.toggle("is-active", k === i));
    phones.forEach((p, k) => p.classList.toggle("is-active", k === i));
    ticks.forEach((t, k) => t.classList.toggle("is-active", k === i));
  }

  const mm = gsap.matchMedia();
  mm.add("(min-width: 881px) and (prefers-reduced-motion: no-preference)", () => {
    const st = ScrollTrigger.create({
      trigger: "#showcasePin",
      start: "top top",
      end: "+=" + steps.length * 90 + "%",
      pin: true,
      scrub: false,
      onUpdate: (self) => {
        const i = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
        setStep(i);
      },
    });
    return () => st.kill();
  });

  // mobile: sem pin — cada etapa revela ao entrar na tela
  mm.add("(max-width: 880px) and (prefers-reduced-motion: no-preference)", () => {
    const triggers = steps.map((step) => {
      gsap.set(step, { opacity: 0, y: 36 });
      return ScrollTrigger.create({
        trigger: step,
        start: "top 88%",
        once: true,
        onEnter: () => gsap.to(step, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }),
      });
    });
    return () => triggers.forEach((t) => t.kill());
  });

  /* ------------------------------------------------------------
     Painel de risco — barras + contadores
  ------------------------------------------------------------ */
  const riskPanel = document.getElementById("riskPanel");
  if (riskPanel) {
    const rows = gsap.utils.toArray(".panel__row");

    if (!prefersReduced) {
      gsap.set(rows, { opacity: 0, x: -28 });

      ScrollTrigger.create({
        trigger: riskPanel,
        start: "top 72%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();
          tl.to(rows, {
            opacity: 1,
            x: 0,
            duration: 0.7,
            stagger: 0.14,
            ease: "power3.out",
          });

          rows.forEach((row, i) => {
            const pct = parseFloat(row.dataset.pct);
            const fill = row.querySelector(".panel__fill");
            const num = row.querySelector(".panel__pct b");
            const counter = { v: 0 };

            tl.to(fill, {
              width: pct + "%",
              duration: 1.3,
              ease: "power3.inOut",
            }, 0.35 + i * 0.14);

            if (num) {
              tl.to(counter, {
                v: pct,
                duration: 1.3,
                ease: "power3.inOut",
                onUpdate: () => { num.textContent = Math.round(counter.v); },
              }, 0.35 + i * 0.14);
            }
          });

          tl.to(".panel__action", {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
          }, "-=0.3");
        },
      });
    } else {
      rows.forEach((row) => {
        const pct = parseFloat(row.dataset.pct);
        row.querySelector(".panel__fill").style.width = pct + "%";
        const num = row.querySelector(".panel__pct b");
        if (num) num.textContent = pct;
        const action = row.querySelector(".panel__action");
        if (action) { action.style.opacity = 1; action.style.transform = "none"; }
      });
    }
  }

  /* ------------------------------------------------------------
     Contadores de estatísticas
  ------------------------------------------------------------ */
  document.querySelectorAll(".stat__count").forEach((el) => {
    const target = parseFloat(el.dataset.count);
    if (prefersReduced) { el.textContent = target; return; }

    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        const counter = { v: 0 };
        gsap.to(counter, {
          v: target,
          duration: 1.8,
          ease: "power3.out",
          onUpdate: () => { el.textContent = Math.round(counter.v); },
        });
      },
    });
  });

  /* ------------------------------------------------------------
     Quote final — preenchimento palavra a palavra
  ------------------------------------------------------------ */
  const quoteText = document.getElementById("quoteText");
  if (quoteText && !prefersReduced) {
    const split = new SplitText(quoteText, { type: "words", wordsClass: "word" });
    gsap.to(split.words, {
      opacity: 1,
      stagger: 0.08,
      ease: "none",
      scrollTrigger: {
        trigger: quoteText,
        start: "top 78%",
        end: "top 30%",
        scrub: 0.4,
      },
    });
  }

  /* ------------------------------------------------------------
     Orbes do hero — respiração lenta
  ------------------------------------------------------------ */
  if (!prefersReduced) {
    gsap.to(".hero__orb--1", {
      x: -50, y: 60, scale: 1.08,
      duration: 9, ease: "sine.inOut", repeat: -1, yoyo: true,
    });
    gsap.to(".hero__orb--2", {
      x: 40, y: -40, scale: 1.12,
      duration: 11, ease: "sine.inOut", repeat: -1, yoyo: true,
    });
  }

  /* ------------------------------------------------------------
     Refresh após carregar imagens (alturas mudam)
  ------------------------------------------------------------ */
  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
