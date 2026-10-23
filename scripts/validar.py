#!/usr/bin/env python3
"""Valida el archivo de un evento KC Basic contra el catálogo y el banco de frases.

Uso:
    python scripts/validar.py eventos/xv-ana-2611.json
    python scripts/validar.py eventos/*.json

Sale con código 0 si todo está bien, 1 si hay errores. Solo usa la librería estándar.
"""
import json
import re
import sys
from datetime import date, timedelta
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CATALOGO = json.loads((RAIZ / "data" / "catalogo.json").read_text(encoding="utf-8"))
FRASES = json.loads((RAIZ / "data" / "frases.json").read_text(encoding="utf-8"))

DIAS_DESPUBLICAR = 5
MAX_MOMENTOS = 2
MAX_GALERIA = 4
MAX_TEXTO_PROPIO = 280
MAX_NOTA = 140
MAX_LINEAS_FAMILIA = 2
SLUG_RE = re.compile(r"^(xv|boda|baby)-[a-z0-9]+(-[a-z0-9]+)*-\d{4}$")
HORA_RE = re.compile(r"^([01]\d|2[0-3]):[0-5]\d$")
WHATSAPP_RE = re.compile(r"^\+\d[\d ]{7,18}$")
FOTO_RE = re.compile(r"^[a-z0-9_-]+\.(jpg|jpeg|png|webp)$")


class Validacion:
    def __init__(self):
        self.errores = []
        self.avisos = []

    def error(self, campo, msg):
        self.errores.append(f"{campo}: {msg}")

    def aviso(self, campo, msg):
        self.avisos.append(f"{campo}: {msg}")


def fecha_iso(v, campo, val):
    try:
        return date.fromisoformat(v)
    except (TypeError, ValueError):
        val.error(campo, f"fecha inválida {v!r}; usa AAAA-MM-DD")
        return None


def es_url(v):
    return isinstance(v, str) and v.startswith("https://")


def validar(ev):
    val = Validacion()

    # --- Identidad -------------------------------------------------------
    slug = ev.get("slug")
    if not isinstance(slug, str) or not SLUG_RE.match(slug):
        val.error("slug", "minúsculas, sin tildes, formato tipo-nombre-aamm (ej. xv-ana-2611)")

    tipo = ev.get("tipo")
    if tipo not in ("xv", "boda", "baby"):
        val.error("tipo", "debe ser 'xv', 'boda' o 'baby'")
    elif isinstance(slug, str) and not slug.startswith(tipo + "-"):
        val.error("slug", f"debe empezar por '{tipo}-'")

    plantilla = CATALOGO["plantillas"].get(ev.get("plantilla"))
    if not plantilla:
        val.error("plantilla", f"no existe; opciones: {', '.join(CATALOGO['plantillas'])}")
    else:
        if plantilla["tipo"] != tipo:
            val.error("plantilla", f"es para '{plantilla['tipo']}', el evento es '{tipo}'")
        if plantilla["estado"] == "pendiente":
            val.aviso("plantilla", "todavía no está construida")
        if plantilla["temas"] and ev.get("tema") not in plantilla["temas"]:
            val.error("tema", f"no existe en esta plantilla; opciones: {', '.join(plantilla['temas'])}")

    if ev.get("idioma") not in ("es", "en"):
        val.error("idioma", "debe ser 'es' o 'en'")
    if not isinstance(ev.get("con_fotos"), bool):
        val.error("con_fotos", "debe ser true o false")

    # --- Fechas ----------------------------------------------------------
    fecha = fecha_iso(ev.get("fecha"), "fecha", val)
    desp = fecha_iso(ev.get("despublicar"), "despublicar", val)
    if fecha and desp and desp != fecha + timedelta(days=DIAS_DESPUBLICAR):
        val.aviso("despublicar", f"la regla es {DIAS_DESPUBLICAR} días después: {fecha + timedelta(days=DIAS_DESPUBLICAR)}")

    # --- Portada ---------------------------------------------------------
    portada = ev.get("portada") or {}
    nombres = portada.get("nombres")
    if not isinstance(nombres, list) or not nombres or not all(isinstance(n, str) and n.strip() for n in nombres):
        val.error("portada.nombres", "falta el nombre")
    elif tipo in ("xv", "baby") and len(nombres) != 1:
        val.error("portada.nombres", "va un solo nombre (la quinceañera o el bebé)")
    elif tipo == "boda" and len(nombres) != 2:
        val.error("portada.nombres", "en boda van dos nombres")

    con_fotos = ev.get("con_fotos") is True
    foto = portada.get("foto")
    if con_fotos and not foto:
        val.error("portada.foto", "obligatoria en la versión con fotos")
    if not con_fotos and foto:
        val.aviso("portada.foto", "hay foto pero con_fotos es false; no se mostrará")
    for campo, f in (("portada.foto", foto), ("secundaria.foto", (ev.get("secundaria") or {}).get("foto")),
                     ("cierre.foto", (ev.get("cierre") or {}).get("foto"))):
        if f and not FOTO_RE.match(f):
            val.error(campo, f"nombre de archivo inválido {f!r}")

    # --- Textos del banco ------------------------------------------------
    def frase(campo, bloque, banco, obligatoria):
        b = ev.get(bloque) or {}
        fid, propio = b.get("frase_id"), b.get("texto_propio")
        if fid and propio:
            val.error(campo, "usa frase_id o texto_propio, no ambos")
        elif fid and fid not in FRASES[banco]:
            val.error(campo, f"frase_id {fid!r} no existe en el banco '{banco}'")
        elif propio and len(propio) > MAX_TEXTO_PROPIO:
            val.error(campo, f"texto propio de {len(propio)} caracteres; máximo {MAX_TEXTO_PROPIO}")
        elif obligatoria and not (fid or propio):
            val.error(campo, "falta: elige una frase o escribe una propia")

    frase("mensaje", "mensaje", "invitacion", True)
    frase("cita", "cita", "cita", False)
    frase("cierre", "cierre", "cierre", True)

    # --- Familia ---------------------------------------------------------
    familia = ev.get("familia") or {}
    for k in ("padres", "padrinos"):
        lista = familia.get(k, [])
        if not isinstance(lista, list) or len(lista) > MAX_LINEAS_FAMILIA:
            val.error(f"familia.{k}", f"lista de máximo {MAX_LINEAS_FAMILIA} líneas")

    # --- Momentos --------------------------------------------------------
    momentos = ev.get("momentos")
    if not isinstance(momentos, list) or not 1 <= len(momentos) <= MAX_MOMENTOS:
        val.error("momentos", f"entre 1 y {MAX_MOMENTOS}")
    else:
        for i, m in enumerate(momentos):
            c = f"momentos[{i}]"
            if m.get("tipo") not in CATALOGO["momento_tipos"]:
                val.error(c + ".tipo", f"opciones: {', '.join(CATALOGO['momento_tipos'])}")
            if not m.get("lugar"):
                val.error(c + ".lugar", "falta")
            if not HORA_RE.match(str(m.get("hora", ""))):
                val.error(c + ".hora", "formato 24 h HH:MM, ej. 19:00")
            if not es_url(m.get("mapa")):
                val.error(c + ".mapa", "falta el link de Google Maps (https://...)")
        horas = [m.get("hora", "") for m in momentos]
        if horas != sorted(horas):
            val.aviso("momentos", "no están en orden de hora")

    # --- Detalles --------------------------------------------------------
    vest = ev.get("vestimenta")
    if vest:
        if vest.get("nivel") not in CATALOGO["vestimenta_niveles"]:
            val.error("vestimenta.nivel", f"opciones: {', '.join(CATALOGO['vestimenta_niveles'])}")
        for col in vest.get("colores_reservados", []):
            if col not in CATALOGO["colores_reservables"]:
                val.error("vestimenta.colores_reservados", f"{col!r} no está en la paleta")
        if vest.get("nota") and len(vest["nota"]) > MAX_NOTA:
            val.error("vestimenta.nota", f"máximo {MAX_NOTA} caracteres")

    reg = ev.get("regalos")
    if reg:
        if reg.get("tipo") not in FRASES["regalos"]:
            val.error("regalos.tipo", f"opciones: {', '.join(FRASES['regalos'])}")
        elif reg["tipo"] == "mesa_regalos" and not es_url(reg.get("link")):
            val.error("regalos.link", "la mesa de regalos necesita un link https://")

    for k, banco in (("reglas", "reglas"), ("politica", "politica")):
        for item in ev.get(k, []):
            if item not in FRASES[banco]:
                val.error(k, f"{item!r} no existe; opciones: {', '.join(FRASES[banco])}")

    galeria = ev.get("galeria", [])
    if len(galeria) > MAX_GALERIA:
        val.error("galeria", f"máximo {MAX_GALERIA} fotos")
    if galeria and not con_fotos:
        val.aviso("galeria", "hay fotos pero con_fotos es false; no se mostrarán")
    for f in galeria:
        if not FOTO_RE.match(f):
            val.error("galeria", f"nombre de archivo inválido {f!r}")

    tag = ev.get("hashtag")
    if tag and not re.match(r"^#\w+$", tag):
        val.error("hashtag", "empieza con # y sin espacios")

    reemplazos = ev.get("reemplazos") or []
    if not isinstance(reemplazos, list) or len(reemplazos) > 10:
        val.error("reemplazos", "lista de máximo 10 cambios de títulos")
    else:
        for r in reemplazos:
            if not (isinstance(r, dict) and str(r.get("de", "")).strip() and str(r.get("a", "")).strip()):
                val.error("reemplazos", "cada cambio necesita el texto actual y el nuevo")
            elif len(r["a"]) > 60:
                val.error("reemplazos", f"«{r['a'][:20]}…»: máximo 60 caracteres")

    # --- Confirmación ----------------------------------------------------
    conf = ev.get("confirmacion") or {}
    metodo = conf.get("metodo")
    if metodo == "whatsapp":
        if not WHATSAPP_RE.match(str(conf.get("whatsapp", ""))):
            val.error("confirmacion.whatsapp", "número con indicativo, ej. +57 300 000 0000")
    elif metodo == "enlace":
        if not es_url(conf.get("link")):
            val.error("confirmacion.link", "falta el enlace https:// del formulario del cliente")
    else:
        val.error("confirmacion.metodo", "debe ser 'whatsapp' o 'enlace'")
    limite = fecha_iso(conf.get("fecha_limite"), "confirmacion.fecha_limite", val)
    if limite and fecha and limite >= fecha:
        val.error("confirmacion.fecha_limite", "debe ser antes del evento")

    # --- Secciones que la plantilla no muestra ---------------------------
    if plantilla:
        usadas = {"familia", "cita", "vestimenta", "regalos", "reglas", "politica", "galeria", "hashtag"}
        for s in usadas:
            if ev.get(s) and s not in plantilla["secciones"]:
                val.aviso(s, "tiene datos pero esta plantilla no muestra esa sección")

    return val


def main(rutas):
    if not rutas:
        print(__doc__)
        return 1
    total_errores = 0
    for ruta in rutas:
        try:
            ev = json.loads(Path(ruta).read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as e:
            print(f"✗ {ruta}\n  no se pudo leer: {e}")
            total_errores += 1
            continue
        val = validar(ev)
        print(("✗ " if val.errores else "✓ ") + ruta)
        for e in val.errores:
            print("  error  " + e)
        for a in val.avisos:
            print("  aviso  " + a)
        total_errores += len(val.errores)
    return 1 if total_errores else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
