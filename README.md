# KC Basic

Invitaciones digitales de plantilla de KC Digital Magic, publicadas en `basic.kcdigitalmagic.com/<slug>/`.

Cada invitación es un archivo de datos (`eventos/<slug>.json`) que una plantilla convierte en página. El diseño vive en las plantillas y nunca se edita por evento.

## Flujo de una invitación

1. El cliente llena el Google Form (`docs/formulario.md`).
2. Con sus respuestas se arma `eventos/<slug>.json` y sus fotos van a `fotos/<slug>/`.
3. `python3 scripts/validar.py eventos/<slug>.json`
4. `python3 scripts/generar.py eventos/<slug>.json` → `dist/<slug>/`
5. Si el cliente compró envío a invitados: `python3 scripts/enlaces.py eventos/<slug>.json invitados/<slug>.csv` → un enlace personalizado y un mensaje de WhatsApp por invitado.
6. Se publica `dist/` en el subdominio.

Requisitos: Python 3.9+ y `pip install jinja2 pillow`. El validador solo usa la librería estándar.

## Estructura

```
data/
  catalogo.json      plantillas, temas, secciones por plantilla, paleta de colores
  frases.json        banco de frases (invitación, cita, reglas, avisos, regalos, cierre)
docs/
  formulario.md      Google Form de ingreso, pregunta por pregunta, con el campo que llena
eventos/             un archivo por invitación
fotos/<slug>/        fotos originales del cliente (no se suben a git)
invitados/           listas de invitados y enlaces generados (no se suben a git)
plantillas/
  _comun/            JavaScript común y fuentes (OFL)
  xv-moderna-poster/ plantilla.html.j2 + estilo.css
scripts/
  validar.py         revisa un evento contra el catálogo y el banco de frases
  generar.py         genera la página, la imagen para WhatsApp y las fotos optimizadas
  enlaces.py         enlaces personalizados por invitado
dist/                salida para publicar (no se sube a git)
```

## Qué trae cada invitación

- Telón de apertura que saluda al invitado y se abre con una animación: el XV se dibuja y el nombre aparece letra por letra.
- Invitado personalizado por enlace: `?para=Familia%20Pérez&cupos=4` muestra su nombre y fija los cupos del contador.
- Cuenta regresiva, lugares con "Cómo llegar" y "Agregar al calendario" (Google Calendar en Android, .ics en iPhone).
- Confirmación por WhatsApp con el mensaje ya escrito, o botón al formulario del cliente.
- Versión sin fotos con arte generativo único por evento.
- Imagen de vista previa para WhatsApp (`og.jpg`), `noindex`, sin librerías externas, 80–140 KB por página.
- Respeta "reducir movimiento" del sistema.

## Generar

```
python3 scripts/generar.py eventos/xv-ana-2611.json                  # usa fotos/xv-ana-2611/
python3 scripts/generar.py eventos/*.json --demo                     # fotos de ejemplo si faltan
python3 scripts/generar.py eventos/xv-sara-2612.json --autonomo vista.html   # un solo archivo con todo incrustado
```

Para vistas previas en claude.ai: `--autonomo vista.html --artifacto --para-demo "Familia Pérez" --cupos-demo 4`.

## Reglas

- **Slug**: `tipo-nombre-aamm`, en minúsculas, sin tildes ni ñ. Ejemplos: `xv-ana-2611`, `boda-ana-kyle-2611`. Nunca cambia después de publicar.
- **Fotos**: opcionales. Con `con_fotos: true` solo la portada es obligatoria; hasta 4 en galería.
- **Momentos**: 1 o 2 (misa, ceremonia, civil o recepción).
- **Confirmación**: WhatsApp del cliente (`metodo: "whatsapp"`) o su propio formulario (`metodo: "enlace"`). El sistema de confirmación de KC es solo de Premium.
- **Despublicar**: 5 días después del evento.
- **Textos**: se eligen del banco por ID. Texto propio solo en el mensaje principal, máximo 280 caracteres.

## Plantillas

| Plantilla | Tipo | Estado |
| --- | --- | --- |
| `xv-moderna-poster` | XV | Lista (temas: noche-dorada, rosa-neon, lila-minimal) |
| `xv-moderna-galeria` | XV | Pendiente |
| `boda-moderna-editorial` | Boda | Pendiente |
| `boda-moderna-minimal` | Boda | Pendiente |
