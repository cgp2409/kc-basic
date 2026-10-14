# Formulario de ingreso KC Basic — XV (Google Forms)

Un formulario por tipo de evento. Este es el de XV. Cada pregunta indica el tipo de pregunta en Google Forms y el campo del archivo del evento que llena.

**Configuración del formulario**

- Recopilar correos: sí (para saber de quién es cada respuesta).
- Limitar a 1 respuesta: no (a veces mamá y quinceañera lo llenan juntas en dos intentos).
- Las opciones del banco de frases llevan su ID entre corchetes al final, por ejemplo `[xv-inv-03]`. No borres ese ID al editar el texto: es lo que se guarda en el archivo del evento.
- Las preguntas de carga de archivos obligan al cliente a iniciar sesión con Google. Por eso las fotos van en una sección aparte, y la descripción ofrece enviarlas por WhatsApp a quien no tenga cuenta.

---

## Sección 1 — Tu invitación

| # | Pregunta | Tipo | Obligatoria | Opciones / validación | Campo |
| --- | --- | --- | --- | --- | --- |
| 1.1 | Nombre de la quinceañera, tal como debe aparecer | Respuesta corta | Sí | Máx. 30 caracteres | `portada.nombres[0]` |
| 1.2 | Fecha del evento | Fecha | Sí | — | `fecha` |
| 1.3 | País del evento | Lista desplegable | Sí | Colombia · México · España · Otro | `pais` |
| 1.4 | Diseño elegido | Opción múltiple | Sí | Moderna Póster · Moderna Galería (con enlace a las demos en la descripción) | `plantilla` |
| 1.5 | Tema de color | Opción múltiple | Sí | Noche dorada · Rosa neón · Lila minimal | `tema` |
| 1.6 | ¿Tu invitación lleva fotos? | Opción múltiple | Sí | Sí, con fotos → ir a sección 7 al final · No, sin fotos (usamos ilustraciones) | `con_fotos` |

## Sección 2 — Lugares y horas

Máximo 2 momentos. Si solo hay fiesta, deja el momento 2 en blanco.

| # | Pregunta | Tipo | Obligatoria | Opciones / validación | Campo |
| --- | --- | --- | --- | --- | --- |
| 2.1 | Momento 1: ¿qué es? | Opción múltiple | Sí | Misa · Ceremonia · Recepción / fiesta | `momentos[0].tipo` |
| 2.2 | Momento 1: nombre del lugar | Respuesta corta | Sí | Máx. 50 | `momentos[0].lugar` |
| 2.3 | Momento 1: dirección | Respuesta corta | Sí | Máx. 80 | `momentos[0].direccion` |
| 2.4 | Momento 1: hora | Hora | Sí | — | `momentos[0].hora` |
| 2.5 | Momento 1: link de Google Maps | Respuesta corta | Sí | Validación: contiene `https://` | `momentos[0].mapa` |
| 2.6–2.10 | Lo mismo para el momento 2 | Igual | No | Igual | `momentos[1]` |

Descripción de la sección: "Para copiar el link: abre el lugar en Google Maps → Compartir → Copiar enlace."

## Sección 3 — Familia

| # | Pregunta | Tipo | Obligatoria | Opciones / validación | Campo |
| --- | --- | --- | --- | --- | --- |
| 3.1 | ¿Mostramos a los padres? | Opción múltiple | Sí | Sí · No | — |
| 3.2 | Nombre del papá o la mamá (línea 1) | Respuesta corta | No | Máx. 40. Si lleva ✞, escríbelo | `familia.padres[0]` |
| 3.3 | Línea 2 | Respuesta corta | No | Máx. 40 | `familia.padres[1]` |
| 3.4 | Padrinos (línea 1) | Respuesta corta | No | Máx. 40. Una pareja puede ir en una línea: "Marta y Julián" | `familia.padrinos[0]` |
| 3.5 | Padrinos (línea 2) | Respuesta corta | No | Máx. 40 | `familia.padrinos[1]` |

## Sección 4 — Textos

| # | Pregunta | Tipo | Obligatoria | Opciones | Campo |
| --- | --- | --- | --- | --- | --- |
| 4.1 | Frase de invitación | Opción múltiple con "Otro" | Sí | Las 5 frases `xv-inv-*` del banco, cada una con su ID. "Otro" = texto propio de máx. 280 caracteres | `mensaje.frase_id` o `mensaje.texto_propio` |
| 4.2 | Cita o frase especial | Opción múltiple | No | Las del banco `cita-*` · Ninguna | `cita.frase_id` |
| 4.3 | Frase de cierre | Opción múltiple | Sí | Las 3 frases `cierre-*` | `cierre.frase_id` |

## Sección 5 — Detalles de la fiesta

| # | Pregunta | Tipo | Obligatoria | Opciones | Campo |
| --- | --- | --- | --- | --- | --- |
| 5.1 | Código de vestimenta | Opción múltiple | Sí | Etiqueta · Formal · Semiformal · Casual · Temático · No mostrar | `vestimenta.nivel` |
| 5.2 | Colores reservados (que los invitados no usen) | Casillas | No | Paleta de `data/catalogo.json` → `colores_reservables` | `vestimenta.colores_reservados` |
| 5.3 | Nota de vestimenta | Respuesta corta | No | Máx. 140 | `vestimenta.nota` |
| 5.4 | Regalos | Opción múltiple | Sí | Lluvia de sobres · Mesa de regalos (pide link) · Solo tu presencia · No mostrar | `regalos.tipo` |
| 5.5 | Link de la mesa de regalos | Respuesta corta | No | Validación: contiene `https://` | `regalos.link` |
| 5.6 | Reglas de la noche | Casillas | No | Las 5 del banco `reglas` | `reglas` |
| 5.7 | Avisos para los invitados | Casillas | No | Las 4 del banco `politica` | `politica` |
| 5.8 | Hashtag para redes | Respuesta corta | No | Validación: empieza con `#`, sin espacios | `hashtag` |

## Sección 6 — Confirmación de asistencia

| # | Pregunta | Tipo | Obligatoria | Opciones / validación | Campo |
| --- | --- | --- | --- | --- | --- |
| 6.1 | ¿Cómo confirman los invitados? | Opción múltiple | Sí | Por WhatsApp · Con un enlace mío (formulario propio) | `confirmacion.metodo` |
| 6.2 | Número de WhatsApp con indicativo | Respuesta corta | No | Ej. +57 300 000 0000 | `confirmacion.whatsapp` |
| 6.3 | Enlace de tu formulario | Respuesta corta | No | Validación: contiene `https://` | `confirmacion.link` |
| 6.4 | Fecha límite para confirmar | Fecha | Sí | Antes del evento | `confirmacion.fecha_limite` |
| 6.5 | Autorizo publicar los datos y fotos de este formulario en la invitación, y acepto que la página se despublica 5 días después del evento | Casillas | Sí | Una sola casilla | — |

Si el cliente eligió "sin fotos" en 1.6, el formulario termina aquí.

## Sección 7 — Fotos (solo versión con fotos)

Descripción de la sección: "Sube fotos originales, no capturas de WhatsApp. Mínimo 1080 px en el lado corto, sin texto ni marcos encima. Nosotros las recortamos. Si no tienes cuenta de Google, envíalas a nuestro WhatsApp como documento."

| # | Pregunta | Tipo | Obligatoria | Límite | Campo |
| --- | --- | --- | --- | --- | --- |
| 7.1 | Foto de portada (vertical) | Subir archivo | Sí | 1 archivo, imagen, 10 MB | `portada.foto` |
| 7.2 | Foto secundaria | Subir archivo | No | 1 archivo, imagen, 10 MB | `secundaria.foto` |
| 7.3 | Foto de cierre (vertical) | Subir archivo | No | 1 archivo, imagen, 10 MB | `cierre.foto` |
| 7.4 | Fotos para la galería | Subir archivo | No | Hasta 4 archivos, imagen, 10 MB c/u | `galeria` |

---

## De la respuesta al archivo del evento

1. Las respuestas caen en la hoja de cálculo del formulario; las fotos, en la carpeta de Drive del formulario.
2. Con la fila del cliente, se arma `eventos/<slug>.json`. El slug sale de 1.1 y 1.2: `xv-` + primer nombre sin tildes + `-` + año y mes (`xv-ana-2611`).
3. `despublicar` = fecha del evento + 5 días.
4. Se corre `python scripts/validar.py eventos/<slug>.json`. Si hay errores, se corrigen o se le pregunta al cliente solo por esos campos.
