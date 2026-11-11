/**
 * Local only. Replaces the rows in the local D1 database with ~64 realistic
 * ones so the admin dashboard has something to page through:
 *
 *   pnpm exec wrangler d1 migrations apply goalkeep-site-v5 --local
 *   node --experimental-strip-types --no-warnings scripts/seed-admin-local.mjs
 *
 * Never run against --remote: it deletes every row first.
 */
import { execFileSync } from "node:child_process"
import { mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { detailOptions, scoreQuiz, statementCount } from "../src/content/quiz.ts"

let seed = 7
const random = () => {
  seed = (seed * 16807) % 2147483647
  return seed / 2147483647
}
const pick = (list) => list[Math.floor(random() * list.length)]
const quote = (value) => (value === null ? "NULL" : typeof value === "number" ? String(value) : `'${String(value).replace(/'/g, "''")}'`)

const people = [
  ["Priya Raman", "Asha Learning Trust", "asha-learning.org"],
  ["Tomas Okello", "Lakeside Health Initiative", "lakesidehealth.org"],
  ["Meera Iyer", "Pratham Skills Foundation", "prathamskills.org"],
  ["Daniel Mwangi", "Green Roots Collective", "greenroots.co.ke"],
  ["Ananya Bose", "Sahayog Disability Network", "sahayog.in"],
  ["Farah Siddiqui", "Bright Futures Fund", "brightfutures.org"],
  ["Rohan Kapoor", "Kisan Seva Trust", "kisanseva.org"],
  ["Lucía Fernández", "Fundación Semilla", "fundacionsemilla.org"],
  ["Imani Joseph", "Safe Streets Alliance", "safestreets.org"],
  ["Vikram Nair", "Udaan Girls Foundation", "udaangirls.org"],
  ["Hannah Pierce", "Commonwealth Giving Circle", "commonwealthgiving.org"],
  ["Suresh Babu", "Jal Sanjeevani", "jalsanjeevani.in"],
  ["Nadia Haddad", "Open Pages Literacy", "openpages.org"],
  ["Karthik Subramanian", "Rural Health Partners", "ruralhealth.in"],
  ["Elena Petrova", "Arts for All Trust", "artsforall.org"],
  ["Joseph Kamau", "Mavuno Livelihoods", "mavuno.org"],
  ["Shreya Menon", "Neev Education Society", "neevedu.org"],
  ["Oliver Grant", "Horizon Climate Fund", "horizonclimate.org"],
  ["Divya Pillai", "Saathi Women's Collective", "saathi.org"],
  ["Amara Nwosu", "Kuja Youth Network", "kujayouth.org"],
]
const services = [
  "Impact and measurement strategy",
  "Data systems and workflows",
  "Dashboards and reporting",
  "Data adoption and capacity-building",
  "Sponsor a Kickstarter program",
  "Fund a Data Literacy cohort",
  "General enquiry",
]
const messages = [
  "We track outcomes for about 4,000 learners across eleven districts, and every quarter the data lives in a different spreadsheet. Could we talk about moving to one system our field team can actually use?",
  "Our board has asked for a dashboard they will open. At the moment our MEL lead builds a deck by hand each quarter, which takes nearly three weeks. Can you help us rethink what we report?",
  "We are a funder with 22 grantees and no common way to see progress. We are interested in a Data Literacy cohort for the next financial year.",
  "Saw your case study on the Kickstarter program. We would like to understand what sponsoring a cohort involves and what it costs.",
  "Our theory of change was written four years ago and nobody uses it. Is this something you can help refresh before our next strategic plan?",
  "Quick question about whether you work with organisations as small as ours, we are a team of six with a tiny budget.",
  "We run a helpline and collect case data on paper. We would love some advice on moving to a mobile tool without losing the confidentiality our callers rely on.",
  "Following your newsletter on the hidden cost of messy data, I think that is exactly us. Could someone call me this week?",
]
const agents = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
]
const dayMs = 86_400_000
const when = (index, count, spanDays) =>
  new Date(Date.now() - (index / count) * spanDays * dayMs - Math.floor(random() * 3_600_000)).toISOString()
const emailOf = (name, domain) => `${name.split(" ")[0].toLowerCase().replace(/[^a-z]/g, "")}@${domain}`

const sql = ["DELETE FROM contact_submissions;", "DELETE FROM newsletter_signups;", "DELETE FROM quiz_responses;"]

const contactCount = 32
for (let i = 0; i < contactCount; i++) {
  const [name, org, domain] = people[i % people.length]
  sql.push(
    `INSERT INTO contact_submissions (name, email, organization, service, message, user_agent, created_at) VALUES (${[
      i >= people.length ? name.split(" ")[0] + " " + pick(["Das", "Verma", "Lopez", "Walker"]) : name,
      i >= people.length ? `${name.split(" ")[0].toLowerCase()}.${i}@${domain}` : emailOf(name, domain),
      org,
      pick(services),
      messages[i % messages.length],
      pick(agents),
      when(i, contactCount, 45),
    ].map(quote).join(", ")});`
  )
}

const newsletterCount = 16
for (let i = 0; i < newsletterCount; i++) {
  const [name, org, domain] = people[(i * 3) % people.length]
  sql.push(
    `INSERT INTO newsletter_signups (email, name, organization, audience, edition, created_at) VALUES (${[
      `${name.split(" ")[0].toLowerCase()}.${i}@${domain}`,
      i % 4 === 3 ? null : name,
      i % 5 === 4 ? null : org,
      i % 6 === 5 ? null : pick(["funder", "nonprofit", "nonprofit", "intermediary"]),
      i % 3 === 0 ? null : pick(["2026-10", "2026-09", "2026-08"]),
      when(i, newsletterCount, 40),
    ].map(quote).join(", ")});`
  )
}

const quizCount = 16
for (let i = 0; i < quizCount; i++) {
  const [name, org, domain] = people[(i * 7 + 2) % people.length]
  const lean = 1 + Math.floor(random() * 3)
  const answers = Array.from({ length: statementCount }, () => Math.min(5, Math.max(1, lean + Math.floor(random() * 3))))
  const score = scoreQuiz(answers)
  const byDomain = Object.fromEntries(score.domains.map((d) => [d.id, d.average]))
  sql.push(
    `INSERT INTO quiz_responses (name, email, organization, region, sector, role, size, budget, answers, score_data, score_technology, score_process, score_strategy, score_overall, band, user_agent, created_at) VALUES (${[
      name,
      `${name.split(" ")[0].toLowerCase()}.quiz${i}@${domain}`,
      org,
      null,
      pick(detailOptions.sector.slice(0, -1)),
      pick(detailOptions.role.slice(0, -1)),
      pick(detailOptions.size),
      i % 4 === 0 ? null : pick(detailOptions.budget),
      JSON.stringify(answers),
      byDomain.data,
      byDomain.technology,
      byDomain.process,
      byDomain.strategy,
      score.average,
      score.persona.id,
      pick(agents),
      when(i, quizCount, 30),
    ].map(quote).join(", ")});`
  )
}

const file = join(mkdtempSync(join(tmpdir(), "gk-seed-")), "seed.sql")
writeFileSync(file, sql.join("\n"))
execFileSync("pnpm", ["exec", "wrangler", "d1", "execute", "goalkeep-site-v5", "--local", "--file", file], { stdio: "inherit" })
