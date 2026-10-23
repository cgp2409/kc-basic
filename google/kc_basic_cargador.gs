/**
 * KC Basic · cargador del menú de la hoja de pedidos.
 * Se pega UNA vez en Extensiones → Apps Script (reemplaza todo lo que haya).
 * Cada vez que se usa, trae la versión más reciente de google/kc_basic_menu.gs desde GitHub,
 * así las mejoras llegan solas sin volver a pegar nada.
 */
var KC_FUENTE = "https://raw.githubusercontent.com/cgp2409/kc-basic/main/google/kc_basic_menu.gs";

function onOpen() {
  SpreadsheetApp.getUi().createMenu("KC Basic")
    .addItem("Generar invitación", "generarInvitacion")
    .addSeparator()
    .addItem("Configurar GitHub (una vez)", "configurarGithub")
    .addToUi();
}
function generarInvitacion() { kc_().generarInvitacion(); }
function configurarGithub() { kc_().configurarGithub(); }

function kc_() {
  var cache = CacheService.getScriptCache();
  var codigo = cache.get("kc-menu");
  if (!codigo) {
    var r = UrlFetchApp.fetch(KC_FUENTE + "?t=" + Date.now(), { muteHttpExceptions: true });
    if (r.getResponseCode() !== 200) throw new Error("No pude descargar el menú de KC Basic (" + r.getResponseCode() + "). Intenta de nuevo en un minuto.");
    codigo = r.getContentText();
    try { cache.put("kc-menu", codigo, 300); } catch (e) {}
  }
  return new Function(codigo + "\nreturn { generarInvitacion: generarInvitacion, configurarGithub: configurarGithub };")();
}

/* No se ejecuta nunca. Google decide qué permisos pedir leyendo este archivo; como el menú
   real se descarga, aquí se nombran los servicios que usa para que los permisos se pidan bien. */
function permisos_() {
  SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getActiveRange();
  DriveApp.getFolderById("x").createFolder("x");
  PropertiesService.getScriptProperties();
  UrlFetchApp.fetch("https://api.github.com");
  Utilities.unzip(Utilities.newBlob(""));
}
