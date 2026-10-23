# Botón «Generar invitación» en la hoja de pedidos

## Cómo funciona
1. La empleada hace clic en la fila del cliente → menú **KC Basic → Generar invitación**.
2. El script de la hoja (google/kc_basic_menu.gs) revisa la fila, arma el evento y, si lleva fotos,
   las toma de Drive › invitaciones › basic › fotos › <slug> (portada, galeria-1…4, cierre).
3. Sube el evento y las fotos al repositorio **privado** cgp2409/kc-basic-eventos.
4. GitHub Actions genera todas las invitaciones (demos + clientes) y las publica en la rama
   `publicado` de cgp2409/kc-basic → Hostinger → basic.kcdigitalmagic.com/<slug>/.
5. La hoja espera el resultado (1 a 3 min) y escribe el Enlace, el Estado «Generada» y la fecha
   de Despublicar; si hay errores, los muestra en español.

Los datos de clientes nunca entran al repositorio público.

## Instalación (una sola vez)
1. GitHub → New repository → nombre `kc-basic-eventos` → **Private** → Create.
2. GitHub → Settings → Developer settings → Fine-grained tokens → Generate new token:
   - Repository access: Only select repositories → `kc-basic` y `kc-basic-eventos`.
   - Permissions (Repository): Contents **Read and write**, Actions **Read and write**,
     Workflows **Read and write**, Metadata Read.
   - Expiración: 1 año (anotar la fecha para renovarlo).
3. kc-basic-eventos → Settings → Secrets and variables → Actions → New repository secret:
   nombre `KC_PUBLICAR_TOKEN`, valor: el token.
4. En un computador: hoja «KC Basic · Pedidos» → Extensiones → Apps Script → borrar todo,
   pegar google/kc_basic_cargador.gs, guardar. Recargar la hoja. El cargador trae solo la
   versión más reciente de google/kc_basic_menu.gs: las mejoras no requieren volver a pegar nada.
5. Menú KC Basic → Configurar GitHub (una vez) → pegar el mismo token. Google pide permisos
   la primera vez (Continuar → elegir la cuenta → Permitir). El script prepara el repositorio.

## Publicar cambios de plantillas
scripts/publicar.sh ya no se usa una vez activa la automatización (se niega para no borrar
las invitaciones de clientes). Sube los cambios a main de kc-basic y ejecuta
kc-basic-eventos → Actions → Publicar invitaciones → Run workflow, o espera la corrida diaria.

## Cambios que pide el cliente
- Datos (nombres, horas, lugares, textos, fotos): se corrigen en la fila (o en la carpeta de
  fotos) y se vuelve a Generar. El enlace no cambia.
- Títulos fijos del diseño («Qué ponerte», «Con mi familia», «Mis padrinos»…): columna
  **Cambios de títulos**, separados por punto y coma:
  `Con mi familia = Con la bendición de Dios; Qué ponerte = Dress code`.
  El texto actual se copia tal cual aparece en la invitación; si no existe, la hoja avisa.
