/**
 * KC Basic · menú de la hoja de pedidos.
 *
 * Instalación (una sola vez, en un computador):
 *   1. Abre la hoja "KC Basic · Pedidos" → Extensiones → Apps Script.
 *   2. Borra lo que haya en Código.gs, pega todo este archivo y guarda (ícono de disquete).
 *   3. Vuelve a la hoja y recárgala: aparece el menú "KC Basic".
 *   4. KC Basic → Configurar GitHub (una vez) → pega el token.
 *
 * Uso: clic en cualquier celda de la fila del cliente → KC Basic → Generar invitación.
 */

var REPO = "cgp2409/kc-basic-eventos";      // repositorio privado con los eventos de clientes
var RAMA = "main";
var CARPETA_BASIC = "1jhk8EizmAyKR1dv6R0qyDT8Nvs_J0gXx"; // Drive › invitaciones › basic
var BASE_URL = "https://basic.kcdigitalmagic.com/";
var HOJA = "Formulario";
var COL_TITULOS = "Cambios de títulos";

var DISENOS = {
  "Moderna · Noche dorada": ["xv-moderna-poster", "noche-dorada"],
  "Moderna · Rosa neón": ["xv-moderna-poster", "rosa-neon"],
  "Moderna · Lila minimal": ["xv-moderna-poster", "lila-minimal"],
  "Clásica · Marfil y dorado": ["xv-clasica-elegante", "marfil-dorado"],
  "Clásica · Cielo y plata": ["xv-clasica-elegante", "cielo-plata"],
  "Clásica · Rosa palo": ["xv-clasica-elegante", "rosa-palo"]
};
var MOMENTOS = { "misa": "misa", "ceremonia": "ceremonia", "ceremonia civil": "civil", "recepción / fiesta": "recepcion" };
var NIVELES = { "etiqueta": "etiqueta", "formal": "formal", "semiformal": "semiformal", "casual": "casual", "temático": "tematico" };
var REGALOS = { "lluvia de sobres": "lluvia_sobres", "mesa de regalos": "mesa_regalos", "solo tu presencia": "presencia" };
var PAISES = { "colombia": "CO", "méxico": "MX", "mexico": "MX", "estados unidos": "US", "españa": "ES" };
var INDICATIVO = { "CO": "57", "MX": "52", "US": "1", "ES": "34" };
var COLORES = ["blanco", "beige", "dorado", "plateado", "negro", "rojo", "vinotinto", "rosado", "fucsia", "lila", "morado", "azul", "azul claro", "verde", "verde menta", "amarillo", "naranja", "gris"];

function onOpen() {
  SpreadsheetApp.getUi().createMenu("KC Basic")
    .addItem("Generar invitación", "generarInvitacion")
    .addSeparator()
    .addItem("Configurar GitHub (una vez)", "configurarGithub")
    .addToUi();
}

/* ------------------------------------------------------------------ configuración */
function configurarGithub() {
  var ui = SpreadsheetApp.getUi();
  var r = ui.prompt("Configurar GitHub",
    "Pega el token de GitHub (empieza por github_pat_). Se guarda solo en este script.", ui.ButtonSet.OK_CANCEL);
  if (r.getSelectedButton() !== ui.Button.OK) return;
  var token = r.getResponseText().trim();
  if (!token) return;
  PropertiesService.getScriptProperties().setProperty("GITHUB_TOKEN", token);
  try {
    gh("GET", "/repos/" + REPO);
    var nuevo = prepararRepo();
    ui.alert("Listo", "El token funciona" + (nuevo ? " y el repositorio quedó preparado" : "") +
      ". Ya puedes usar KC Basic → Generar invitación.", ui.ButtonSet.OK);
  } catch (e) {
    ui.alert("El token no funcionó", String(e.message || e), ui.ButtonSet.OK);
  }
}

/* Copia la automatización (publicar.yml) del repositorio público al privado si aún no está. */
function prepararRepo() {
  var ruta = ".github/workflows/publicar.yml";
  if (gh("GET", "/repos/" + REPO + "/contents/" + ruta, null, "opcional")) return false;
  var fuente = gh("GET", "/repos/cgp2409/kc-basic/contents/privado/" + ruta);
  gh("PUT", "/repos/" + REPO + "/contents/" + ruta, {
    message: "Automatización de publicación", content: fuente.content.replace(/\n/g, ""), branch: RAMA
  });
  return true;
}

function gh(metodo, ruta, cuerpo, crudo) {
  var token = PropertiesService.getScriptProperties().getProperty("GITHUB_TOKEN");
  if (!token) throw new Error("Falta configurar GitHub: menú KC Basic → Configurar GitHub (una vez).");
  var op = {
    method: metodo, muteHttpExceptions: true, followRedirects: true,
    headers: { Authorization: "Bearer " + token, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" }
  };
  if (cuerpo) { op.contentType = "application/json"; op.payload = JSON.stringify(cuerpo); }
  var res = UrlFetchApp.fetch("https://api.github.com" + ruta, op);
  var code = res.getResponseCode();
  if (code === 404 && metodo === "GET" && crudo === "opcional") return null;
  if (code >= 300) throw new Error("GitHub respondió " + code + ": " + res.getContentText().slice(0, 300));
  if (crudo === true) return res.getBlob();
  var txt = res.getContentText();
  return txt ? JSON.parse(txt) : {};
}

/* ------------------------------------------------------------------ menú principal */
function generarInvitacion() {
  var ui = SpreadsheetApp.getUi();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = ss.getActiveSheet();
  if (hoja.getName() !== HOJA) { ui.alert("Abre la pestaña «" + HOJA + "» y haz clic en la fila del cliente."); return; }
  var fila = hoja.getActiveRange().getRow();
  if (fila < 2) { ui.alert("Haz clic en la fila del cliente (no en los títulos)."); return; }

  var tz = ss.getSpreadsheetTimeZone();
  var ancho = hoja.getLastColumn();
  var titulos = hoja.getRange(1, 1, 1, ancho).getDisplayValues()[0];
  var valores = hoja.getRange(fila, 1, 1, ancho).getValues()[0];
  var textos = hoja.getRange(fila, 1, 1, ancho).getDisplayValues()[0];
  var col = {};
  titulos.forEach(function (t, i) { col[t.trim()] = i; });
  if (col[COL_TITULOS] === undefined) {
    // Crea la columna «Cambios de títulos» la primera vez (al final de la hoja)
    hoja.getRange(1, ancho + 1).setValue(COL_TITULOS).setBackground("#8E2A7E").setFontColor("#FFFFFF").setFontWeight("bold");
    hoja.getRange(1, ancho + 1).setNote("Cambios separados por punto y coma: texto actual = texto nuevo\nEj.: Con mi familia = Con la bendición de Dios; Qué ponerte = Dress code");
    col[COL_TITULOS] = ancho; valores.push(""); textos.push("");
  }
  var celda = function (titulo) {
    var i = col[titulo];
    if (i === undefined) throw new Error("No encuentro la columna «" + titulo + "». ¿Le cambiaron el nombre?");
    return { v: valores[i], t: String(textos[i] || "").trim(), col: i + 1 };
  };

  var nombre = celda("Nombre de la quinceañera, tal como debe aparecer").t;
  if (ui.alert("Generar invitación", "¿Generar la invitación de " + (nombre || "esta fila") + " (fila " + fila + ")?", ui.ButtonSet.OK_CANCEL) !== ui.Button.OK) return;

  var res;
  try {
    var enlaceActual = celda("Enlace").t;
    res = armarEvento(celda, tz, enlaceActual);
  } catch (e) {
    ui.alert("Falta corregir algo", String(e.message || e), ui.ButtonSet.OK);
    return;
  }
  if (res.errores.length) {
    ui.alert("Falta corregir algo en la fila " + fila, "• " + res.errores.join("\n• ") + "\n\nCorrígelo y vuelve a generar.", ui.ButtonSet.OK);
    return;
  }

  var ev = res.evento;
  var fotos = [];
  if (ev.con_fotos) {
    var f = buscarFotos(ev.slug);
    if (f.error) { ui.alert("Fotos", f.error, ui.ButtonSet.OK); return; }
    fotos = f.fotos;
    var portada = fotos.filter(function (x) { return x.rol === "portada"; })[0];
    if (!portada) { ui.alert("Fotos", "Falta la foto de portada en la carpeta:\n" + f.url + "\n\nNómbrala «portada» (JPG o PNG).", ui.ButtonSet.OK); return; }
    ev.portada.foto = portada.nombre;
    ev.galeria = fotos.filter(function (x) { return x.rol === "galeria"; }).map(function (x) { return x.nombre; });
    var cierre = fotos.filter(function (x) { return x.rol === "cierre"; })[0];
    if (cierre) ev.cierre.foto = cierre.nombre;
  }

  ss.toast("Subiendo los datos…", "KC Basic", 30);
  var sha;
  try {
    sha = subir(ev, fotos);
  } catch (e) {
    ui.alert("No se pudo subir", String(e.message || e) + "\n\nSi sigue pasando, envía este mensaje a Cristhian.", ui.ButtonSet.OK);
    return;
  }

  ss.toast("Generando la invitación (1 a 3 minutos)…", "KC Basic", 240);
  var r = esperarResultadoDe(sha, ev.slug);
  var enlace = BASE_URL + ev.slug + "/";
  if (r.estado === "ok") {
    hoja.getRange(fila, celda("Enlace").col).setValue(enlace);
    hoja.getRange(fila, celda("Estado").col).setValue("Generada");
    hoja.getRange(fila, celda("Despublicar").col).setValue(new Date(ev.despublicar + "T12:00:00"));
    ui.alert("¡Lista!", "La invitación quedó en:\n" + enlace + "\n\nPuede tardar 1 o 2 minutos más en verse. Ábrela en el celular y revísala antes de enviarla.", ui.ButtonSet.OK);
  } else if (r.estado === "error") {
    ui.alert("La invitación tiene errores", "• " + r.errores.join("\n• ") + "\n\nCorrígelo en la fila y vuelve a generar. Si no entiendes el error, cópialo y envíaselo a Cristhian.", ui.ButtonSet.OK);
  } else {
    hoja.getRange(fila, celda("Enlace").col).setValue(enlace);
    ui.alert("Sigue en proceso", "Está tardando más de lo normal. Abre este enlace en 5 minutos:\n" + enlace + "\n\nSi no aparece, vuelve a generar.", ui.ButtonSet.OK);
  }
}

/* ------------------------------------------------------------------ fila → evento */
function armarEvento(celda, tz, enlaceActual) {
  var errores = [];
  var t = function (titulo) { return celda(titulo).t; };
  var id = function (texto) { var m = String(texto).match(/\[([a-z0-9_-]+)\]\s*$/); return m ? m[1] : null; };
  var ids = function (texto) { var out = [], re = /\[([a-z0-9_-]+)\]/g, m; while ((m = re.exec(texto))) out.push(m[1]); return out; };
  var fecha = function (titulo) {
    var c = celda(titulo);
    if (c.v instanceof Date) return Utilities.formatDate(c.v, tz, "yyyy-MM-dd");
    var m = c.t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (m) return m[3] + "-" + ("0" + m[2]).slice(-2) + "-" + ("0" + m[1]).slice(-2);
    if (c.t) errores.push(titulo + ": no entiendo la fecha «" + c.t + "»");
    return null;
  };
  var hora = function (titulo) {
    var s = t(titulo).toLowerCase();
    var m = s.match(/^(\d{1,2}):(\d{2})/);
    if (!m) { if (s) errores.push(titulo + ": no entiendo la hora «" + s + "»"); return null; }
    var h = +m[1];
    if (/p\.?\s*m/.test(s) && h < 12) h += 12;
    if (/a\.?\s*m/.test(s) && h === 12) h = 0;
    return ("0" + h).slice(-2) + ":" + m[2];
  };
  var limpio = function (s) { s = String(s || "").trim(); return /^(no tiene|no|n\/a|ninguna?|-)$/i.test(s) ? "" : s; };

  var nombre = t("Nombre de la quinceañera, tal como debe aparecer");
  if (!nombre) errores.push("Falta el nombre de la quinceañera");
  var f = fecha("Fecha del evento");
  if (!f) errores.push("Falta la fecha del evento");
  var pais = PAISES[t("País del evento").toLowerCase()] || "";
  var diseno = DISENOS[t("Diseño y color")];
  if (!diseno) errores.push("Diseño y color: no reconozco «" + t("Diseño y color") + "»");

  // Slug: se conserva el de la columna Enlace si ya se generó antes
  var slug = null;
  var m = String(enlaceActual || "").match(/\/(xv-[a-z0-9-]+-\d{4})\/?$/);
  if (m) slug = m[1];
  else if (nombre && f) slug = "xv-" + aSlug(nombre) + "-" + f.slice(2, 4) + f.slice(5, 7);

  var momentos = [];
  [1, 2].forEach(function (i) {
    var p = "Momento " + i + ": ";
    var tipo = t(p + "¿qué es?").toLowerCase();
    var lugar = t(p + "nombre del lugar");
    if (!tipo && !lugar) return;
    var mo = { tipo: MOMENTOS[tipo] || null, lugar: lugar, direccion: limpio(t(p + "dirección")), hora: hora(p + "hora"), mapa: t(p + "link de Google Maps") };
    if (!mo.tipo) errores.push(p + "no reconozco el tipo «" + tipo + "»");
    if (!mo.lugar) errores.push(p + "falta el nombre del lugar");
    if (!mo.hora) errores.push(p + "falta la hora");
    if (!/^https:\/\//.test(mo.mapa)) errores.push(p + "el link de Google Maps debe empezar por https://");
    momentos.push(mo);
  });
  if (!momentos.length) errores.push("Falta el momento 1 (lugar y hora)");
  momentos.sort(function (a, b) { return String(a.hora).localeCompare(String(b.hora)); });

  var frase = function (titulo, obligatoria) {
    var s = t(titulo);
    if (!s || /^ninguna$/i.test(s)) { if (obligatoria) errores.push("Falta: " + titulo); return null; }
    var i = id(s);
    if (i) return { frase_id: i, texto_propio: null };
    if (s.length > 280) errores.push(titulo + ": el texto propio tiene " + s.length + " caracteres (máximo 280)");
    return { frase_id: null, texto_propio: s };
  };

  var vestimenta = null;
  var nivel = t("Código de vestimenta").toLowerCase();
  if (nivel && nivel !== "no mostrar") {
    var colores = t("Colores reservados (que los invitados no usen)").split(",").map(function (c) { return c.trim().toLowerCase(); }).filter(String);
    colores.forEach(function (c) { if (COLORES.indexOf(c) < 0) errores.push("Color reservado desconocido: «" + c + "»"); });
    var nota = limpio(t("Nota de vestimenta"));
    if (nota.toLowerCase() === nivel) nota = "";
    vestimenta = { nivel: NIVELES[nivel] || nivel, colores_reservados: colores, nota: nota || null };
    if (!NIVELES[nivel]) errores.push("Código de vestimenta: no reconozco «" + nivel + "»");
  }

  var regalos = null;
  var reg = t("Regalos").toLowerCase();
  if (reg && reg !== "no mostrar") {
    regalos = { tipo: REGALOS[reg] || reg, link: t("Link de la mesa de regalos") || null };
    if (regalos.tipo === "mesa_regalos" && !/^https:\/\//.test(regalos.link || "")) errores.push("Mesa de regalos: falta el link (https://…)");
  }

  var familiaLinea = function (a, b) { return [t(a), t(b)].filter(String); };

  var metodo = /whatsapp/i.test(t("¿Cómo confirman los invitados?")) ? "whatsapp" : "enlace";
  var wa = null, link = null;
  if (metodo === "whatsapp") {
    wa = normalizarWhatsapp(t("WhatsApp para confirmaciones (con indicativo)") || t("Tu WhatsApp (con indicativo)"), pais);
    if (!wa) errores.push("WhatsApp para confirmaciones: escribe el número con indicativo, ej. +57 300 000 0000");
  } else {
    link = t("Enlace de tu formulario");
    if (!/^https:\/\//.test(link)) errores.push("Enlace de tu formulario: debe empezar por https://");
  }
  var limite = fecha("Fecha límite para confirmar");
  if (!limite) errores.push("Falta la fecha límite para confirmar");
  else if (f && limite >= f) errores.push("La fecha límite para confirmar debe ser antes del evento");

  var hashtag = t("Hashtag para redes").replace(/\s+/g, "");
  if (hashtag && hashtag.charAt(0) !== "#") hashtag = "#" + hashtag;

  var desp = null;
  if (f) { var d = new Date(f + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + 5); desp = Utilities.formatDate(d, "UTC", "yyyy-MM-dd"); }

  // Cambios de títulos: una línea por cambio, «texto actual = texto nuevo»
  var reemplazos = [];
  t(COL_TITULOS).split(/\n+|;/).forEach(function (linea) {
    if (!linea.trim()) return;
    var partes = linea.split(/\s*(?:=|→|->)\s*/);
    if (partes.length !== 2 || !partes[0].trim() || !partes[1].trim()) {
      errores.push("Cambios de títulos: escribe cada cambio así «Qué ponerte = Dress code» (revisa: «" + linea.trim() + "»)");
    } else {
      reemplazos.push({ de: partes[0].trim(), a: partes[1].trim() });
    }
  });

  var ev = {
    slug: slug, tipo: "xv",
    plantilla: diseno ? diseno[0] : null, tema: diseno ? diseno[1] : null,
    idioma: "es", pais: pais,
    con_fotos: /^s[ií]/i.test(t("¿Tu invitación lleva fotos?")),
    fecha: f, despublicar: desp,
    portada: { nombres: [nombre] },
    mensaje: frase("Frase de invitación", true),
    familia: { padres: familiaLinea("Padres · línea 1", "Padres · línea 2"), padrinos: familiaLinea("Padrinos · línea 1", "Padrinos · línea 2") },
    cita: frase("Cita o frase especial", false),
    momentos: momentos,
    vestimenta: vestimenta,
    regalos: regalos,
    reglas: ids(t("Reglas de la noche")),
    politica: ids(t("Avisos para los invitados")),
    galeria: [],
    hashtag: hashtag || null,
    confirmacion: { metodo: metodo, whatsapp: wa, link: link, fecha_limite: limite },
    cierre: frase("Frase de cierre", true) || {},
    reemplazos: reemplazos,
    addons: []
  };
  return { evento: ev, errores: errores };
}

function aSlug(s) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").split("-").slice(0, 3).join("-");
}

function normalizarWhatsapp(s, pais) {
  var mas = /^\s*\+/.test(s);
  var d = String(s || "").replace(/\D/g, "");
  if (!d) return null;
  if (!mas && d.length === 10 && INDICATIVO[pais]) d = INDICATIVO[pais] + d;
  if (d.length < 8 || d.length > 15) return null;
  return "+" + d;
}

/* ------------------------------------------------------------------ fotos en Drive */
function buscarFotos(slug) {
  var base = DriveApp.getFolderById(CARPETA_BASIC);
  var it = base.getFoldersByName("fotos");
  var fotosDir = it.hasNext() ? it.next() : base.createFolder("fotos");
  it = fotosDir.getFoldersByName(slug);
  var dir = it.hasNext() ? it.next() : fotosDir.createFolder(slug);
  var url = dir.getUrl();
  var fotos = [], archivos = dir.getFiles();
  while (archivos.hasNext()) {
    var a = archivos.next();
    var base_ = a.getName().replace(/\.[^.]+$/, "").toLowerCase().trim().replace(/\s+/g, "-");
    var tipo = a.getMimeType();
    var ext = tipo === "image/png" ? "png" : (tipo === "image/jpeg" ? "jpg" : (tipo === "image/webp" ? "webp" : null));
    var rol = base_ === "portada" ? "portada" : (base_ === "cierre" ? "cierre" : (/^galeria-[1-4]$/.test(base_) ? "galeria" : null));
    if (!rol) continue;
    if (!ext) return { error: "La foto «" + a.getName() + "» no es JPG ni PNG. Guárdala como JPG y súbela de nuevo a:\n" + url };
    fotos.push({ rol: rol, nombre: base_ + "." + ext, archivo: a });
  }
  if (!fotos.length) {
    return { error: "Esta invitación lleva fotos. Sube las fotos a esta carpeta y vuelve a generar:\n" + url +
      "\n\nNómbralas así: portada, galeria-1, galeria-2, galeria-3, galeria-4 y cierre (las de galería y cierre son opcionales)." };
  }
  fotos.sort(function (a, b) { return a.nombre.localeCompare(b.nombre); });
  return { fotos: fotos, url: url };
}

/* ------------------------------------------------------------------ GitHub */
function subir(ev, fotos) {
  var repo = "/repos/" + REPO;
  var ref = gh("GET", repo + "/git/ref/heads/" + RAMA);
  var padre = ref.object.sha;
  var commitPadre = gh("GET", repo + "/git/commits/" + padre);
  var arbol = [];
  var json = JSON.stringify(ev, null, 2) + "\n";
  arbol.push({ path: "eventos/" + ev.slug + ".json", mode: "100644", type: "blob", content: json });
  fotos.forEach(function (f) {
    var blob = gh("POST", repo + "/git/blobs", { content: Utilities.base64Encode(f.archivo.getBlob().getBytes()), encoding: "base64" });
    arbol.push({ path: "fotos/" + ev.slug + "/" + f.nombre, mode: "100644", type: "blob", sha: blob.sha });
  });
  // Fotos viejas de este evento que ya no están en Drive
  var actual = gh("GET", repo + "/contents/fotos/" + ev.slug + "?ref=" + RAMA, null, "opcional");
  if (actual && actual.length) {
    var nuevas = fotos.map(function (f) { return f.nombre; });
    actual.forEach(function (a) { if (nuevas.indexOf(a.name) < 0) arbol.push({ path: a.path, mode: "100644", type: "blob", sha: null }); });
  }
  var tree = gh("POST", repo + "/git/trees", { base_tree: commitPadre.tree.sha, tree: arbol });
  var commit = gh("POST", repo + "/git/commits", { message: "Invitación " + ev.slug, tree: tree.sha, parents: [padre] });
  gh("PATCH", repo + "/git/refs/heads/" + RAMA, { sha: commit.sha });
  return commit.sha;
}

function esperarResultado(sha) {
  var repo = "/repos/" + REPO;
  var limite = Date.now() + 4.5 * 60 * 1000;
  var run = null;
  while (Date.now() < limite) {
    Utilities.sleep(10000);
    var runs = gh("GET", repo + "/actions/runs?head_sha=" + sha + "&per_page=5").workflow_runs || [];
    run = runs[0];
    if (run && run.status === "completed") break;
  }
  if (!run || run.status !== "completed") return { estado: "pendiente" };
  var arts = gh("GET", repo + "/actions/runs/" + run.id + "/artifacts").artifacts || [];
  var art = arts.filter(function (a) { return a.name === "resultado"; })[0];
  if (!art) return { estado: "error", errores: ["La generación falló antes de terminar. Envía este mensaje a Cristhian (ejecución " + run.id + ")."] };
  var zip = descargarZip(repo + "/actions/artifacts/" + art.id + "/zip");
  return JSON.parse(Utilities.unzip(zip)[0].getDataAsString("UTF-8"));
}

/* GitHub responde con una redirección a un enlace firmado; ese enlace no lleva el token. */
function descargarZip(ruta) {
  var token = PropertiesService.getScriptProperties().getProperty("GITHUB_TOKEN");
  var res = UrlFetchApp.fetch("https://api.github.com" + ruta, {
    muteHttpExceptions: true, followRedirects: false,
    headers: { Authorization: "Bearer " + token, Accept: "application/vnd.github+json" }
  });
  var donde = res.getHeaders()["Location"] || res.getHeaders()["location"];
  var blob = donde ? UrlFetchApp.fetch(donde).getBlob() : res.getBlob();
  return blob.setContentType("application/zip");
}

/* El resultado trae errores de todos los eventos; este filtro deja solo los del evento generado. */
function esperarResultadoDe(sha, slug) {
  var r = esperarResultado(sha);
  if (r.estado === "pendiente") return r;
  if (r.publicados && r.publicados.indexOf(slug) >= 0) return { estado: "ok" };
  if (r.errores && r.errores[slug]) return { estado: "error", errores: r.errores[slug] };
  if (r.estado === "error") return r;
  return { estado: "error", errores: ["No se publicó y no hay detalle del error. Envía este mensaje a Cristhian."] };
}
