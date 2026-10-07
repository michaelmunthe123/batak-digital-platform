import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const errors = [];

function exists(rel) {
  if (!fs.existsSync(path.join(root, rel))) errors.push(`Missing: ${rel}`);
}

const required = [
  "app/page.tsx",
  "app/explore/page.tsx",
  "app/marga/page.tsx",
  "app/marga/[slug]/page.tsx",
  "app/knowledge/[slug]/page.tsx",
  "app/adat/page.tsx",
  "app/sources/page.tsx",
  "app/search/page.tsx",
  "app/admin/page.tsx",
  "app/admin/login/page.tsx",
  "app/admin/content/new/page.tsx",
  "app/admin/sources/new/page.tsx",
  "app/admin/claims/new/page.tsx",
  "app/sitemap.ts",
  "app/robots.ts",
  "proxy.ts",
  "supabase/config.toml",
  "supabase/seed.sql",
  "supabase/migrations/20261006090000_initial_schema.sql",
  "supabase/migrations/20261006093000_editorial_workflow.sql",
  ".github/workflows/ci.yml",
  "docs/10-phase-1-checklist.md",
];

required.forEach(exists);

const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
if (pkg.dependencies?.next !== "16.3.8") {
  errors.push("Next.js must be pinned to 16.3.8 for this Phase 1 baseline.");
}
if (!pkg.scripts?.check || !pkg.scripts?.["test:e2e"]) {
  errors.push("Quality scripts are incomplete.");
}

const schema = fs.readFileSync(
  path.join(root, "supabase/migrations/20261006090000_initial_schema.sql"),
  "utf8",
);

for (const table of [
  "entities",
  "sources",
  "claims",
  "claim_sources",
  "relationships",
  "relationship_sources",
  "classification_schemes",
  "content_sections",
  "profiles",
  "revisions",
]) {
  if (!schema.includes(`public.${table}`)) errors.push(`Schema missing ${table}`);
}

for (const guard of [
  "enable row level security",
  "search_knowledge",
  "is_editorial",
  "can_edit",
]) {
  if (!schema.includes(guard)) errors.push(`Schema guard missing: ${guard}`);
}

const workflow = fs.readFileSync(
  path.join(root, "supabase/migrations/20261006093000_editorial_workflow.sql"),
  "utf8",
);
for (const fn of [
  "transition_entity_status",
  "transition_source_status",
  "transition_claim_status",
]) {
  if (!workflow.includes(fn)) errors.push(`Workflow RPC missing: ${fn}`);
}

const forbiddenRoutes = ["app/ai"];
if (!fs.existsSync(path.join(root, "PHASE_4_HANDOFF.md"))) {
  forbiddenRoutes.push("app/community", "app/account");
}
if (!fs.existsSync(path.join(root, "PHASE_2_HANDOFF.md"))) forbiddenRoutes.push("app/map");
if (!fs.existsSync(path.join(root, "PHASE_3_HANDOFF.md"))) {
  forbiddenRoutes.push("app/tarombo", "app/partuturan", "app/relations");
}
for (const rel of forbiddenRoutes) {
  if (fs.existsSync(path.join(root, rel))) errors.push(`Out-of-scope route exists: ${rel}`);
}

const env = fs.readFileSync(path.join(root, ".env.example"), "utf8");
if (/SUPABASE_SERVICE_ROLE_KEY=.+\S/.test(env)) {
  errors.push("Service role secret must not be committed.");
}

if (errors.length) {
  console.error("Phase 1 verification FAILED");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Phase 1 verification PASS");
console.log(`Checked ${required.length} required deliverables, schema guards, workflow RPCs, scope guards, and secret hygiene.`);
