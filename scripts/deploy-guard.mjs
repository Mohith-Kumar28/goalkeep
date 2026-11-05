// Refuses to ship to a frozen worker. `goalkeep` is the draft the client
// reviewed on 23 Sep (branch v3.1-draft); `goalkeep-v4` carries the production
// domain (branch v4.0-draft). v5.0-draft deploys to its own worker,
// `goalkeep-v5`.
import { readFileSync } from "node:fs"

const FROZEN = ["goalkeep", "goalkeep-legacy", "goalkeep-v4"]
const { name } = JSON.parse(readFileSync("dist/server/wrangler.json", "utf8"))

if (FROZEN.includes(name)) {
  console.error(`refusing to deploy: '${name}' is a frozen review URL`)
  process.exit(1)
}
console.log(`deploying worker '${name}'`)
