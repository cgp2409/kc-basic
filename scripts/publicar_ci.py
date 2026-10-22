#!/usr/bin/env python3
"""Publicación automática (GitHub Actions del repositorio privado kc-basic-eventos).

Junta las demos de este repositorio con las invitaciones de clientes del repositorio
privado, genera todo en dist/ y escribe resultado.json para la hoja de pedidos.

Uso: python scripts/publicar_ci.py <carpeta del repo privado> <ruta de resultado.json>
"""
import json
import shutil
import subprocess
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "scripts"))
from validar import validar  # noqa: E402

BOGOTA = timezone(timedelta(hours=-5))


def main(privado, salida_resultado):
    privado = Path(privado)
    hoy = datetime.now(BOGOTA).date().isoformat()
    dist = RAIZ / "dist"
    shutil.rmtree(dist, ignore_errors=True)

    demos = sorted((RAIZ / "eventos").glob("*.json"))
    clientes, errores, retirados = [], {}, []
    for ruta in sorted((privado / "eventos").glob("*.json")):
        slug = ruta.stem
        try:
            ev = json.loads(ruta.read_text(encoding="utf-8"))
        except json.JSONDecodeError as e:
            errores[slug] = [f"archivo dañado: {e}"]
            continue
        if ev.get("despublicar") and ev["despublicar"] < hoy:
            retirados.append(slug)
            continue
        val = validar(ev)
        if val.errores:
            errores[slug] = val.errores
            continue
        origen = privado / "fotos" / slug
        if origen.is_dir():
            destino = RAIZ / "fotos" / slug
            shutil.rmtree(destino, ignore_errors=True)
            shutil.copytree(origen, destino)
        clientes.append(ruta)

    def generar(rutas, *extra):
        if not rutas:
            return ""
        r = subprocess.run([sys.executable, str(RAIZ / "scripts" / "generar.py"), *map(str, rutas), *extra],
                           capture_output=True, text=True)
        print(r.stdout, r.stderr, sep="")
        return r.stdout

    generar(demos, "--demo")
    salida = generar(clientes)
    publicados = []
    for ruta in clientes:
        slug = ruta.stem
        if (dist / slug / "index.html").exists():
            publicados.append(slug)
        else:
            lineas = [l.strip() for l in salida.splitlines() if slug in l and l.lstrip().startswith("✗")]
            errores[slug] = lineas or ["no se pudo generar (revisa las fotos)"]

    (dist / "index.html").write_text(
        '<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex">\n'
        '<meta http-equiv="refresh" content="0; url=https://kcdigitalmagic.com">\n'
        '<title>KC Digital Magic</title><a href="https://kcdigitalmagic.com">KC Digital Magic</a>\n', encoding="utf-8")
    (dist / "robots.txt").write_text("User-agent: *\nDisallow: /\n", encoding="utf-8")
    if (RAIZ / "capturas").is_dir():
        shutil.copytree(RAIZ / "capturas", dist / "capturas")
    # Marca: esta rama la publica la automatización (scripts/publicar.sh no debe pisarla)
    (dist / ".kc-automatico").write_text("publicado por kc-basic-eventos\n", encoding="utf-8")

    resultado = {"ok": not errores, "errores": errores, "publicados": publicados, "retirados": retirados,
                 "fecha": datetime.now(BOGOTA).isoformat(timespec="seconds")}
    Path(salida_resultado).write_text(json.dumps(resultado, ensure_ascii=False, indent=2), encoding="utf-8")
    for slug, errs in errores.items():
        for e in errs:
            print(f"::error title={slug}::{e}")
    print(f"Publicadas {len(publicados)} invitaciones de clientes; {len(errores)} con errores; {len(retirados)} retiradas.")
    return 0


if __name__ == "__main__":
    sys.exit(main(*sys.argv[1:3]))
