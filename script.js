const nav = document.querySelector("[data-nav]");
const menu = document.querySelector("[data-menu]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isDesktopInteractive = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const canUseCursorEffects = () => isDesktopInteractive && window.innerWidth >= 900;

const initStarfield = () => {
  if (reduceMotion) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.className = "starfield-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);

  let aura = null;
  if (canUseCursorEffects()) {
    aura = document.createElement("div");
    aura.className = "cursor-aura";
    aura.setAttribute("aria-hidden", "true");
    document.body.prepend(aura);
  }

  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let stars = [];
  const pointer = { x: -9999, y: -9999, active: false };
  const colors = [
    { fill: "rgba(255,255,255,", glow: "rgba(255,255,255,0.88)" },
    { fill: "rgba(220,224,230,", glow: "rgba(220,224,230,0.78)" },
    { fill: "rgba(248,231,161,", glow: "rgba(248,231,161,0.86)" },
  ];

  const makeStar = () => {
    const x = Math.random() * width;
    const y = Math.random() * height;
    return {
      x,
      y,
      homeX: x,
      homeY: y,
      baseSize: 0.6 + Math.random() * 2.5,
      vx: (Math.random() - 0.5) * 0.36,
      vy: (Math.random() - 0.5) * 0.36,
      pulse: Math.random() * Math.PI * 2,
      twinkle: 0.012 + Math.random() * 0.032,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  };

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    const targetCount = Math.min(340, Math.max(150, Math.floor((width * height) / 6200)));
    stars = Array.from({ length: targetCount }, makeStar);
  };

  const movePointer = (event) => {
    if (!canUseCursorEffects()) return;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
    document.body.classList.add("cursor-active");
    document.documentElement.style.setProperty("--cursor-x", `${pointer.x}px`);
    document.documentElement.style.setProperty("--cursor-y", `${pointer.y}px`);
  };

  const hidePointer = () => {
    pointer.active = false;
    document.body.classList.remove("cursor-active");
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);

    for (const star of stars) {
      if (pointer.active && canUseCursorEffects()) {
        const dx = star.x - pointer.x;
        const dy = star.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        const radius = 180;

        if (distance < radius && distance > 0.1) {
          const push = (1 - distance / radius) * 2.8;
          star.vx += (dx / distance) * push;
          star.vy += (dy / distance) * push;
        }
      }

      star.vx += (star.homeX - star.x) * 0.002;
      star.vy += (star.homeY - star.y) * 0.002;
      star.vx *= 0.92;
      star.vy *= 0.92;
      star.x += star.vx;
      star.y += star.vy;
      star.pulse += star.twinkle;
      star.homeX += Math.cos(star.pulse) * 0.018;
      star.homeY += Math.sin(star.pulse) * 0.018;

      if (star.homeX < -12) star.homeX = width + 12;
      if (star.homeX > width + 12) star.homeX = -12;
      if (star.homeY < -12) star.homeY = height + 12;
      if (star.homeY > height + 12) star.homeY = -12;

      const glow = 0.34 + Math.sin(star.pulse) * 0.22;
      const size = star.baseSize + glow;
      ctx.beginPath();
      ctx.fillStyle = `${star.color.fill}${0.5 + glow})`;
      ctx.shadowBlur = 14 + size * 4;
      ctx.shadowColor = star.color.glow;
      ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
      ctx.fill();

      if (star.baseSize > 2.2) {
        ctx.strokeStyle = `${star.color.fill}0.28)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(star.x - size * 3.5, star.y);
        ctx.lineTo(star.x + size * 3.5, star.y);
        ctx.moveTo(star.x, star.y - size * 3.5);
        ctx.lineTo(star.x, star.y + size * 3.5);
        ctx.stroke();
      }
    }

    if (pointer.active && canUseCursorEffects()) {
      const ringPulse = 6 * Math.sin(performance.now() * 0.006);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.26)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, 148 + ringPulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = "rgba(248, 231, 161, 0.2)";
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, 78 - ringPulse, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.shadowBlur = 0;
    requestAnimationFrame(draw);
  };

  resize();
  draw();
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pointermove", movePointer, { passive: true });
  window.addEventListener("pointerleave", hidePointer);
};

initStarfield();

const setNavState = () => {
  nav?.classList.toggle("scrolled", window.scrollY > 16);
};

setNavState();
window.addEventListener("scroll", setNavState, { passive: true });

menuToggle?.addEventListener("click", () => {
  menu?.classList.toggle("open");
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index % 6, 5) * 55}ms`;
  revealObserver.observe(el);
});

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count || 0);
      const duration = 1300;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  },
  { threshold: 0.55 }
);

document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));
