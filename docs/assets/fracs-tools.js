/* Shared helpers for the FRACS tools: toast, copy, tabs, criteria overlays, chip groups, count-up, fresh load. */
(function () {
  var FT = {};
  var reduce = function () { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; };

  FT.toast = function (msg) {
    var t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg; t.classList.add("show");
    clearTimeout(FT.toast._t);
    FT.toast._t = setTimeout(function () { t.classList.remove("show"); }, 1500);
  };

  FT.copy = function (text) {
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      var ok = false; try { ok = document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta);
      FT.toast(ok ? "Copied" : "Copy blocked here. Select the text manually.");
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { FT.toast("Copied"); }, fallback);
    else fallback();
  };

  /* Tabs: buttons [data-view] inside .tabs; panels .view[data-view]. */
  FT.tabs = function (onChange) {
    var tabs = Array.prototype.slice.call(document.querySelectorAll(".tabs [data-view]"));
    var order = tabs.map(function (t) { return t.dataset.view; });
    function show(v) {
      tabs.forEach(function (t) { var on = t.dataset.view === v; t.setAttribute("aria-selected", on); t.tabIndex = on ? 0 : -1; });
      document.querySelectorAll(".view").forEach(function (el) { el.hidden = el.dataset.view.split(" ").indexOf(v) < 0; });
      if (onChange) onChange(v);
    }
    tabs.forEach(function (t) {
      t.addEventListener("click", function () { show(t.dataset.view); });
      t.addEventListener("keydown", function (e) {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault();
        var i = order.indexOf(t.dataset.view), n = order[(i + (e.key === "ArrowRight" ? 1 : order.length - 1)) % order.length];
        show(n); tabs[order.indexOf(n)].focus();
      });
    });
    show(order[0]);
    return show;
  };

  /* Criteria overlays: a button [data-open="id"] opens .criteria#id. */
  var openModal = null;
  FT.closeModal = function () {
    if (!openModal) return;
    openModal.m.classList.remove("open"); openModal.b.setAttribute("aria-expanded", "false");
    var b = openModal.b; openModal = null; b.focus();
  };
  FT.modals = function () {
    document.querySelectorAll("[data-open]").forEach(function (b) {
      var m = document.getElementById(b.dataset.open);
      b.setAttribute("aria-expanded", "false");
      b.addEventListener("click", function () {
        FT.closeModal(); m.classList.add("open"); b.setAttribute("aria-expanded", "true");
        openModal = { m: m, b: b }; var c = m.querySelector("[data-close]"); if (c) c.focus();
      });
      m.addEventListener("click", function (e) { if (e.target === m || e.target.hasAttribute("data-close")) FT.closeModal(); });
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") FT.closeModal(); });
  };

  /* Chip radio group. opts: {container, name, values:[..], labels:[..], disabled:[bool], onPick(value)} */
  FT.chips = function (o) {
    var box = o.container, btns = [];
    o.values.forEach(function (v, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "chip"; b.setAttribute("role", "radio");
      b.dataset.v = v; b.id = o.name + "-" + i;
      b.innerHTML = '<span class="g">' + v + '</span><span class="l">' + (o.labels[i] || "") + "</span>";
      if (o.disabled && o.disabled[i]) { b.disabled = true; b.classList.add("na"); b.innerHTML = '<span class="g">' + v + '</span><span class="l">n/a</span>'; }
      b.setAttribute("aria-label", (o.aria || o.name) + ": " + (o.labels[i] || "").replace(/<br>/g, ", ").replace(/&lt;/g, "<").replace(/&gt;/g, ">") + ", " + v + " points");
      b.addEventListener("click", function () { o.onPick(v); });
      b.addEventListener("keydown", function (e) {
        var live = btns.filter(function (x) { return !x.disabled; }), j = live.indexOf(b), n = null;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") n = live[Math.min(live.length - 1, j + 1)];
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = live[Math.max(0, j - 1)];
        if (!n) return;
        e.preventDefault(); o.onPick(+n.dataset.v); n.focus();
      });
      btns.push(b); box.appendChild(b);
    });
    return function sync(val) {
      btns.forEach(function (b) { var on = +b.dataset.v === val; b.setAttribute("aria-checked", on); b.tabIndex = on ? 0 : -1; });
    };
  };

  /* Animate a number in el from its last value to target. fmt(n) returns the HTML. */
  FT.countUp = function (el, target, fmt) {
    var from = el._v == null ? target : el._v;
    cancelAnimationFrame(el._raf); clearTimeout(el._to);
    function paint(v) { el.innerHTML = fmt(v); }
    if (reduce() || document.hidden || from === target) { el._v = target; paint(target); return; }
    var t0 = performance.now(), dur = 420;
    function step(t) {
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el._v = from + (target - from) * e; paint(p === 1 ? target : el._v);
      if (p < 1) el._raf = requestAnimationFrame(step);
    }
    el._raf = requestAnimationFrame(step);
    el._to = setTimeout(function () { el._v = target; paint(target); }, dur + 120);
  };

  FT.pulse = function (el) { el.classList.remove("pulse"); void el.offsetWidth; el.classList.add("pulse"); };

  /* Always open fresh: no state from the URL or the back-forward cache. */
  FT.fresh = function (reset) {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (location.hash) { try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {} }
    window.addEventListener("pageshow", function (e) { if (e.persisted) reset(); });
  };

  FT.logit = function (x) { return 1 / (1 + Math.exp(-x)); };

  window.FT = FT;
})();
