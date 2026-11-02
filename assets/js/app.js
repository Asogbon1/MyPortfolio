/* Asogbon portfolio — interactions (no dependencies) */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* Year + live Abuja clock */
  $("#year").textContent = new Date().getFullYear();
  const clock = $("#wat-clock");
  const tick = () => {
    clock.textContent = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Lagos" }).format(new Date());
  };
  tick(); setInterval(tick, 15000);

  /* Nav: glass intensifies on scroll, active section, mobile sheet */
  const nav = $(".nav");
  const onScroll = () => nav.classList.toggle("scrolled", scrollY > 30);
  onScroll(); addEventListener("scroll", onScroll, { passive: true });

  const toggle = $(".nav-toggle"), sheet = $(".nav-sheet");
  const setSheet = (open) => {
    sheet.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.innerHTML = `<svg class="i"><use href="#i-${open ? "x" : "menu"}"/></svg>`;
  };
  toggle.addEventListener("click", () => setSheet(sheet.hidden));
  $$("a", sheet).forEach((a) => a.addEventListener("click", () => setSheet(false)));

  const links = $$(".nav-links a");
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  ["work", "services", "about", "experience", "contact"].forEach((id) => { const el = document.getElementById(id); if (el) spy.observe(el); });

  /* Reveal on scroll (staggered) */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const siblings = $$(".reveal", e.target.parentElement);
      const idx = Math.max(0, siblings.indexOf(e.target));
      e.target.style.transitionDelay = reduce ? "0s" : Math.min(idx * 70, 420) + "ms";
      e.target.classList.add("in");
      io.unobserve(e.target);
      setTimeout(() => (e.target.style.transitionDelay = ""), 1400);
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach((el) => io.observe(el));

  /* Specular sheen follows the pointer on every glass surface */
  if (finePointer) {
    addEventListener("pointermove", (ev) => {
      const el = ev.target.closest && ev.target.closest(".glass");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", ((ev.clientX - r.left) / r.width) * 100 + "%");
      el.style.setProperty("--my", ((ev.clientY - r.top) / r.height) * 100 + "%");
    }, { passive: true });
  }

  /* 3D tilt */
  if (finePointer && !reduce) {
    $$(".tilt, .tilt-soft").forEach((el) => {
      const max = el.classList.contains("tilt-soft") ? 4 : 9;
      el.addEventListener("pointermove", (ev) => {
        const r = el.getBoundingClientRect();
        const x = (ev.clientX - r.left) / r.width - 0.5;
        const y = (ev.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--ry", (x * max * 2).toFixed(2) + "deg");
        el.style.setProperty("--rx", (-y * max * 2).toFixed(2) + "deg");
        el.style.setProperty("--sheen", "1");
      });
      el.addEventListener("pointerleave", () => {
        el.style.setProperty("--ry", "0deg");
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--sheen", "0.6");
      });
    });

    /* Magnetic buttons */
    $$(".magnetic").forEach((b) => {
      b.addEventListener("pointermove", (ev) => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(ev.clientX - r.left - r.width / 2) * 0.18}px, ${(ev.clientY - r.top - r.height / 2) * 0.25}px)`;
      });
      b.addEventListener("pointerleave", () => (b.style.transform = ""));
    });

    /* Hero floating elements: parallax depth */
    const floaters = $$(".hero-stage [data-depth]");
    addEventListener("pointermove", (ev) => {
      const x = ev.clientX / innerWidth - 0.5, y = ev.clientY / innerHeight - 0.5;
      floaters.forEach((f) => {
        const d = parseFloat(f.dataset.depth);
        f.style.transform = `translate3d(${x * d * -24}px, ${y * d * -24}px, 0)`;
      });
    }, { passive: true });
  }

  /* Count-up stats */
  const counter = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target, end = +el.dataset.count;
      counter.unobserve(el);
      if (reduce) { el.textContent = end; return; }
      const t0 = performance.now(), dur = 1600;
      const step = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 4)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  $$("[data-count]").forEach((el) => counter.observe(el));

  /* Project filter */
  $$(".filter").forEach((btn) => btn.addEventListener("click", () => {
    $$(".filter").forEach((b) => { b.classList.toggle("active", b === btn); b.setAttribute("aria-selected", String(b === btn)); });
    const f = btn.dataset.filter;
    $$(".project").forEach((p) => {
      p.classList.toggle("hide", f !== "all" && p.dataset.cat !== f);
      p.classList.add("in");
    });
  }));

  /* Contact form → Formspree (AJAX, falls back to normal submit) */
  const form = $("#contactForm"), status = $(".form-status");
  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const btn = $("button", form);
    btn.disabled = true; status.className = "form-status"; status.textContent = "Sending…";
    try {
      const res = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error();
      form.reset();
      status.textContent = "Thanks! Your message is on its way — I'll reply soon.";
    } catch {
      status.className = "form-status err";
      status.textContent = "Something went wrong. Please email me directly at samuelasogbon51@gmail.com.";
    } finally { btn.disabled = false; }
  });
})();
