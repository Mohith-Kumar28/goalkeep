#!/usr/bin/env bash
# Ships the current commit to goalkeep.org (the goalkeep-v4 worker and its
# goalkeep-site database). Refuses a dirty tree, so what is live is always a
# commit you can find again.
set -euo pipefail
cd "$(dirname "$0")/.."

if [ -n "$(git status --porcelain)" ]; then
  echo "refusing to deploy production: commit or stash your changes first" >&2
  exit 1
fi

WRANGLER_CONFIG=wrangler.production.jsonc pnpm build
NAME=$(node -e 'console.log(JSON.parse(require("fs").readFileSync("dist/server/wrangler.json","utf8")).name)')
if [ "$NAME" != "goalkeep-v4" ]; then
  echo "refusing to deploy production: build targets '$NAME', expected goalkeep-v4" >&2
  exit 1
fi
npx wrangler d1 migrations apply goalkeep-site --remote -c wrangler.production.jsonc
npx wrangler deploy
echo "deployed $(git rev-parse --short HEAD) to goalkeep.org"
