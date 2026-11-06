"""Construye el logo del sobre KC (SVG + PNG) con la paleta de la web."""
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
import subprocess

CIRUELA = "#8E2A7E"
CREMA = "#F7EFE5"
PAPEL = "#FFFCF7"
ROSA = "#F2C4DE"      # frente del sobre
ROSA_OSC = "#E7A9CD"  # interior / solapa
ROSA_LINEA = "#D98DB8"
ORO = "#B8955A"

FONT = TTFont("package/files/cormorant-garamond-latin-700-italic.woff")


def text_path(txt, target_w, cx, baseline_y, letter=-10):
    """Devuelve <path> del texto convertido a curvas, centrado en cx."""
    gs = FONT.getGlyphSet()
    cmap = FONT.getBestCmap()
    upm = FONT["head"].unitsPerEm
    parts, x = [], 0
    xmin, xmax = None, None
    for ch in txt:
        gname = cmap[ord(ch)]
        pen = SVGPathPen(gs)
        gs[gname].draw(pen)
        bp = BoundsPen(gs)
        gs[gname].draw(bp)
        if bp.bounds:
            b = bp.bounds
            xmin = b[0] + x if xmin is None else min(xmin, b[0] + x)
            xmax = b[2] + x if xmax is None else max(xmax, b[2] + x)
        parts.append((x, pen.getCommands()))
        x += gs[gname].width + letter
    s = target_w / (xmax - xmin)
    ox = cx - (xmin + (xmax - xmin) / 2) * s
    out = []
    for dx, d in parts:
        out.append(
            f'<path d="{d}" transform="translate({ox + dx * s:.2f} {baseline_y}) scale({s:.4f} {-s:.4f})"/>'
        )
    return "\n    ".join(out), s * upm


def sparkle(cx, cy, r, color=ORO):
    k = r * 0.22
    return (
        f'<path d="M{cx} {cy - r} C{cx + k} {cy - k} {cx + k} {cy - k} {cx + r} {cy} '
        f'C{cx + k} {cy + k} {cx + k} {cy + k} {cx} {cy + r} '
        f'C{cx - k} {cy + k} {cx - k} {cy + k} {cx - r} {cy} '
        f'C{cx - k} {cy - k} {cx - k} {cy - k} {cx} {cy - r}Z" fill="{color}"/>'
    )


def icono(bg=None):
    kc, _ = text_path("KC", 350, 540, 565)
    fondo = f'<rect width="1080" height="1080" fill="{bg}"/>' if bg else ""
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">
  <title>KC Digital Magic</title>
  {fondo}
  <g transform="translate(540 540) scale(1.1) translate(-540 -555)">
  <!-- interior del sobre y solapa abierta -->
  <path d="M200 470 L540 215 L880 470 V860 Q880 890 850 890 H230 Q200 890 200 860 Z" fill="{ROSA_OSC}"/>
  <!-- tarjeta -->
  <rect x="300" y="270" width="480" height="470" rx="22" fill="{PAPEL}"/>
  <rect x="322" y="292" width="436" height="426" rx="14" fill="none" stroke="{ORO}" stroke-opacity=".55" stroke-width="4"/>
  <g fill="{CIRUELA}">
    {kc}
  </g>
  <!-- frente del sobre (bolsillo en V) -->
  <path d="M200 520 L540 735 L880 520 V860 Q880 890 850 890 H230 Q200 890 200 860 Z" fill="{ROSA}"/>
  <path d="M200 860 L470 690 M880 860 L610 690" stroke="{ROSA_LINEA}" stroke-width="5" stroke-linecap="round" fill="none" opacity=".55"/>
  <path d="M200 520 L540 735 L880 520" stroke="{ROSA_LINEA}" stroke-width="5" stroke-linejoin="round" fill="none" opacity=".7"/>
  <!-- sello de cera ciruela -->
  <circle cx="540" cy="735" r="50" fill="{CIRUELA}"/>
  <circle cx="540" cy="735" r="38" fill="none" stroke="{CREMA}" stroke-opacity=".5" stroke-width="3"/>
  <path d="M540 756 C516 740 510 726 518 716 C526 706 538 710 540 720 C542 710 554 706 562 716 C570 726 564 740 540 756Z" fill="{CREMA}"/>
  <!-- destellos -->
  {sparkle(838, 236, 44)}
  {sparkle(244, 330, 26)}
  {sparkle(890, 360, 18)}
  </g>
</svg>
'''


def favicon():
    kc, _ = text_path("KC", 40, 32, 38, letter=-20)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect x="2" y="2" width="60" height="60" rx="14" fill="{ROSA}"/>
  <path d="M2 30 L32 46 L62 30" fill="none" stroke="{ROSA_LINEA}" stroke-width="2.5"/>
  <g fill="{CIRUELA}">
    {kc}
  </g>
</svg>
'''


open("kc-logo.svg", "w").write(icono())
open("kc-perfil.svg", "w").write(icono(bg=CREMA))
open("favicon.svg", "w").write(favicon())

for src, out, size in [
    ("kc-perfil.svg", "kc-perfil-1080.png", 1080),
    ("kc-logo.svg", "kc-logo-512.png", 512),
    ("favicon.svg", "favicon-64.png", 64),
]:
    subprocess.run(["rsvg-convert", "-w", str(size), "-h", str(size), src, "-o", out], check=True)
print("ok")
