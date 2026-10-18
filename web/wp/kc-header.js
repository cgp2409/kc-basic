/* KC Digital Magic · selector de país (bandera + $), carrito con contador y aviso de moneda.
   Se usa en la página de inicio (landing) y en la cabecera de la tienda. */
(function () {
  if (window.kcPais) return;
  var PAISES = [
    { v: "co", wc: "CO", nombre: "Colombia", mon: "COP", txt: "pesos colombianos (COP)" },
    { v: "mx", wc: "MX", nombre: "México", mon: "MXN", txt: "pesos mexicanos (MXN)" },
    { v: "us", wc: "US", nombre: "Otro país", mon: "USD", txt: "dólares (USD)" }
  ];
  var BANDERA = {
    co: '<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="10" fill="#FCD116"/><rect y="10" width="30" height="5" fill="#003893"/><rect y="15" width="30" height="5" fill="#CE1126"/></svg>',
    mx: '<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="10" height="20" fill="#006847"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#CE1126"/><circle cx="15" cy="10" r="2.6" fill="#8C6A2E"/></svg>',
    us: '<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#E8EEF6"/><circle cx="15" cy="10" r="7.2" fill="none" stroke="#4C6B96" stroke-width="1.3"/><ellipse cx="15" cy="10" rx="3.2" ry="7.2" fill="none" stroke="#4C6B96" stroke-width="1.1"/><path d="M7.8 10h14.4M8.8 6.5h12.4M8.8 13.5h12.4" stroke="#4C6B96" stroke-width="1"/></svg>'
  };
  var CARRITO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 7h12l-1 13H7L6 7Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 7a3 3 0 0 1 6 0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';

  function porId(v) { return PAISES.filter(function (p) { return p.v === v; })[0]; }
  function leer(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function guardar(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function adivinar() {
    var tz = ""; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) {}
    if (tz === "America/Bogota") return "co";
    if (/^America\/(Mexico_City|Cancun|Merida|Monterrey|Matamoros|Chihuahua|Ojinaga|Mazatlan|Bahia_Banderas|Hermosillo|Tijuana)$/.test(tz)) return "mx";
    if (tz) return "us";
    return "co";
  }
  var g = leer("kc-pais");
  if (g === "eu") g = "us";
  var actual = porId(g) ? g : adivinar();
  var tienda = /single-product|woocommerce-cart|woocommerce-checkout|post-type-archive-product|woocommerce-page/.test(document.body.className);

  function enviar(p) {
    try { sessionStorage.setItem("kc-pais-enviado", p.wc); } catch (e) {}
    var f = document.createElement("form");
    f.method = "post"; f.action = location.href;
    f.innerHTML = '<input type="hidden" name="wcpbc-manual-country" value="' + p.wc + '">';
    document.body.appendChild(f); f.submit();
  }

  /* ---------- Selector ---------- */
  var abiertos = [];
  function pintar() {
    var p = porId(actual);
    document.querySelectorAll(".kc-moneda-btn").forEach(function (b) {
      b.innerHTML = '<span class="kc-bandera">' + BANDERA[p.v] + '</span><span class="kc-signo">$</span><svg class="kc-flecha" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';
      b.setAttribute("aria-label", "País y moneda: " + p.nombre + ", " + p.mon + ". Cambiar");
    });
    document.querySelectorAll(".kc-moneda-lista li").forEach(function (li) { li.setAttribute("aria-selected", li.dataset.v === actual); });
    document.querySelectorAll("[data-kc-moneda-texto]").forEach(function (el) { el.textContent = p.txt; });
  }
  function cerrar() { abiertos.forEach(function (w) { w.classList.remove("abierto"); w.querySelector(".kc-moneda-btn").setAttribute("aria-expanded", "false"); }); abiertos = []; }
  function montar(slot) {
    slot.classList.add("kc-moneda");
    slot.innerHTML = '<button type="button" class="kc-moneda-btn" aria-haspopup="listbox" aria-expanded="false"></button>' +
      '<ul class="kc-moneda-lista" role="listbox"><li class="kc-moneda-titulo" role="presentation">¿Dónde es tu evento?</li>' +
      PAISES.map(function (p) { return '<li role="option" tabindex="0" data-v="' + p.v + '">' + '<span class="kc-bandera">' + BANDERA[p.v] + "</span><span>" + p.nombre + "</span><b>" + p.mon + "</b></li>"; }).join("") + "</ul>";
    var btn = slot.querySelector(".kc-moneda-btn");
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var abrir = !slot.classList.contains("abierto");
      cerrar();
      if (abrir) { slot.classList.add("abierto"); btn.setAttribute("aria-expanded", "true"); abiertos.push(slot); }
    });
    slot.querySelectorAll("li[data-v]").forEach(function (li) {
      var elegir = function () { cerrar(); kcPais.set(li.dataset.v, { origen: "selector" }); };
      li.addEventListener("click", elegir);
      li.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); elegir(); } });
    });
  }
  document.addEventListener("click", cerrar);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") cerrar(); });

  window.kcPais = {
    get: function () { return actual; },
    wc: function () { return porId(actual).wc; },
    set: function (v, op) {
      op = op || {};
      if (v === "eu") v = "us";
      if (!porId(v)) return;
      var cambio = v !== actual;
      actual = v; guardar("kc-pais", v); pintar();
      if (op.origen !== "landing") window.dispatchEvent(new CustomEvent("kc-pais", { detail: v }));
      if (cambio && tienda && op.origen === "selector") enviar(porId(v));
    },
    abrir: function () { var s = document.querySelector(".kc-moneda"); if (s) s.querySelector(".kc-moneda-btn").click(); }
  };

  function iniciar() {
    document.querySelectorAll("[data-kc-moneda]").forEach(montar);
    // Carrito siempre visible, con contador
    document.querySelectorAll("[data-kc-carrito]").forEach(function (a) {
      a.classList.add("kc-carrito-btn"); a.href = "/cart/"; a.setAttribute("aria-label", "Carrito");
      a.innerHTML = CARRITO + '<span class="kc-carrito-n" hidden>0</span>';
    });
    pintar();
    fetch("/wp-json/wc/store/v1/cart", { credentials: "same-origin" }).then(function (r) { return r.json(); }).then(function (c) {
      var n = c.items_count || 0;
      document.querySelectorAll(".kc-carrito-n").forEach(function (b) { b.textContent = n; b.hidden = !n; });
      // La tienda cobra en la moneda del país elegido: si no coincide, se sincroniza una vez
      var esperada = porId(actual).mon, enviado = null;
      try { enviado = sessionStorage.getItem("kc-pais-enviado"); } catch (e) {}
      if (tienda && c.totals && c.totals.currency_code && c.totals.currency_code !== esperada && enviado !== porId(actual).wc) enviar(porId(actual));
    }).catch(function () {});
    // Aviso de moneda junto a los precios de la tienda
    if (tienda) {
      var destino = document.querySelector(".single-product main .wc-block-components-product-price, .single-product main .price") ||
        document.querySelector(".wp-block-woocommerce-cart, .wp-block-woocommerce-checkout");
      if (destino) {
        var av = document.createElement("p");
        av.className = "kc-aviso-moneda";
        av.innerHTML = 'Precio en <b data-kc-moneda-texto></b>. <button type="button">¿Estás en otro país? Cámbialo aquí</button>';
        av.querySelector("button").addEventListener("click", function (e) { e.stopPropagation(); window.scrollTo({ top: 0, behavior: "smooth" }); setTimeout(kcPais.abrir, 250); });
        if (destino.classList.contains("wp-block-woocommerce-cart") || destino.classList.contains("wp-block-woocommerce-checkout")) destino.parentNode.insertBefore(av, destino);
        else destino.parentNode.insertBefore(av, destino.nextSibling);
        pintar();
      }
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar); else iniciar();
})();
