#!/usr/bin/env bash
# Deploys the archived variant of the site as its own Cloudflare Worker.
#
# `pnpm deploy` builds the working tree and ships the main `goalkeep` worker.
# This script never touches it: it builds a pinned commit inside a throwaway
# git worktree, forces wrangler.legacy.jsonc onto that build, and refuses to
# deploy if the resulting worker is named anything but the legacy one.
set -euo pipefail

COMMIT="03b54cc4dbb3a4dff0c4df0c60221fbffd75970c"
EXPECTED_NAME="goalkeep-legacy"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORKTREE="$ROOT/.legacy"
CONFIG="$ROOT/wrangler.legacy.jsonc"

cd "$ROOT"

# Rebuild the worktree from scratch each run so a stale checkout can't ship.
if [ -e "$WORKTREE" ]; then
  git worktree remove --force "$WORKTREE" 2>/dev/null || rm -rf "$WORKTREE"
fi
git worktree add --detach --force "$WORKTREE" "$COMMIT"

# That commit carries the main worker's wrangler.jsonc (name: goalkeep), so
# replace it in the worktree — the build can then only target the legacy name.
cp "$CONFIG" "$WORKTREE/wrangler.jsonc"

cd "$WORKTREE"
pnpm install --frozen-lockfile
pnpm build

# Last line of defence before anything reaches Cloudflare.
BUILT_NAME="$(node -p "require('./dist/server/wrangler.json').name")"
if [ "$BUILT_NAME" != "$EXPECTED_NAME" ]; then
  echo "refusing to deploy: built worker is named '$BUILT_NAME', expected '$EXPECTED_NAME'" >&2
  exit 1
fi

npx wrangler deploy "$@"
