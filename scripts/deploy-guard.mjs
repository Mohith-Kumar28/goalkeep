// Refuses to ship anything to the `goalkeep` worker. That URL is the draft the
// client reviewed on 23 Sep (branch v3.1-draft) and must stay as it is; work
// from v4.0-draft onward deploys to its own worker, `goalkeep-v4`.
import { readFileSync } from "node:fs"

const FROZEN = ["goalkeep", "goalkeep-legacy"]
const { name } = JSON.parse(readFileSync("dist/server/wrangler.json", "utf8"))

if (FROZEN.includes(name)) {
  console.error(`refusing to deploy: '${name}' is a frozen review URL`)
  process.exit(1)
}
console.log(`deploying worker '${name}'`)
