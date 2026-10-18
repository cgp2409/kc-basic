/* =====================================================================
   Arma la página a partir de js/config.js
   (normalmente NO necesitas editar este archivo)
   ===================================================================== */
(function () {
  var S = window.SITE;
  var ICON_CDN = "https://cdn.jsdelivr.net/npm/@phosphor-icons/core@2/assets/light/";

  /* ---------- utilidades ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function ico(name, cls) {
    return '<span class="ico ' + (cls || "") + '" aria-hidden="true" style="--i:url(' + ICON_CDN + name + '-light.svg)"></span>';
  }
  var WA = "https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(S.whatsappMensaje);
  function wa(cta) { return 'href="' + WA + '" data-cta="' + cta + '" target="_blank" rel="noopener"'; }
  function buy(cta) { return 'href="' + esc(S.tienda.comprar) + '" data-cta="' + cta + '" data-comprar'; }
  var WAP = "https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(S.tienda.mensajePremium);
  function waP(cta) { return 'href="' + WAP + '" data-cta="' + cta + '" target="_blank" rel="noopener"'; }
  function btnPremium(cta, cls) { return '<a class="btn ' + (cls || "btn-line") + '" ' + waP(cta) + ">" + ico("whatsapp-logo") + esc(S.tienda.botonPremium) + "</a>"; }
  function sello(cls, size) {
    if (S.logo) return '<span class="sello ' + cls + '"><img src="' + esc(S.logo) + '" alt="' + esc(S.marca) + '"></span>';
    return '<span class="sello ' + cls + '" aria-hidden="true">' + esc(S.siglas) + "</span>";
  }
  function imagen(src, alt, ayuda) {
    if (!src) return '<div class="slot-vacio">' + esc(ayuda || "Imagen pendiente") + "</div>";
    return '<div class="slot"><img src="' + esc(src) + '" alt="' + esc(alt || "") + '" loading="lazy"></div>';
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---------- SEO ---------- */
  document.title = S.seo.titulo;
  function meta(attr, key, val) {
    var m = $("meta[" + attr + '="' + key + '"]');
    if (!m) { m = document.createElement("meta"); m.setAttribute(attr, key); document.head.appendChild(m); }
    m.setAttribute("content", val);
  }
  meta("name", "description", S.seo.descripcion);
  meta("property", "og:title", S.seo.titulo);
  meta("property", "og:description", S.seo.descripcion);
  meta("property", "og:type", "website");
  meta("property", "og:url", S.seo.url);
  if (S.seo.imagenCompartir) meta("property", "og:image", new URL(S.seo.imagenCompartir, S.seo.url).href);

  /* ---------- secciones ---------- */
  function header() {
    var links = S.menu.map(function (m) { return '<a href="' + esc(m.enlace) + '">' + esc(m.texto) + "</a>"; }).join("");
    return '<header class="header"><div class="wrap">' +
      '<a class="logo" href="#inicio" aria-label="' + esc(S.marca) + ', ir al inicio">' + sello("") + '<span class="logo-nombre">' + esc(S.marca) + "</span></a>" +
      '<nav class="nav" aria-label="Principal">' + links + "</nav>" +
      '<div class="header-cta"><div data-kc-moneda></div><a data-kc-carrito href="/cart/">Carrito</a><a class="btn btn-solid" ' + buy("header") + ">" + esc(S.botonMenu) + "</a>" +
      '<button type="button" class="burger" id="burger" aria-label="Abrir menú" aria-expanded="false">' + ico("list") + "</button></div>" +
      "</div>" +
      '<nav class="mnav" id="mnav" aria-label="Menú móvil">' + links + "</nav></header>";
  }

  function hero() {
    var h = S.hero, m = h.maqueta;
    function barra(nombre, par, color) {
      return '<div><div class="l"><span>' + nombre + "</span><span>" + par[0] + " / " + par[1] + '</span></div><div class="t"><div style="width:' + (par[0] / par[1] * 100) + "%;background:" + color + '"></div></div></div>';
    }
    return '<section class="hero paper"><div class="wrap">' +
      '<div class="hero-txt"><h1>' + esc(h.titulo) + " <em>" + esc(h.tituloDestacado) + "</em></h1>" +
      '<p class="hero-sub">' + esc(h.subtitulo) + "</p>" +
      '<div class="hero-btns"><a class="btn btn-solid" ' + buy("hero") + ">" + ico("shopping-bag") + esc(h.botonPrincipal) + "</a>" +
      btnPremium("hero") + "</div>" +
      '<a class="hero-demos" href="#demos">' + esc(h.enlaceDemos) + ico("arrow-down") + "</a>" +
      '<p class="hero-notas">' + h.notas.map(function (n) { return "<span>" + esc(n) + "</span>"; }).join('<i aria-hidden="true"></i>') + "</p></div>" +
      '<div class="hero-vis"><div class="mock" id="mock" role="img" aria-label="Un celular muestra una invitación que sale de un sobre con sello; detrás, el tablero de invitados con confirmados divididos en adultos, jóvenes y niños">' +
      '<div class="mock-tab"><div class="mock-row"><span class="mock-k">Tablero</span><span class="mock-live"><i></i>En vivo</span></div>' +
      '<div class="mock-ev">' + esc(m.tablero) + "</div>" +
      '<div class="mock-big"><b>' + m.confirmados + "</b><span>confirmados</span></div>" +
      '<div class="mock-sub">de ' + m.deTotal + " invitados · faltan " + (m.deTotal - m.confirmados) + "</div>" +
      '<div class="mock-bars">' + barra("Adultos", m.adultos, "#8E2A7E") + barra("Jóvenes", m.jovenes, "#B8955A") + barra("Niños", m.ninos, "#E7A9CD") + "</div>" +
      '<div class="mock-last">' + ico("check-circle") + "<span><b>" + esc(m.ultima) + "</b> " + esc(m.ultimaDetalle) + "</span></div></div>" +
      '<div class="phone-h"><div class="phone-h-in"><div class="notch"></div>' +
      '<div class="para"><span>Para</span><span>' + esc(m.sobrePara) + "</span><span>" + esc(m.sobrePases) + "</span></div>" +
      '<div class="sobre"><div class="s-fondo"></div><div class="s-mask"><div class="s-carta"><div>' +
      '<span class="a">' + esc(m.cartaEtiqueta) + '</span><span class="b">' + esc(m.cartaNombre) + '</span><span class="c"></span><span class="d">' + esc(m.cartaFecha) + '</span><span class="e">' + esc(m.cartaBoton) + "</span></div></div></div>" +
      '<div class="s-frente"></div><div class="s-tapa"></div><div class="s-sello">' + esc(S.siglas) + "</div></div>" +
      "</div></div></div></div></div></section>";
  }

  function demoCard(d) {
    var vis;
    if (d.imagen) {
      vis = '<div class="phone-in"><img src="' + esc(d.imagen) + '" alt="' + esc(d.descripcionImagen) + '" loading="lazy"></div>';
    } else {
      var m = d.maqueta, nombre = esc(m.nombre).replace("|", "<br>");
      var btn = m.botonContorno
        ? "border:1px solid " + m.boton + ";color:" + m.botonTexto
        : "background:" + m.boton + ";color:" + m.botonTexto;
      vis = '<div class="phone-in ' + (m.marco ? "pad" : "plain") + '" style="background:' + m.fondo + '">' +
        '<div class="box" style="' + (m.marco ? "border:1px solid " + m.linea : "") + '">' +
        (m.circulo ? '<span class="pc" style="border-color:' + m.linea + '"></span>' : "") +
        '<span class="pk" style="color:' + m.suave + '">' + esc(m.arriba) + "</span>" +
        '<span class="pn' + (m.cursiva ? " it" : "") + '" style="color:' + m.texto + '">' + nombre + "</span>" +
        (m.marco ? '<span class="pl" style="background:' + m.linea + '"></span>' : "") +
        (m.extra ? '<span class="pd" style="color:' + m.suave + ';margin-top:6px">' + esc(m.extra) + "</span>" : "") +
        '<span class="pd" style="color:' + m.suave + '">' + esc(m.fecha) + "</span>" +
        '<span class="pb" style="' + btn + '">' + esc(m.textoBoton) + "</span></div></div>";
    }
    var accion = d.pronto
      ? '<span class="btn btn-line btn-pronto" aria-disabled="true">' + ico("clock") + esc(S.demos.textoPronto) + "</span>"
      : '<a class="btn btn-line" href="' + esc(d.enlace) + '" target="_blank" rel="noopener">' + esc(S.demos.botonDemo) + ico("arrow-up-right") + "</a>";
    return '<article class="card' + (d.pronto ? " card-pronto" : "") + '"><div class="card-vis"><div class="phone" role="img" aria-label="' + esc(d.descripcionImagen) + '">' + vis + "</div>" +
      (d.pronto ? '<span class="pronto-badge">' + esc(S.demos.textoPronto) + "</span>" : "") + "</div>" +
      '<span class="card-tipo">' + esc(d.etiqueta) + "</span><h3>" + esc(d.titulo) + "</h3>" + accion + "</article>";
  }

  function demos() {
    var D = S.demos;
    function grid(tipo, oculto) {
      return '<div class="demo-grid' + (tipo === "basic" ? " demo-grid-4" : "") + '" id="demos-' + tipo + '" ' + (oculto ? "hidden" : "") + ">" +
        D.lista.filter(function (d) { return d.tipo === tipo; }).map(demoCard).join("") + "</div>";
    }
    var tabs = D.pestanas.map(function (p, i) {
      return '<button type="button" class="tab" role="tab" data-grupo="demos" data-tab="' + p.id + '" aria-selected="' + (i === 0) + '">' + esc(p.texto) + "</button>";
    }).join("");
    return '<section id="demos" class="section demos"><div class="wrap">' +
      '<div class="center reveal"><h2>' + esc(D.titulo) + '</h2><p class="lead">' + esc(D.texto) + "</p></div>" +
      '<div class="tabs" role="tablist" aria-label="Tipo de invitación"><div>' + tabs + "</div></div>" +
      D.pestanas.map(function (p, i) { return grid(p.id, i > 0); }).join("") +
      '<div class="demos-cta"><a class="btn btn-solid" ' + buy("demos") + ">" + ico("shopping-bag") + esc(S.tienda.botonComprar) + "</a>" + btnPremium("demos") + "</div></div></section>";
  }

  function tablero() {
    var T = S.tablero, m = T.maqueta;
    var puntos = T.puntos.map(function (p) {
      return "<li>" + ico(p.icono) + "<div><b>" + esc(p.titulo) + '</b><span class="d">' + esc(p.texto) + "</span></div></li>";
    }).join("");
    function fila(id, nombre, color) {
      return '<div><div class="l"><span>' + nombre + '</span><span id="' + id + '-n"></span></div><div class="t"><div id="' + id + '-b" style="background:' + color + '"></div></div></div>';
    }
    return '<section id="tablero" class="section tablero"><div class="wrap">' +
      '<div class="t-vis"><div class="t-card" id="dash" role="img" aria-label="Tablero de invitados en vivo: el contador de confirmados sube cuando una familia confirma">' +
      '<div class="t-head"><div><div class="t-ev">' + esc(m.evento) + '</div><div class="t-fecha">' + esc(m.fecha) + " · " + m.invitados + ' invitados</div></div><span class="t-live"><i></i>En vivo</span></div>' +
      '<div class="t-num"><div><b id="d-c">0</b><span>confirmados</span></div><span>Faltan por responder: <b id="d-f">' + m.invitados + "</b></span></div>" +
      '<div class="t-bars">' + fila("d-a", "Adultos", "#8E2A7E") + fila("d-j", "Jóvenes", "#B8955A") + fila("d-k", "Niños", "#E7A9CD") + "</div>" +
      '<div class="t-feed"><h4>Últimas confirmaciones</h4><div id="d-feed"></div></div>' +
      '<div class="t-dl">' + ico("download-simple") + "Descargar lista (Excel)</div></div></div>" +
      '<div class="t-txt reveal"><span class="eyebrow">' + esc(T.etiqueta) + "</span><h2>" + esc(T.titulo) + '</h2><p class="lead">' + esc(T.texto) + "</p>" +
      '<ul class="t-list">' + puntos + "</ul>" +
      '<a class="btn btn-line" href="' + esc(T.botonEnlace) + '" target="_blank" rel="noopener">' + esc(T.boton) + ico("arrow-up-right") + "</a></div></div></section>";
  }

  function testimonios() {
    var T = S.testimonios;
    if (T.mostrar === false) return "";
    var cards = T.lista.map(function (t) {
      return '<figure class="testi reveal">' + imagen(t.imagen, t.nombre, t.ayuda) +
        "<blockquote>“" + esc(t.cita) + "”</blockquote><figcaption><b>" + esc(t.nombre) + "</b><span>" + esc(t.detalle) + "</span></figcaption></figure>";
    }).join("");
    var n = T.eventosAcompanados ? '<div class="testi-n"><b>' + esc(T.eventosAcompanados) + "</b><span>" + esc(T.textoEventos) + "</span></div>" : "";
    return '<section class="section"><div class="wrap"><div class="testi-head reveal"><h2>' + esc(T.titulo) + "</h2>" + n + "</div>" +
      '<div class="testi-grid">' + cards + "</div></div></section>";
  }

  function precio() {
    var P = S.precio;
    var chips = P.paises.map(function (c) {
      return '<button type="button" class="chip" role="radio" data-pais="' + c.id + '" aria-checked="false">' + esc(c.boton) + "</button>";
    }).join("");
    var planes = P.planes.map(function (pl) {
      var inc = pl.incluye.map(function (i) { return "<li>" + ico("check") + esc(i) + "</li>"; }).join("");
      var btn = pl.accion === "comprar"
        ? '<a class="btn btn-solid" ' + buy("precio-" + pl.id) + ">" + ico("shopping-bag") + esc(pl.boton) + "</a>"
        : btnPremium("precio-" + pl.id);
      return '<article class="plan' + (pl.destacado ? " plan-on" : "") + '" data-plan="' + pl.id + '">' +
        '<div class="plan-top"><h3>' + esc(pl.nombre) + '</h3><span class="plan-sello">' + esc(pl.sello) + "</span></div>" +
        '<p class="plan-desc">' + esc(pl.descripcion) + "</p>" +
        '<div class="p-monto" aria-live="polite"><div><span class="p-pre"></span><span class="p-amt"></span><span class="p-cur"></span></div></div>' +
        '<p class="plan-pago">' + esc(pl.pago) + "</p>" +
        '<ul class="p-inc">' + inc + "</ul>" + btn + "</article>";
    }).join("");
    return '<section id="precio" class="section precio"><div class="wrap">' +
      '<div class="center reveal"><h2>' + esc(P.titulo) + '</h2><p class="lead">' + esc(P.texto) + "</p></div>" +
      '<p class="kc-aviso-moneda kc-aviso-landing">Estás viendo precios en <b id="p-moneda"></b>. Elige tu país:</p>' +
      '<div class="p-q">' + esc(P.pregunta) + '</div><div class="p-paises" role="radiogroup" aria-label="País">' + chips + "</div>" +
      '<div class="planes">' + planes + "</div>" +
      '<p class="p-resp">' + esc(P.notaBoton) + "</p></div></section>";
  }

  function pasos() {
    var P = S.pasos;
    function lista(items, id, oculto) {
      var li = items.map(function (p, i) {
        return '<li class="' + (p.destacado ? "on" : "") + '"><span class="pt"></span><div class="hd"><span class="n">' + ("0" + (i + 1)).slice(-2) + '</span><span class="t">' + esc(p.t) + '</span></div><span class="d">' + esc(p.d) + "</span></li>";
      }).join("");
      return '<div class="tl tl-' + items.length + '" id="pasos-' + id + '" ' + (oculto ? "hidden" : "") + "><ol>" + li + "</ol></div>";
    }
    return '<section id="como-funciona" class="section pasos"><div class="wrap"><div class="pasos-h reveal"><h2>' + esc(P.titulo) + '</h2><p class="lead">' + esc(P.texto) + "</p></div>" +
      '<div class="tabs tabs-left" role="tablist" aria-label="Opción"><div>' +
      '<button type="button" class="tab" role="tab" data-grupo="pasos" data-tab="basic" aria-selected="true">' + esc(P.pestanas.basic) + "</button>" +
      '<button type="button" class="tab" role="tab" data-grupo="pasos" data-tab="premium" aria-selected="false">' + esc(P.pestanas.premium) + "</button></div></div>" +
      lista(P.basic, "basic", false) + lista(P.premium, "premium", true) + "</div></section>";
  }

  function secciones() {
    var X = S.secciones;
    var items = X.lista.map(function (s) { return '<div' + (s.destacado ? ' class="sec-idea"' : "") + ">" + ico(s.icono) + "<span>" + esc(s.texto) + "</span></div>"; }).join("");
    return '<section class="secs"><div class="wrap"><div class="center reveal"><h2>' + esc(X.titulo) + '</h2><p class="lead">' + esc(X.texto) + "</p></div>" +
      '<div class="secs-grid reveal">' + items + "</div></div></section>";
  }

  function equipo() {
    var E = S.equipo;
    var pers = E.personas.map(function (p) { return "<div><b>" + esc(p.nombre) + "</b><span>" + esc(p.rol) + "</span></div>"; }).join("");
    return '<section class="section equipo' + (E.foto ? "" : " sin-foto") + '"><div class="wrap">' + (E.foto ? '<div class="eq-foto">' + imagen(E.foto, E.titulo, E.fotoAyuda) + "</div>" : "") +
      '<div class="eq-txt reveal"><h2>' + esc(E.titulo) + "</h2><p>" + esc(E.texto) + '</p><div class="eq-pers">' + pers + "</div></div></div></section>";
  }

  function preguntas() {
    var Q = S.preguntas;
    var items = Q.lista.map(function (q, i) {
      return '<div class="faq-i"><button type="button" class="faq-q" aria-expanded="' + (i === 0) + '" aria-controls="faq-' + i + '">' + esc(q.p) + '<i aria-hidden="true">+</i></button>' +
        '<p class="faq-a" id="faq-' + i + '"' + (i === 0 ? "" : " hidden") + ">" + esc(q.r) + "</p></div>";
    }).join("");
    return '<section id="preguntas" class="section faq"><div class="wrap"><h2 class="reveal">' + esc(Q.titulo) + '</h2><div class="faq-l">' + items + "</div></div></section>";
  }

  function cierre() {
    var C = S.cierre;
    return '<section class="cierre paper"><div class="wrap reveal">' + sello("") +
      "<h2>" + esc(C.titulo) + " <em>" + esc(C.tituloDestacado) + "</em></h2>" +
      '<a class="btn btn-solid" ' + buy("cierre") + ">" + ico("shopping-bag") + esc(C.boton) + "</a>" +
      btnPremium("cierre", "btn-line btn-cierre2") +
      (C.enlaceExtra ? '<a class="extra" href="' + esc(C.enlaceExtra) + '">' + esc(C.enlaceExtraTexto) + "</a>" : "") +
      "</div></section>";
  }

  function footer() {
    var F = S.pie;
    return '<footer class="footer"><div class="wrap"><div class="f-grid">' +
      '<div class="f-col"><div class="f-marca">' + sello("") + "<span>" + esc(S.marca) + '</span></div><p class="f-desc">' + esc(F.descripcion) + "</p></div>" +
      '<div class="f-col"><h5>' + esc(F.tituloContacto) + "</h5><a " + wa("footer") + ">WhatsApp " + esc(S.whatsappTexto) + '</a><a href="mailto:' + esc(S.email) + '">' + esc(S.email) + "</a></div>" +
      '<div class="f-col"><h5>' + esc(F.tituloSiguenos) + '</h5><a href="' + esc(S.instagram) + '" target="_blank" rel="noopener">Instagram</a><a href="' + esc(S.facebook) + '" target="_blank" rel="noopener">Facebook</a><a href="' + esc(S.blog) + '">Blog</a></div>' +
      '<div class="f-col"><h5>' + esc(F.tituloPaises) + "</h5><span>" + esc(F.paises) + "</span></div>" +
      '</div><div class="f-copy"><span>' + esc(F.copyright) + "</span>" + (F.legales || []).map(function (l) { return '<a href="' + esc(l.enlace) + '">' + esc(l.texto) + "</a>"; }).join("") + "</div></div></footer>" +
      (S.botonWhatsappFlotante ? '<a class="fab" ' + wa("flotante") + ' aria-label="Escríbenos por WhatsApp">' + ico("whatsapp-logo") + "</a>" : "");
  }

  $("#app").innerHTML = header() + '<main id="inicio">' + hero() + demos() + tablero() + testimonios() + precio() + pasos() + secciones() + equipo() + preguntas() + cierre() + "</main>" + footer();

  /* ---------- interacciones ---------- */
  // Menú móvil
  var burger = $("#burger"), mnav = $("#mnav");
  burger.addEventListener("click", function () {
    var open = mnav.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
  });
  $$("#mnav a").forEach(function (a) { a.addEventListener("click", function () { mnav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }); });

  // Pestañas de demos
  $$(".tab").forEach(function (t) {
    t.addEventListener("click", function () {
      var g = t.dataset.grupo;
      $$('.tab[data-grupo="' + g + '"]').forEach(function (o) {
        o.setAttribute("aria-selected", o === t);
        $("#" + g + "-" + o.dataset.tab).hidden = o !== t;
      });
    });
  });

  // Precio por país
  function paisInicial() {
    var guardado = null;
    try { guardado = localStorage.getItem("kc-pais"); } catch (e) {}
    if (guardado && S.precio.paises.some(function (p) { return p.id === guardado; })) return guardado;
    var pref = S.precio.paisPorDefecto;
    if (pref !== "auto") return pref;
    var tz = "";
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) {}
    if (tz === "America/Bogota") return "co";
    if (/^America\/(Mexico_City|Cancun|Merida|Monterrey|Matamoros|Chihuahua|Ojinaga|Mazatlan|Bahia_Banderas|Hermosillo|Tijuana)$/.test(tz)) return "mx";
    if (/^Europe\//.test(tz)) return "eu";
    if (/^(America|Pacific|Asia|Africa|Australia)\//.test(tz)) return "us";
    var l = (navigator.language || "").toLowerCase();
    if (/-co$/.test(l)) return "co";
    if (/-mx$/.test(l)) return "mx";
    if (/-(es|ad|fr|de|it|pt|nl|be|ie|at|ch)$/.test(l) || /^(fr|de|it|pt|nl)/.test(l)) return "eu";
    if (/^es/.test(l)) return "co";
    return "us";
  }
  var paisActual = "co";
  var MONEDA_TXT = { co: "pesos colombianos (COP)", mx: "pesos mexicanos (MXN)", eu: "dólares (USD) para Basic y euros (EUR) para Premium", us: "dólares (USD)" };
  function setPais(id, desdeCabecera) {
    paisActual = id;
    try { localStorage.setItem("kc-pais", id); } catch (e) {}
    var pm = document.getElementById("p-moneda"); if (pm) pm.textContent = MONEDA_TXT[id] || "";
    if (!desdeCabecera && window.kcPais) window.kcPais.set(id, { origen: "landing" });
    S.precio.planes.forEach(function (pl) {
      var c = pl.precios[id] || pl.precios.co, card = $('.plan[data-plan="' + pl.id + '"]');
      $(".p-pre", card).textContent = c.simbolo; $(".p-amt", card).textContent = c.monto; $(".p-cur", card).textContent = c.moneda;
    });
    $$(".chip").forEach(function (b) { b.setAttribute("aria-checked", b.dataset.pais === id); });
  }
  $$(".chip").forEach(function (b) { b.addEventListener("click", function () { setPais(b.dataset.pais); }); });
  setPais(paisInicial());
  window.addEventListener("kc-pais", function (e) { setPais(e.detail, true); });

  // Comprar: lleva a la tienda con el país elegido, para cobrar en su moneda
  $$("[data-comprar]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      var p = S.precio.paises.filter(function (x) { return x.id === paisActual; })[0];
      if (!p || !p.wc) return;
      e.preventDefault();
      var f = document.createElement("form");
      f.method = "post"; f.action = a.getAttribute("href");
      f.innerHTML = '<input type="hidden" name="wcpbc-manual-country" value="' + p.wc + '">';
      try { localStorage.setItem("kc-pais-tienda", p.wc); } catch (e) {}
      document.body.appendChild(f); f.submit();
    });
  });

  // Preguntas frecuentes
  $$(".faq-q").forEach(function (b) {
    b.addEventListener("click", function () {
      var abrir = b.getAttribute("aria-expanded") !== "true";
      $$(".faq-q").forEach(function (o) { o.setAttribute("aria-expanded", "false"); $("#" + o.getAttribute("aria-controls")).hidden = true; });
      if (abrir) { b.setAttribute("aria-expanded", "true"); $("#" + b.getAttribute("aria-controls")).hidden = false; }
    });
  });

  // Sobre que se abre
  setTimeout(function () { $("#mock").classList.add("open"); }, 400);

  // Aparición al hacer scroll
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    $$(".reveal").forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight * 0.9) io.observe(el); else el.classList.add("in");
    });
  } else { $$(".reveal").forEach(function (el) { el.classList.add("in"); }); }

  // Tablero en vivo
  (function () {
    var M = S.tablero.maqueta, topes = M.topes;
    var d = { a: 0, j: 0, k: 0 }, target = { a: M.inicial.adultos, j: M.inicial.jovenes, k: M.inicial.ninos };
    var queue = M.llegan.slice(), feed = M.ultimas.map(function (x) { return { n: x.n, d: x.d, t: x.t, fresh: false }; });
    function pintar() {
      var c = d.a + d.j + d.k;
      $("#d-c").textContent = c; $("#d-f").textContent = M.invitados - c;
      [["a", "adultos"], ["j", "jovenes"], ["k", "ninos"]].forEach(function (p) {
        $("#d-" + p[0] + "-n").textContent = d[p[0]] + " / " + topes[p[1]];
        $("#d-" + p[0] + "-b").style.width = (d[p[0]] / topes[p[1]] * 100) + "%";
      });
      $("#d-feed").innerHTML = feed.map(function (x) {
        return '<div class="t-item' + (x.fresh ? " fresh" : "") + '"><div><b>' + esc(x.n) + "</b><small>" + esc(x.d) + "</small></div><span>" + esc(x.t) + "</span></div>";
      }).join("");
    }
    function paso() {
      var mv = function (x, y) { return x < y ? x + Math.max(1, Math.ceil((y - x) / 12)) : x; };
      var n = { a: mv(d.a, target.a), j: mv(d.j, target.j), k: mv(d.k, target.k) };
      if (n.a !== d.a || n.j !== d.j || n.k !== d.k) { d = n; pintar(); }
    }
    function siguiente() {
      var f = queue.shift(); if (!f) return;
      target = { a: target.a + f.a, j: target.j + f.j, k: target.k + f.k };
      feed = [{ n: f.n, d: f.d, t: "ahora", fresh: true }].concat(feed.map(function (x) {
        return { n: x.n, d: x.d, fresh: false, t: x.t === "ahora" ? "hace un momento" : x.t };
      })).slice(0, 3);
      pintar();
      if (queue.length) setTimeout(siguiente, 3800);
    }
    function iniciar() {
      if (S.tablero.animacionEnVivo === false || reduce) {
        M.llegan.forEach(function (f) { target.a += f.a; target.j += f.j; target.k += f.k; });
        d = { a: target.a, j: target.j, k: target.k }; pintar(); return;
      }
      setInterval(paso, 30);
      setTimeout(siguiente, 2600);
    }
    pintar();
    var el = $("#dash");
    if ("IntersectionObserver" in window) {
      var o = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { o.disconnect(); iniciar(); } }, { threshold: 0.35 });
      o.observe(el);
    } else iniciar();
  })();
})();
