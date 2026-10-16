/* KC Basic — comportamiento común de las invitaciones. Sin librerías. */
(function () {
  "use strict";

  var datos = JSON.parse(document.getElementById("datos").textContent);
  var raiz = document.documentElement;
  var reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Invitado personalizado: ?para=Familia%20Pérez&cupos=4 ---------- */
  var params = new URLSearchParams(location.search);
  var para = (params.get("para") || datos.para_demo || "").trim().slice(0, 60);
  var cupos = parseInt(params.get("cupos") || datos.cupos_demo, 10);
  if (!(cupos >= 1 && cupos <= 20)) cupos = 0;

  if (para) {
    $$("[data-para]").forEach(function (el) {
      el.querySelector("strong").textContent = para;
      el.hidden = false;
    });
  }

  /* ---------- Apertura ---------- */
  var telon = $("#telon");
  var portadaLista = false;

  function animarPortada() {
    if (portadaLista) return;
    portadaLista = true;
    if (reducido || !raiz.classList.contains("anima") || !Element.prototype.animate) {
      raiz.classList.remove("anima");
      return;
    }
    var suave = "cubic-bezier(.2, .8, .2, 1)";
    var fondo = $(".portada-fondo");
    var xv = $(".xv text");
    var letras = $$(".nombre .letra");
    var tarde = $$(".fecha-portada, .para:not([hidden])");
    var pendientes = [];

    pendientes.push(fondo.animate(
      [{ opacity: 0, transform: "scale(1.08)" }, { opacity: 1, transform: "scale(1)" }],
      { duration: 1600, easing: suave, fill: "forwards" }));
    if (xv) pendientes.push(xv.animate(
      [{ strokeDashoffset: 900 }, { strokeDashoffset: 0 }],
      { duration: 2000, delay: 250, easing: "cubic-bezier(.45, 0, .2, 1)", fill: "forwards" }));
    letras.forEach(function (l, i) {
      pendientes.push(l.animate(
        [{ opacity: 0, transform: "translateY(.45em) rotate(4deg)" }, { opacity: 1, transform: "none" }],
        { duration: 750, delay: 500 + i * 65, easing: suave, fill: "forwards" }));
    });
    var fin = 500 + letras.length * 65 + 300;
    tarde.forEach(function (el, i) {
      pendientes.push(el.animate([{ opacity: 0 }, { opacity: 1 }],
        { duration: 700, delay: fin + i * 150, fill: "forwards" }));
    });
    Promise.all(pendientes.map(function (a) { return a.finished; })).then(function () {
      raiz.classList.remove("anima");
      pendientes.forEach(function (a) { a.cancel(); });
    });
  }

  if (telon) {
    $("#abrir").addEventListener("click", function () {
      document.body.style.overflow = "";
      if (reducido) {
        telon.remove();
        animarPortada();
        return;
      }
      telon.classList.add("abriendo");
      setTimeout(animarPortada, parseInt(telon.getAttribute("data-retardo"), 10) || 350);
      telon.addEventListener("animationend", function fin(e) {
        if (e.target !== telon) return;
        telon.removeEventListener("animationend", fin);
        telon.remove();
      });
    });
    document.body.style.overflow = "hidden";
  } else {
    animarPortada();
  }

  /* ---------- Cuenta regresiva ---------- */
  var cuenta = $("#cuenta");
  if (cuenta) {
    var objetivo = new Date(datos.inicio).getTime();
    var celdas = {
      d: $("[data-u=d]", cuenta), h: $("[data-u=h]", cuenta),
      m: $("[data-u=m]", cuenta), s: $("[data-u=s]", cuenta)
    };
    var dos = function (n) { return (n < 10 ? "0" : "") + n; };
    var tick = function () {
      var r = objetivo - Date.now();
      if (r <= 0) {
        cuenta.hidden = true;
        $("#cuenta-fin").hidden = false;
        return false;
      }
      var s = Math.floor(r / 1000);
      celdas.d.textContent = Math.floor(s / 86400);
      celdas.h.textContent = dos(Math.floor(s / 3600) % 24);
      celdas.m.textContent = dos(Math.floor(s / 60) % 60);
      celdas.s.textContent = dos(s % 60);
      return true;
    };
    if (tick()) {
      var reloj = setInterval(function () { if (!tick()) clearInterval(reloj); }, 1000);
    }
  }

  /* ---------- Agregar al calendario ---------- */
  var esApple = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
  function compacta(iso) { return iso.replace(/[-:]/g, "").slice(0, 15); }
  function escICS(t) { return String(t || "").replace(/[\\,;]/g, function (c) { return "\\" + c; }).replace(/\n/g, "\\n"); }

  $$("[data-calendario]").forEach(function (btn) {
    var m = datos.momentos[+btn.getAttribute("data-calendario")];
    var titulo = m.titulo;
    var detalles = "Invitación: " + datos.url;
    btn.href = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent(titulo) +
      "&dates=" + compacta(m.inicio) + "/" + compacta(m.fin) +
      "&location=" + encodeURIComponent(m.lugar + ", " + m.direccion) +
      "&details=" + encodeURIComponent(detalles);
    btn.addEventListener("click", function (e) {
      if (esApple) {
        e.preventDefault();
        var ics = [
          "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//KC Digital Magic//KC Basic//ES", "BEGIN:VEVENT",
          "UID:" + datos.slug + "-" + btn.getAttribute("data-calendario") + "@kcdigitalmagic.com",
          "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z",
          "DTSTART:" + compacta(m.inicio), "DTEND:" + compacta(m.fin),
          "SUMMARY:" + escICS(titulo), "LOCATION:" + escICS(m.lugar + ", " + m.direccion),
          "DESCRIPTION:" + escICS(detalles), "END:VEVENT", "END:VCALENDAR"
        ].join("\r\n");
        var url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
        var a = document.createElement("a");
        a.href = url; a.download = datos.slug + ".ics";
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      }
    });
  });

  /* ---------- Galería ---------- */
  var galeria = $(".galeria");
  if (galeria) {
    var fotos = $$("figure", galeria);
    var contador = $(".galeria-cuenta");
    var actual = 0;
    galeria.addEventListener("scroll", function () {
      var centro = galeria.scrollLeft + galeria.clientWidth / 2;
      var mejor = 0, dist = Infinity;
      fotos.forEach(function (f, i) {
        var d = Math.abs(f.offsetLeft + f.clientWidth / 2 - centro);
        if (d < dist) { dist = d; mejor = i; }
      });
      if (mejor !== actual) {
        actual = mejor;
        contador.textContent = (mejor + 1) + " de " + fotos.length;
      }
    }, { passive: true });
  }

  /* ---------- Hashtag ---------- */
  var tag = $(".hashtag");
  if (tag) {
    tag.addEventListener("click", function () {
      var estado = $(".hashtag-estado");
      var ok = function () { estado.textContent = "Copiado. Úsalo al publicar tus fotos."; };
      if (navigator.clipboard) {
        navigator.clipboard.writeText(tag.textContent.trim()).then(ok, function () {
          estado.textContent = "Mantén presionado el texto para copiarlo.";
        });
      } else {
        estado.textContent = "Mantén presionado el texto para copiarlo.";
      }
    });
  }

  /* ---------- Confirmación ---------- */
  var rsvp = datos.confirmacion;
  var salida = $("#cupos-n");
  if (salida) {
    var numero = String(rsvp.whatsapp || "").replace(/\D/g, "");
    var enlaceWhatsApp = function (texto) { return "https://wa.me/" + numero + "?text=" + encodeURIComponent(texto); };
    var plural = /^(familia|los|las)\b/i.test(para) || / y /i.test(para);
    var quien = para ? (plural ? "Hola, somos " : "Hola, soy ") + para + ". " : "Hola. ";
    var maximo = cupos || 10;
    var n = cupos || 1;
    var menos = $("#cupos-menos"), mas = $("#cupos-mas");
    var pintar = function () {
      salida.value = n;
      salida.textContent = n;
      menos.disabled = n <= 1;
      mas.disabled = n >= maximo;
      $("#confirmar-si").href = enlaceWhatsApp(quien + (n === 1
        ? "Confirmo mi asistencia a los XV años de " + datos.nombre + "."
        : "Confirmamos asistencia a los XV años de " + datos.nombre + ". Seremos " + n + " personas."));
    };
    menos.addEventListener("click", function () { if (n > 1) { n--; pintar(); } });
    mas.addEventListener("click", function () { if (n < maximo) { n++; pintar(); } });
    if (cupos) {
      $("#cupos-nota").textContent = cupos === 1
        ? "Reservamos 1 lugar para ti."
        : "Reservamos " + cupos + " lugares para ustedes.";
    }
    pintar();

    $("#confirmar-no").href = enlaceWhatsApp(quien + (plural ? "No podremos" : "No podré") +
      " asistir a los XV años de " + datos.nombre + ". ¡Gracias por la invitación!");
  }

  /* ---------- Barra flotante ---------- */
  var flotante = $(".flotante");
  var portada = $(".portada");
  var seccionConfirmar = $("#confirmar");
  if (flotante && "IntersectionObserver" in window) {
    var fueraPortada = false, enConfirmar = false;
    var actualizar = function () { flotante.classList.toggle("visible", fueraPortada && !enConfirmar); };
    new IntersectionObserver(function (e) { fueraPortada = !e[0].isIntersecting; actualizar(); }, { threshold: 0.05 }).observe(portada);
    new IntersectionObserver(function (e) { enConfirmar = e[0].isIntersecting; actualizar(); }, { threshold: 0.15 }).observe(seccionConfirmar);
  }
})();
