# Publicar en basic.kcdigitalmagic.com

Las invitaciones generadas viven en la rama `publicado` del repositorio. Hostinger toma esa rama y la pone en el subdominio. Las fotos originales y las listas de invitados nunca se suben: solo la página final con fotos optimizadas.

## Configuración (una sola vez)

1. En hPanel → **Dominios** → **Subdominios**, crea `basic` para `kcdigitalmagic.com`. Anota su carpeta, normalmente `public_html/basic` o `domains/basic.kcdigitalmagic.com/public_html`.
2. En hPanel → **Avanzado** → **Git**:
   - Repositorio: `https://github.com/cgp2409/kc-basic.git` (si el repo es privado, Hostinger te da una clave SSH para agregar en GitHub → Settings → Deploy keys, y usas `git@github.com:cgp2409/kc-basic.git`).
   - Rama: `publicado`.
   - Directorio: la carpeta del subdominio del paso 1.
3. Activa **Auto Deployment**: Hostinger te da una URL de webhook. Pégala en GitHub → Settings → Webhooks (tipo `application/json`, evento "push"). Desde ahí, cada publicación se despliega sola.
4. Activa SSL para el subdominio en hPanel → **Seguridad** → **SSL**.

## Cada vez que hay una invitación nueva o un cambio

```
scripts/publicar.sh
```

Valida todos los eventos, genera `dist/`, y sube el resultado a la rama `publicado`. Hostinger lo despliega por el webhook.

## Despublicar después del evento

Borra o mueve el archivo de `eventos/` (por ejemplo a `eventos/archivo/`) y vuelve a correr `scripts/publicar.sh`. La rama `publicado` se reescribe completa, así que la invitación desaparece del sitio.

## Revisar antes de publicar

- La vista previa en WhatsApp (`og.jpg`) solo funciona con la URL pública final. Para probarla, envíate el enlace a ti mismo.
- El archivo de calendario para iPhone solo funciona en la página publicada, no en vistas previas de claude.ai.
