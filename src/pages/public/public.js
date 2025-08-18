// public.js
(function () {
  // ---- ROUTE CHECK ----
  function isHomeRoute(loc = window.location) {
    const path = (loc.pathname || "").replace(/\/+$/, "") || "/";
    const hashPath = (loc.hash || "")
      .replace(/^#/, "")
      .split(/[?#]/)[0]
      .replace(/\/+$/, "");
    const pathMatch = path === "/" || path.toLowerCase() === "/home";
    const hashMatch =
      hashPath === "" || hashPath === "/" || hashPath.toLowerCase() === "/home";
    return pathMatch || hashMatch;
  }

  // ---- MATCHERS ----
  const ANY_PARTICLE_REGEX = /particles?/i; // "particle" or "particles" anywhere, case-insensitive
  const EXACT_BLOCKLIST = new Set(
    [
      "contact-particle",
      "about-particle",
      "home-perticle",      // note: spelling from your code
      "education-particle",
      "skill-particle",
      "skills-particle",
    ].map((s) => s.toLowerCase())
  );

  // Optional: common ids from particle libs
  const ID_HINT = /(tsparticles?|particles?|stars?|sparkles?|confetti)/i;

  // ---- HELPERS ----
  function stripParticleClassesFromEl(el) {
    if (!el || !el.classList) return;
    const toRemove = [];
    el.classList.forEach((cls) => {
      const lower = cls.toLowerCase();
      if (ANY_PARTICLE_REGEX.test(cls) || EXACT_BLOCKLIST.has(lower)) {
        toRemove.push(cls);
      }
    });
    toRemove.forEach((cls) => el.classList.remove(cls));
    // If element was purely a particle container, hide it too
    if (toRemove.length) hideElement(el);
  }

  function stripParticleClasses(root = document) {
    // Fast path: only scan nodes that even mention "particle"
    root.querySelectorAll('[class*="particle" i]').forEach(stripParticleClassesFromEl);

    // Also scan for exact blocklisted tokens even if "particle" spelling differs or case differs
    // We check every element that *has* a classList to avoid heavy full DOM walks
    root.querySelectorAll("*").forEach((el) => {
      if (!el.classList || el.classList.length === 0) return;
      // Only scan if we might have one of the exact tokens (case-insensitive)
      for (const token of el.classList) {
        if (EXACT_BLOCKLIST.has(token.toLowerCase())) {
          stripParticleClassesFromEl(el);
          break;
        }
      }
    });
  }

  function hideElement(el) {
    try {
      el.dataset._particlesDisabled = "1";
      el.style.setProperty("display", "none", "important");
      el.style.setProperty("visibility", "hidden", "important");
      el.style.setProperty("opacity", "0", "important");
      el.style.setProperty("animation", "none", "important");
      el.style.setProperty("transition", "none", "important");
      el.style.setProperty("pointer-events", "none", "important");
    } catch {}
  }

  // Hide likely full-screen background canvases/SVGs (often have no classes)
  function isLikelyBgVisual(el) {
    if (!el || el.nodeType !== 1) return false;
    const tag = el.tagName?.toLowerCase();
    if (tag !== "canvas" && tag !== "svg") return false;

    const r = el.getBoundingClientRect();
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    const coversScreen = r.width >= vw * 0.7 && r.height >= vh * 0.7;

    const cs = getComputedStyle(el);
    const layered = cs.position === "fixed" || cs.position === "absolute" || cs.zIndex !== "auto";
    const decorative = cs.pointerEvents === "none" || +cs.opacity < 0.95;

    const hints =
      ID_HINT.test(el.id || "") || [...(el.classList || [])].some((c) => ID_HINT.test(c));

    return coversScreen && (layered || decorative || hints);
  }

  function hideBigVisuals(root = document) {
    root.querySelectorAll("canvas,svg").forEach((el) => {
      if (isLikelyBgVisual(el)) hideElement(el);
    });
  }

  // Nuke common particle containers by id/attrs
  function nukeKnownContainers(root = document) {
    const selectors = [
      '[id*="tsparticles" i]',
      '[id*="particles" i]',
      '[id*="stars" i]',
      '[id*="confetti" i]',
      '[class*="tsparticles" i]',
      "[data-particles]",
      "[data-confetti]",
      "[data-stars]",
      // explicit classes requested (case-insensitive selection via i)
      '[class~="contact-particle" i]',
      '[class~="about-particle" i]',
      '[class~="home-perticle" i]',
      '[class~="education-particle" i]',
      '[class~="skill-particle" i]',
      '[class~="skills-particle" i]',
    ].join(",");
    root.querySelectorAll(selectors).forEach(hideElement);
  }

  // Belt & suspenders global CSS kill switch
  function injectKillSwitchStyle() {
    if (document.getElementById("particle-kill-switch")) return;
    const style = document.createElement("style");
    style.id = "particle-kill-switch";
    style.textContent = `
      [class*="particle" i],
      [id*="particle" i],
      [id*="tsparticles" i],
      [id*="stars" i],
      [id*="confetti" i],
      [data-particles],
      [data-confetti],
      [data-stars],
      .contact-particle, .about-particle, .home-perticle,
      .education-particle, .skill-particle, .skills-particle {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        animation: none !important;
        transition: none !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Disable CSS rules that target particle selectors (best effort; cross-origin sheets will be skipped)
  function disableParticleCssRules() {
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        const rules = sheet.cssRules || [];
        for (let i = rules.length - 1; i >= 0; i--) {
          const rule = rules[i];
          if (!rule || !rule.selectorText) continue;
          const sel = rule.selectorText.toLowerCase();
          if (
            sel.includes("particle") ||
            sel.includes("tsparticles") ||
            sel.includes("confetti") ||
            sel.includes("stars") ||
            sel.includes(".contact-particle") ||
            sel.includes(".about-particle") ||
            sel.includes(".home-perticle") ||
            sel.includes(".education-particle") ||
            sel.includes(".skill-particle") ||
            sel.includes(".skills-particle")
          ) {
            sheet.deleteRule(i);
          }
        }
      } catch {
        // ignore cross-origin stylesheets
      }
    }
  }

  // ---- OBSERVER ----
  let domObserver = null;
  function startObserver() {
    if (domObserver) return;
    domObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType !== 1) continue;
          // Element itself
          stripParticleClassesFromEl(node);
          if (isLikelyBgVisual(node)) hideElement(node);
          nukeKnownContainers(node);
          // Subtree
          if (node.querySelectorAll) {
            stripParticleClasses(node);
            hideBigVisuals(node);
          }
        }
        if (m.type === "attributes" && m.attributeName === "class" && m.target) {
          stripParticleClassesFromEl(m.target);
        }
      }
    });
    domObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  function stopObserver() {
    if (domObserver) {
      domObserver.disconnect();
      domObserver = null;
    }
  }

  // ---- APPLY / INIT ----
  function applyIfHome() {
    if (isHomeRoute()) {
      injectKillSwitchStyle();
      disableParticleCssRules();
      stripParticleClasses(document);
      nukeKnownContainers(document);
      hideBigVisuals(document);
      startObserver();
    } else {
      stopObserver();
    }
  }

  function init() {
    applyIfHome();

    // Hook SPA navigations
    const { pushState, replaceState } = history;
    history.pushState = function () {
      const r = pushState.apply(this, arguments);
      setTimeout(applyIfHome, 0);
      return r;
    };
    history.replaceState = function () {
      const r = replaceState.apply(this, arguments);
      setTimeout(applyIfHome, 0);
      return r;
    };
    window.addEventListener("popstate", () => setTimeout(applyIfHome, 0));
    window.addEventListener("hashchange", () => setTimeout(applyIfHome, 0));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
