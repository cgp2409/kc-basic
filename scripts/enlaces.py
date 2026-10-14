#!/usr/bin/env python3
"""Crea un enlace personalizado por invitado y el mensaje listo para enviar por WhatsApp.

Cada invitado ve su nombre al abrir ("Hola, Familia Pérez") y el contador de
confirmación arranca en sus cupos. No necesita servidor: todo va en el enlace.

Uso:
    python3 scripts/enlaces.py eventos/xv-ana-2611.json invitados/xv-ana-2611.csv

El CSV de invitados lleva estas columnas (la primera fila son los títulos):
    nombre,cupos,telefono
    Familia Pérez,4,+57 300 111 2222
    Tía Marta,1,

Salida: invitados/<slug>-enlaces.csv con el enlace, el mensaje y un enlace wa.me
para abrir el chat con el mensaje escrito (el envío lo hace una persona, uno a uno).
"""
import csv
import json
import sys
from pathlib import Path
from urllib.parse import quote, urlencode

sys.path.insert(0, str(Path(__file__).resolve().parent))
from generar import BASE_URL, fecha_textos  # noqa: E402

MENSAJE = ("Hola, {saludo}. Con mucha alegría te invito a mis XV años, el {fecha}. "
           "Aquí está tu invitación: {enlace}")


def main(evento, invitados):
    ev = json.loads(Path(evento).read_text(encoding="utf-8"))
    fecha = fecha_textos(ev)["larga"].lower()
    nombre = ev["portada"]["nombres"][0].split()[0]
    salida = Path(invitados).with_name(f"{ev['slug']}-enlaces.csv")
    filas = 0
    with open(invitados, encoding="utf-8-sig", newline="") as f, \
            open(salida, "w", encoding="utf-8-sig", newline="") as out:
        w = csv.writer(out)
        w.writerow(["nombre", "cupos", "telefono", "enlace", "mensaje", "abrir_whatsapp"])
        for fila in csv.DictReader(f):
            invitado = (fila.get("nombre") or "").strip()
            if not invitado:
                continue
            params = {"para": invitado}
            cupos = (fila.get("cupos") or "").strip()
            if cupos.isdigit() and 1 <= int(cupos) <= 20:
                params["cupos"] = cupos
            enlace = f"{BASE_URL}/{ev['slug']}/?{urlencode(params, quote_via=quote)}"
            mensaje = MENSAJE.format(saludo=invitado, fecha=fecha, enlace=enlace) + f"\n{nombre}"
            tel = "".join(c for c in (fila.get("telefono") or "") if c.isdigit())
            wa = f"https://wa.me/{tel}?text={quote(mensaje)}" if tel else ""
            w.writerow([invitado, cupos, fila.get("telefono", ""), enlace, mensaje, wa])
            filas += 1
    print(f"✓ {salida} ({filas} invitados)")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)
    main(sys.argv[1], sys.argv[2])
