# kc-basic-eventos (privado)

Invitaciones de clientes de KC Basic. **Este repositorio debe ser privado**: tiene nombres,
teléfonos, direcciones y fotos de clientes.

- `eventos/<slug>.json` y `fotos/<slug>/` los escribe la hoja "KC Basic · Pedidos"
  (menú KC Basic → Generar invitación). No se editan a mano.
- `.github/workflows/publicar.yml` junta estas invitaciones con las plantillas y demos del
  repositorio público `cgp2409/kc-basic` y publica todo en la rama `publicado` de ese
  repositorio, que Hostinger sirve en basic.kcdigitalmagic.com.
- Corre en cada evento nuevo, todos los días a las 6 a. m. (retira las invitaciones 5 días
  después del evento) y a mano desde Actions → Publicar invitaciones → Run workflow.
- Necesita el secreto `KC_PUBLICAR_TOKEN`: token de GitHub con permiso de escritura en
  `cgp2409/kc-basic`.
