(function () {
  function pageKey(pathname) {
    if (!pathname || pathname === "/") return "index.html";
    var trimmed = pathname.replace(/\/$/, "");
    var last = trimmed.split("/").pop();
    if (!last || last === "") return "index.html";
    return last;
  }

  function syncNavCurrentPage() {
    var nav = document.getElementById("site-nav");
    if (!nav) return;
    var here = pageKey(window.location.pathname);
    nav.querySelectorAll("a").forEach(function (link) {
      link.removeAttribute("aria-current");
      try {
        var u = new URL(link.href, window.location.href);
        if (pageKey(u.pathname) === here) {
          link.setAttribute("aria-current", "page");
        }
      } catch (e) {
        /* ignore */
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("site-nav");
    syncNavCurrentPage();

    if (!toggle || !nav) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("nav-open", open);
    }

    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      setOpen(!open);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });

    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 768px)").matches) {
        setOpen(false);
      }
    });
  });

  document.body.addEventListener("htmx:afterSettle", syncNavCurrentPage);

  document.body.addEventListener("htmx:afterSwap", function (evt) {
    try {
      var xhr = evt.detail && evt.detail.xhr;
      if (!xhr || !xhr.responseText) return;
      var doc = new DOMParser().parseFromString(xhr.responseText, "text/html");
      var t = doc.querySelector("title");
      if (t && t.textContent) {
        document.title = t.textContent.trim();
      }
    } catch (e) {
      /* ignore */
    }
  });
})();
