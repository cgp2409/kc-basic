# KC Basic

Invitaciones digitales de plantilla de KC Digital Magic, publicadas en `basic.kcdigitalmagic.com/<slug>`.

Cada invitación es un archivo de datos (`eventos/<slug>.json`) que una plantilla convierte en página. El diseño vive en las plantillas y nunca se edita por evento.

## Estructura

```
data/
  catalogo.json      plantillas, temas, secciones por plantilla, paleta de colores reservables
  frases.json        banco de frases (invitación, cita, reglas, avisos, regalos, cierre)
docs/
  formulario.md      Google Form de ingreso, pregunta por pregunta, con el campo que llena
eventos/
  <slug>.json        un archivo por invitación
scripts/
  validar.py         revisa un evento contra el catálogo y el banco de frases
```

Próximamente: `plantillas/` (HTML/CSS por plantilla y tema) y `scripts/generar.py` (arma `dist/<slug>/index.html`).

## Reglas

- **Slug**: `tipo-nombre-aamm`, en minúsculas, sin tildes ni ñ. Ejemplos: `xv-ana-2611`, `boda-ana-kyle-2611`. Nunca cambia después de publicar.
- **Fotos**: opcionales. Con `con_fotos: true` solo la portada es obligatoria; hasta 4 en galería.
- **Momentos**: 1 o 2 (misa, ceremonia, civil o recepción).
- **Confirmación**: Basic usa el WhatsApp del cliente (`metodo: "whatsapp"`) o su propio formulario (`metodo: "enlace"`). El sistema de confirmación de KC es solo de Premium.
- **Despublicar**: 5 días después del evento.
- **Textos**: se eligen del banco por ID. Texto propio solo en el mensaje principal, máximo 280 caracteres.

## Validar un evento

```
python3 scripts/validar.py eventos/xv-ana-2611.json
python3 scripts/validar.py eventos/*.json
```

Solo usa la librería estándar de Python 3.9 o superior. Sale con código 1 si hay errores; los avisos no bloquean.

## Plantillas

| Plantilla | Tipo | Estado |
| --- | --- | --- |
| `xv-moderna-poster` | XV | Piloto (temas: noche-dorada, rosa-neon, lila-minimal) |
| `xv-moderna-galeria` | XV | Pendiente |
| `boda-moderna-editorial` | Boda | Pendiente |
| `boda-moderna-minimal` | Boda | Pendiente |
