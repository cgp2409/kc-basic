#!/usr/bin/env bash
# Genera todas las invitaciones y sube el resultado a la rama "publicado".
# Hostinger despliega esa rama en basic.kcdigitalmagic.com (ver docs/publicar.md).
#
# Uso: scripts/publicar.sh            # usa fotos/<slug>/ de cada evento
#      scripts/publicar.sh --demo     # fotos de ejemplo donde falten
set -euo pipefail
cd "$(dirname "$0")/.."

# Si la rama ya la maneja la automatización (repositorio privado kc-basic-eventos con las
# invitaciones de clientes), publicar desde aquí las borraría.
git fetch -q origin publicado 2>/dev/null || true
if git cat-file -e origin/publicado:.kc-automatico 2>/dev/null && [ "${1:-}" != "--forzar-borrando-clientes" ]; then
  echo "✗ La publicación ahora es automática (GitHub Actions de kc-basic-eventos)." >&2
  echo "  Sube tus cambios a main y ejecuta allí «Publicar invitaciones» (Actions → Run workflow)," >&2
  echo "  o espera la publicación diaria de las 6 a. m." >&2
  exit 1
fi

python3 scripts/validar.py eventos/*.json
rm -rf dist
python3 scripts/generar.py eventos/*.json "$@"

# Página raíz: no lista las invitaciones, solo lleva a la web principal.
cat > dist/index.html <<'HTML'
<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0; url=https://kcdigitalmagic.com">
<title>KC Digital Magic</title><a href="https://kcdigitalmagic.com">KC Digital Magic</a>
HTML
printf 'User-agent: *\nDisallow: /\n' > dist/robots.txt
# Capturas de las demos para la web principal
[ -d capturas ] && cp -r capturas dist/

ORIGEN=$(git rev-parse --short HEAD)
TMP=$(mktemp -d)
git worktree add --detach "$TMP" >/dev/null
(
  cd "$TMP"
  git checkout --orphan publicado-tmp >/dev/null 2>&1
  git rm -rqf . >/dev/null 2>&1 || true
  cp -r "$OLDPWD/dist/." .
  git add -A
  git -c user.name="KC Basic" -c user.email="noreply@kcdigitalmagic.com" commit -qm "Publicación desde $ORIGEN"
  git push -f origin HEAD:publicado
)
git worktree remove --force "$TMP"
git branch -D publicado-tmp >/dev/null 2>&1 || true
echo "✓ Rama 'publicado' actualizada desde $ORIGEN"
