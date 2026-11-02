(function () {
  var $ = function (id) { return document.getElementById(id); };

  // Revela os elementos ao rolar a página
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add("is-visible");
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Cabeçalho
  var header = $("header");
  var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 40); };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Menu mobile
  var toggle = $("menu-toggle");
  var navMobile = $("nav-mobile");
  var setMenu = function (open) {
    navMobile.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    toggle.querySelector("use").setAttribute("href", open ? "#i-x" : "#i-menu");
  };
  toggle.addEventListener("click", function () { setMenu(navMobile.hidden); });
  navMobile.addEventListener("click", function (e) {
    if (e.target.tagName === "A") setMenu(false);
  });

  // Filtro de projetos
  var grid = $("project-grid");
  var projects = Array.prototype.slice.call(grid.querySelectorAll(".project"));
  var visible = projects;
  var filters = $("filters").querySelectorAll("button");
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cat = btn.dataset.cat;
      filters.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", String(active));
      });
      grid.classList.toggle("is-filtered", cat !== "Todos");
      visible = projects.filter(function (p) {
        var show = cat === "Todos" || p.dataset.cat === cat;
        p.hidden = !show;
        return show;
      });
    });
  });

  // Lightbox
  var lightbox = $("lightbox");
  var lbImg = $("lb-img");
  var lbCaption = $("lb-caption");
  var idx = null;
  var lastFocus = null;
  var show = function (i) {
    idx = (i + visible.length) % visible.length;
    var img = visible[idx].querySelector("img");
    lbImg.src = img.getAttribute("src");
    lbImg.alt = img.alt;
    lbCaption.textContent = img.alt;
  };
  var openLb = function (i) {
    lastFocus = document.activeElement;
    show(i);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    $("lb-close").focus();
  };
  var closeLb = function () {
    idx = null;
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  };
  projects.forEach(function (p) {
    p.addEventListener("click", function () { openLb(visible.indexOf(p)); });
  });
  lightbox.addEventListener("click", closeLb);
  $("lb-figure").addEventListener("click", function (e) { e.stopPropagation(); });
  $("lb-prev").addEventListener("click", function (e) { e.stopPropagation(); show(idx - 1); });
  $("lb-next").addEventListener("click", function (e) { e.stopPropagation(); show(idx + 1); });
  window.addEventListener("keydown", function (e) {
    if (idx === null) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowRight") show(idx + 1);
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "Tab") {
      // Mantém o foco dentro do lightbox
      var items = lightbox.querySelectorAll("button");
      var first = items[0];
      var last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  $("year").textContent = new Date().getFullYear();
})();
