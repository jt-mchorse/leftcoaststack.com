(function () {
  var storageKey = "lcs-theme";
  var root = document.documentElement;

  function getStored() {
    try {
      return localStorage.getItem(storageKey);
    } catch (e) {
      return null;
    }
  }

  function setStored(value) {
    try {
      localStorage.setItem(storageKey, value);
    } catch (e) {
      /* ignore */
    }
  }

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    setStored(theme);
  }

  function initialTheme() {
    var stored = getStored();
    if (stored === "light" || stored === "dark") {
      return stored;
    }
    return systemPrefersDark() ? "dark" : "light";
  }

  apply(initialTheme());

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;

    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      apply(next);
    });

    if (window.matchMedia) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
        if (getStored()) return;
        apply(e.matches ? "dark" : "light");
      });
    }
  });
})();
