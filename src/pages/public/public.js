// public.js
(function () {
  // Overlay containers used across your components
  // (Projects.jsx, About.jsx, Contact.jsx, Education.jsx, Skills.jsx)
  const OVERLAY_CONTAINERS = [
    ".projects-particles",
    ".stars-container",
    ".contact-particles",
    ".education-particles",
    ".skills-particles",
  ];

  // Attribute used to track inline styles we set (so we can safely revert)
  const MARK = "data-overlay-hidden-by";

  // CSS we inject once to force-hide overlays when body has .overlay-off
  const STYLE_ID = "overlay-control-style";
  const css = `
    body.overlay-off ${OVERLAY_CONTAINERS.join(", body.overlay-off ")} {
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
  `;

  // --- helpers ---
  function ensureStyle() {
    if (!document.getElementById(STYLE_ID)) {
      const s = document.createElement("style");
      s.id = STYLE_ID;
      s.textContent = css;
      document.head.appendChild(s);
    }
  }

  // Normalize current path for BrowserRouter and HashRouter
  function getCurrentPath() {
    // BrowserRouter path (e.g., "/home", "/")
    const path = (location.pathname || "/").replace(/\/+$/, "") || "/";
    // HashRouter path (e.g., "#/home" or "#/")
    const rawHash = (location.hash || "").replace(/^#/, "");
    const hashPath = (rawHash.startsWith("/") ? rawHash : `/${rawHash}`)
      .replace(/\/+$/, "") || "/";

    return { path, hashPath };
  }

  function shouldHide() {
    const { path, hashPath } = getCurrentPath();

    // exact "/" or "/home" on BrowserRouter
    if (path === "/" || path.toLowerCase() === "/home") return true;

    // exact "/" or "/home" on HashRouter
    if (hashPath === "/" || hashPath.toLowerCase() === "/home") return true;

    return false;
  }

  // Inline hide as a fallback (works even if CSS injection is blocked)
  function inlineHide(el) {
    if (!el || el[MARK] === "1") return;
    el.style.setProperty("display", "none", "important");
    el.style.setProperty("opacity", "0", "important");
    el.style.setProperty("visibility", "hidden", "important");
    el.style.setProperty("pointer-events", "none", "important");
    el.setAttribute(MARK, "1");
    el.setAttribute("aria-hidden", "true");
  }

  function inlineShow(el) {
    if (!el || el[MARK] !== "1") return;
    el.style.removeProperty("display");
    el.style.removeProperty("opacity");
    el.style.removeProperty("visibility");
    el.style.removeProperty("pointer-events");
    el.removeAttribute(MARK);
    el.removeAttribute("aria-hidden");
  }

  function apply() {
    ensureStyle();

    const hide = shouldHide();
    document.body.classList.toggle("overlay-off", hide);

    // Inline fallback to be extra safe
    const nodes = document.querySelectorAll(OVERLAY_CONTAINERS.join(","));
    nodes.forEach((el) => (hide ? inlineHide(el) : inlineShow(el)));
  }

  // --- route change wiring for SPAs ---
  function installRouteListeners() {
    const origPush = history.pushState;
    const origReplace = history.replaceState;

    history.pushState = function () {
      const ret = origPush.apply(this, arguments);
      window.dispatchEvent(new Event("locationchange"));
      return ret;
    };
    history.replaceState = function () {
      const ret = origReplace.apply(this, arguments);
      window.dispatchEvent(new Event("locationchange"));
      return ret;
    };

    window.addEventListener("popstate", () =>
      window.dispatchEvent(new Event("locationchange"))
    );
    window.addEventListener("hashchange", () =>
      window.dispatchEvent(new Event("locationchange"))
    );
    window.addEventListener("locationchange", apply);
  }

  // Watch DOM for overlays that mount later (React async renders)
  function installDomObserver() {
    const mo = new MutationObserver((muts) => {
      // Only re-apply if we are in a hidden state to catch late mounts
      if (!document.body.classList.contains("overlay-off")) return;
      for (const m of muts) {
        if (m.type === "childList" && (m.addedNodes?.length || 0) > 0) {
          // Try to hide any newly added overlays
          const nodes = document.querySelectorAll(OVERLAY_CONTAINERS.join(","));
          nodes.forEach(inlineHide);
        }
      }
    });
    mo.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  // --- init ---
  function init() {
    installRouteListeners();
    installDomObserver();
    apply();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
