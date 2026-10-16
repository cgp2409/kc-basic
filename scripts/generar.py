#!/usr/bin/env python3
"""Genera la página de una invitación KC Basic a partir de su archivo de evento.

Uso:
    python3 scripts/generar.py eventos/xv-ana-2611.json
    python3 scripts/generar.py eventos/xv-ana-2611.json --fotos fotos/xv-ana-2611
    python3 scripts/generar.py eventos/xv-ana-2611.json --autonomo vista.html   # un solo archivo, para previsualizar
    python3 scripts/generar.py eventos/*.json --demo                            # fotos de ejemplo si faltan

Salida normal:
    dist/assets/fuentes/*.woff2      compartidas por todas las invitaciones
    dist/<slug>/index.html           la invitación
    dist/<slug>/og.jpg               vista previa para WhatsApp y redes
    dist/<slug>/*.webp               fotos optimizadas

Requiere: pip install jinja2 pillow
"""
import argparse
import base64
import hashlib
import io
import json
import math
import random
import re
import shutil
import sys
from datetime import date, datetime, timedelta
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, select_autoescape
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "scripts"))
from validar import CATALOGO, FRASES, validar  # noqa: E402

PLANTILLAS = RAIZ / "plantillas"
FUENTES = PLANTILLAS / "_comun" / "fuentes"
BASE_URL = "https://basic.kcdigitalmagic.com"

DIAS = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]
MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto",
         "septiembre", "octubre", "noviembre", "diciembre"]
TIPOS = {"misa": "Misa", "ceremonia": "Ceremonia", "civil": "Ceremonia civil", "recepcion": "Recepción"}
DURACION_H = {"misa": 1, "ceremonia": 1, "civil": 1, "recepcion": 6}
NIVELES = {"etiqueta": "Etiqueta", "formal": "Formal", "semiformal": "Semiformal",
           "casual": "Casual", "tematico": "Temático"}

# Fuentes de cada tema: (familia, archivo, descriptor de peso)
FUENTES_TEMA = {
    "noche-dorada": [("Fraunces", "fraunces-latin-full-normal.woff2", "100 900")],
    "rosa-neon": [("Big Shoulders Display", "big-shoulders-display-latin-wght-normal.woff2", "100 900")],
    "lila-minimal": [("Instrument Serif", "instrument-serif-latin-400-normal.woff2", "400")],
}
CLASICA = [("Pinyon Script", "pinyon-script-latin-400-normal.woff2", "400", "normal"),
           ("Cormorant Garamond", "cormorant-garamond-latin-wght-normal.woff2", "300 700", "normal"),
           ("Cormorant Garamond", "cormorant-garamond-latin-wght-italic.woff2", "300 700", "italic")]
for _t in ("marfil-dorado", "cielo-plata", "rosa-palo"):
    FUENTES_TEMA[_t] = CLASICA
FUENTE_TEXTO = ("Figtree", "figtree-latin-wght-normal.woff2", "300 900")


# ---------------------------------------------------------------- utilidades
def data_uri(datos, mime):
    return f"data:{mime};base64,{base64.b64encode(datos).decode()}"


def hex_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def fecha_textos(ev):
    f = date.fromisoformat(ev["fecha"])
    lim = date.fromisoformat(ev["confirmacion"]["fecha_limite"])
    return {
        "dia": f.day,
        "mes": MESES[f.month - 1],
        "anio": f.year,
        "dia_semana": DIAS[f.weekday()],
        "larga": f"{DIAS[f.weekday()].capitalize()} {f.day} de {MESES[f.month - 1]} de {f.year}",
        "limite": f"{lim.day} de {MESES[lim.month - 1]}",
    }


def hora_textos(hhmm):
    h, m = map(int, hhmm.split(":"))
    h12 = h % 12 or 12
    ampm = "a. m." if h < 12 else "p. m."
    return f"{h12}:{m:02d}", ampm, "de la mañana" if h < 12 else ("de la tarde" if h < 19 else "de la noche")


# ---------------------------------------------------------- arte generativo
def arte_svg(semilla, mini=False):
    """Composición de anillos y estrellas única por evento. Usa currentColor para seguir el tema."""
    r = random.Random(semilla)
    if mini:
        w, h, cx, cy = 200, 200, 100, 100
        anillos = [(26 + i * 12, r.choice([0, 0, 3, 6])) for i in range(6)]
        disco = 22
        estrellas = []
    else:
        w, h = 400, 720
        cx, cy = r.uniform(130, 270), r.uniform(200, 330)
        disco = r.uniform(95, 135)
        anillos, radio = [], disco + r.uniform(18, 30)
        while radio < 700:
            anillos.append((radio, r.choice([0, 0, 0, 2, 5, 12])))
            radio += r.uniform(14, 46)
        estrellas = [(r.uniform(0, w), r.uniform(0, h * 0.75), r.uniform(.5, 1.8), r.uniform(.25, .9))
                     for _ in range(46)]
    partes = [f'<svg class="arte" viewBox="0 0 {w} {h}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">']
    partes.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{disco:.1f}" fill="currentColor" opacity=".16"/>')
    partes.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{disco:.1f}" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".8"/>')
    for i, (rad, guion) in enumerate(anillos):
        op = max(.08, .62 - i * (.05 if not mini else .08))
        dash = f' stroke-dasharray="{guion} {guion * 2.2:.1f}"' if guion else ""
        partes.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{rad:.1f}" fill="none" stroke="currentColor" stroke-width=".9" opacity="{op:.2f}"{dash}/>')
    if not mini:
        ang = r.uniform(0, math.tau)
        rad = anillos[2][0] if len(anillos) > 2 else disco * 1.5
        px, py = cx + rad * math.cos(ang), cy + rad * math.sin(ang)
        partes.append(f'<circle cx="{px:.1f}" cy="{py:.1f}" r="5" fill="currentColor"/>')
    for x, y, s, o in estrellas:
        partes.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{s:.2f}" fill="currentColor" opacity="{o:.2f}"/>')
    partes.append("</svg>")
    return "".join(partes)


# --------------------------------------------------------------------- fotos
def foto_demo(tema, ancho, alto, etiqueta):
    """Imagen de ejemplo honesta: degradado del tema con la etiqueta 'Aquí va tu foto'."""
    fondo, acento = hex_rgb(tema["fondo"]), hex_rgb(tema["acento"])
    img = Image.new("RGB", (ancho, alto), fondo)
    capa = Image.new("RGB", (ancho, alto), acento)
    mascara = Image.new("L", (ancho, alto), 0)
    d = ImageDraw.Draw(mascara)
    d.ellipse((ancho * .15, alto * .12, ancho * .85, alto * .62), fill=150)
    d.ellipse((ancho * .05, alto * .55, ancho * .95, alto * 1.25), fill=110)
    mascara = mascara.filter(ImageFilter.GaussianBlur(ancho * .08))
    img = Image.composite(capa, img, mascara)
    d = ImageDraw.Draw(img)
    fuente = ImageFont.truetype(str(FUENTES / "og" / "fraunces-latin-500-normal.woff"), max(22, ancho // 18))
    caja = d.textbbox((0, 0), etiqueta, font=fuente)
    d.text(((ancho - caja[2]) / 2, alto * .06), etiqueta, font=fuente, fill=hex_rgb(tema["tinta"]))
    return img


def procesar_foto(origen, maximo, demo_tema=None, demo_tam=None, etiqueta=""):
    if origen and origen.exists():
        img = ImageOps.exif_transpose(Image.open(origen)).convert("RGB")
    elif demo_tema:
        img = foto_demo(demo_tema, *demo_tam, etiqueta)
    else:
        raise FileNotFoundError(f"No encuentro la foto {origen}. Usa --fotos o --demo.")
    img.thumbnail((maximo, maximo), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, "WEBP", quality=80, method=6)
    return buf.getvalue()


# ------------------------------------------------------------ imagen social
def imagen_og(ev, tema, nombre, fecha):
    W, H = 1200, 630
    fondo, tinta, acento = hex_rgb(tema["fondo"]), hex_rgb(tema["tinta"]), hex_rgb(tema["acento"])
    img = Image.new("RGB", (W, H), fondo)
    d = ImageDraw.Draw(img)
    disp = str(FUENTES / "og" / tema["og_display"])
    mayus = tema.get("og_mayusculas")

    # XV en contorno a la derecha
    tam_xv = 520
    while tam_xv > 200:
        xv = ImageFont.truetype(disp, tam_xv)
        if d.textlength("XV", font=xv) <= 440:
            break
        tam_xv -= 10
    ancho_xv = d.textlength("XV", font=xv)
    d.text((W - 40, H / 2 + 10), "XV", font=xv, anchor="rm", fill=fondo, stroke_width=3, stroke_fill=acento)
    max_nombre = W - 40 - ancho_xv - 70 - 40

    # Nombre, ajustado al ancho disponible
    texto = nombre.upper() if mayus else nombre
    disp_nombre = str(FUENTES / "og" / tema.get("og_nombre", tema["og_display"]))
    tam = 150
    while tam > 60:
        f = ImageFont.truetype(disp_nombre, tam)
        if d.textlength(texto, font=f) <= max_nombre:
            break
        tam -= 6
    d.text((70, 300), texto, font=f, fill=tinta, anchor="ls")
    cuerpo = ImageFont.truetype(str(FUENTES / "og" / tema.get("og_cuerpo", "fraunces-latin-500-normal.woff")), 36)
    d.text((72, 380), "Mis XV años", font=cuerpo, fill=acento)
    d.text((72, 440), fecha["larga"], font=cuerpo, fill=tinta)
    buf = io.BytesIO()
    img.save(buf, "JPEG", quality=86, optimize=True)
    return buf.getvalue()


# ------------------------------------------------------------------ contexto
def construir(ev, fotos_dir, autonomo, demo, para_demo=None, cupos_demo=None):
    tema = CATALOGO["temas"][ev["tema"]]
    nombre = ev["portada"]["nombres"][0].strip()
    fecha = fecha_textos(ev)
    archivos = {}  # nombre de salida -> bytes

    def poner_foto(campo, nombre_archivo, maximo, tam_demo, etiqueta):
        if not nombre_archivo:
            return None
        origen = fotos_dir / nombre_archivo if fotos_dir else None
        datos = procesar_foto(origen, maximo, tema if demo else None, tam_demo, etiqueta)
        salida = Path(nombre_archivo).stem + ".webp"
        if autonomo:
            return data_uri(datos, "image/webp")
        archivos[salida] = datos
        return salida

    con_fotos = ev.get("con_fotos")
    fotos = {"portada": None, "cierre": None, "galeria": []}
    if con_fotos:
        fotos["portada"] = poner_foto("portada", ev["portada"].get("foto"), 1600, (900, 1400), "Aquí va tu foto de portada")
        fotos["cierre"] = poner_foto("cierre", (ev.get("cierre") or {}).get("foto"), 1200, (900, 1125), "Aquí va tu foto de cierre")
        fotos["galeria"] = [poner_foto("galeria", g, 1200, (900, 1125), f"Foto {i + 1} de tu galería")
                            for i, g in enumerate(ev.get("galeria", []))]

    def frase(bloque, banco):
        b = ev.get(bloque) or {}
        if b.get("texto_propio"):
            return b["texto_propio"]
        if b.get("frase_id"):
            return FRASES[banco][b["frase_id"]]
        return None

    textos = {"mensaje": frase("mensaje", "invitacion"), "cita": frase("cita", "cita"), "cierre": frase("cierre", "cierre")}

    momentos, datos_m = [], []
    for m in ev["momentos"]:
        hora, ampm, ampm_texto = hora_textos(m["hora"])
        inicio = datetime.fromisoformat(f"{ev['fecha']}T{m['hora']}")
        fin = inicio + timedelta(hours=DURACION_H[m["tipo"]])
        momentos.append({**m, "hora_texto": hora, "ampm": ampm, "ampm_texto": ampm_texto,
                         "tipo_texto": TIPOS[m["tipo"]]})
        datos_m.append({"titulo": f"XV años de {nombre}: {TIPOS[m['tipo']].lower()}",
                        "inicio": inicio.isoformat(), "fin": fin.isoformat(),
                        "lugar": m["lugar"], "direccion": m.get("direccion", "")})

    vest = ev.get("vestimenta")
    vestimenta = None
    if vest:
        vestimenta = {"nivel_texto": NIVELES[vest["nivel"]], "nota": vest.get("nota"),
                      "colores": [{"nombre": c, "hex": CATALOGO["colores_hex"][c]} for c in vest.get("colores_reservados", [])]}

    reg = ev.get("regalos")
    regalos = {"texto": FRASES["regalos"][reg["tipo"]], "link": reg.get("link")} if reg else None

    familia = {k: [x for x in (ev.get("familia") or {}).get(k, []) if x] for k in ("padres", "padrinos")}

    # Fuentes
    css_fuentes, precarga = [], []
    lista_f = FUENTES_TEMA[ev["tema"]]
    if CATALOGO["plantillas"][ev["plantilla"]].get("fuente_texto", True):
        lista_f = lista_f + [FUENTE_TEXTO]
    for familia_f, archivo, peso, *estilo in lista_f:
        estilo = estilo[0] if estilo else "normal"
        ruta = FUENTES / archivo
        url = data_uri(ruta.read_bytes(), "font/woff2") if autonomo else f"../assets/fuentes/{archivo}"
        css_fuentes.append(f'@font-face{{font-family:"{familia_f}";src:url("{url}") format("woff2");'
                           f'font-weight:{peso};font-style:{estilo};font-display:swap}}')
        if not autonomo:
            precarga.append(url)

    plantilla_dir = PLANTILLAS / ev["plantilla"]
    semilla = int(hashlib.sha256(ev["slug"].encode()).hexdigest(), 16) % (2 ** 32)
    url = f"{BASE_URL}/{ev['slug']}/"
    og = imagen_og(ev, tema, nombre, fecha)
    if not autonomo:
        archivos["og.jpg"] = og

    ctx = {
        "ev": ev, "tema": tema, "nombre": nombre,
        "nombre_corto": nombre.split()[0],
        "inicial": nombre[0].upper(),
        "nombre_letras": [list(p) for p in nombre.split()],
        "fecha": fecha, "textos": textos, "momentos": momentos, "familia": familia,
        "vestimenta": vestimenta, "regalos": regalos,
        "reglas": [FRASES["reglas"][x] for x in ev.get("reglas", [])],
        "avisos": [FRASES["politica"][x] for x in ev.get("politica", [])],
        "fotos": fotos,
        "arte": arte_svg(semilla), "arte_mini": arte_svg(semilla, mini=True),
        "css": (plantilla_dir / "estilo.css").read_text(encoding="utf-8"),
        "css_fuentes": "\n".join(css_fuentes), "fuentes_precarga": precarga,
        "js": (PLANTILLAS / "_comun" / "invitacion.js").read_text(encoding="utf-8"),
        "favicon": (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="{tema["fondo"]}"/>'
                    f'<text x="32" y="44" font-family="Georgia,serif" font-size="34" text-anchor="middle" fill="{tema["acento"]}">XV</text></svg>'),
        "url": url, "og_url": None if autonomo else url + "og.jpg",
        "datos_js": {"slug": ev["slug"], "nombre": nombre, "url": url, "inicio": datos_m[0]["inicio"],
                     "momentos": datos_m, "confirmacion": ev["confirmacion"],
                     "para_demo": para_demo, "cupos_demo": cupos_demo},
    }
    env = Environment(loader=FileSystemLoader(str(plantilla_dir)), autoescape=select_autoescape(["j2", "html"]))
    html = env.get_template("plantilla.html.j2").render(**ctx)
    return html, archivos, og


def a_fragmento(html):
    """Convierte la página completa en un fragmento: el visor de claude.ai pone su propio esqueleto."""
    attrs = re.search(r"<html([^>]*)>", html).group(1)
    tema = re.search(r'data-tema="([^"]+)"', attrs).group(1)
    clase = re.search(r'class="([^"]+)"', attrs).group(1)
    cabeza = re.search(r"<head>(.*)</head>", html, re.S).group(1)
    cuerpo = re.search(r"<body>(.*)</body>", html, re.S).group(1)
    titulo = re.search(r"<title>.*?</title>", cabeza).group(0)
    estilos = re.search(r"<style>.*?</style>", cabeza, re.S).group(0)
    previo = (f'<script>var r=document.documentElement;r.setAttribute("data-tema","{tema}");'
              f'r.classList.add("{clase}","js");if(!matchMedia("(prefers-reduced-motion: reduce)").matches)r.classList.add("anima");</script>')
    return "\n".join([titulo, '<meta name="claude:viewport-fit-sides" content="cover">', previo, estilos, cuerpo])


def main():
    ap = argparse.ArgumentParser(description="Genera invitaciones KC Basic")
    ap.add_argument("eventos", nargs="+", type=Path)
    ap.add_argument("--fotos", type=Path, help="carpeta de fotos (por defecto fotos/<slug>)")
    ap.add_argument("--salida", type=Path, default=RAIZ / "dist")
    ap.add_argument("--autonomo", type=Path, help="genera un único HTML con todo incrustado (solo con un evento)")
    ap.add_argument("--demo", action="store_true", help="usa fotos de ejemplo cuando falten")
    ap.add_argument("--artifacto", action="store_true", help="con --autonomo: fragmento listo para publicar como vista previa en claude.ai")
    ap.add_argument("--para-demo", help="invitado de ejemplo cuando el enlace no trae ?para=")
    ap.add_argument("--cupos-demo", type=int, help="cupos de ejemplo cuando el enlace no trae ?cupos=")
    a = ap.parse_args()

    if a.autonomo and len(a.eventos) != 1:
        ap.error("--autonomo funciona con un solo evento")

    fallos = 0
    for ruta in a.eventos:
        ev = json.loads(ruta.read_text(encoding="utf-8"))
        val = validar(ev)
        if val.errores:
            print(f"✗ {ruta}: no se genera, tiene errores:")
            for e in val.errores:
                print("   " + e)
            fallos += 1
            continue
        if CATALOGO["plantillas"][ev["plantilla"]]["estado"] == "pendiente":
            print(f"✗ {ruta}: la plantilla {ev['plantilla']} todavía no existe")
            fallos += 1
            continue
        fotos_dir = a.fotos or (RAIZ / "fotos" / ev["slug"])
        try:
            html, archivos, og = construir(ev, fotos_dir, bool(a.autonomo), a.demo, a.para_demo, a.cupos_demo)
        except FileNotFoundError as e:
            print(f"✗ {ruta}: {e}")
            fallos += 1
            continue

        if a.autonomo:
            if a.artifacto:
                html = a_fragmento(html)
            a.autonomo.parent.mkdir(parents=True, exist_ok=True)
            a.autonomo.write_text(html, encoding="utf-8")
            a.autonomo.with_suffix(".og.jpg").write_bytes(og)
            print(f"✓ {a.autonomo} ({len(html) // 1024} KB)")
            continue

        destino = a.salida / ev["slug"]
        if destino.exists():
            shutil.rmtree(destino)
        destino.mkdir(parents=True)
        (destino / "index.html").write_text(html, encoding="utf-8")
        for nombre, datos in archivos.items():
            (destino / nombre).write_bytes(datos)
        fuentes_dest = a.salida / "assets" / "fuentes"
        fuentes_dest.mkdir(parents=True, exist_ok=True)
        for f in FUENTES.glob("*.woff2"):
            shutil.copy2(f, fuentes_dest / f.name)
        peso = sum(p.stat().st_size for p in destino.iterdir()) // 1024
        print(f"✓ {destino}/index.html ({peso} KB con fotos)")
        for aviso in val.avisos:
            print("   aviso " + aviso)
    return 1 if fallos else 0


if __name__ == "__main__":
    sys.exit(main())
