// public.js
(function () {
  // Regex to match any class containing "particle" or "particles"
  const particleRegex = /(particles?|Particles?)/;

  // Function to remove matching classes
  function disableParticleClasses(root = document) {
    root.querySelectorAll("*").forEach((el) => {
      el.classList.forEach((cls) => {
        if (particleRegex.test(cls)) {
          el.classList.remove(cls);
        }
      });
    });
  }

  // Run only if path is "/" or "/home"
  document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;

    if (path === "/" || path === "/home") {
      disableParticleClasses();

      // MutationObserver for dynamically added elements
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              disableParticleClasses(node);
            }
          });
        });
      });

      observer.observe(document.body, { childList: true, subtree: true });
    }
  });
})();
