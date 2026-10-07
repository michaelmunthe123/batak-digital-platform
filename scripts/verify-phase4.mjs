import fs from "node:fs";
import path from "node:path";

const required = [
  "app/contribute/page.tsx",
  "app/contribute/guidelines/page.tsx",
  "app/contribute/new/page.tsx",
  "app/contribute/[id]/page.tsx",
  "app/account/page.tsx",
  "app/account/welcome/page.tsx",
  "app/account/profile/page.tsx",
  "app/account/contributions/page.tsx",
  "app/account/notifications/page.tsx",
  "app/account/login/page.tsx",
  "app/auth/confirm/route.ts",
  "app/contributors/[slug]/page.tsx",
  "app/report/page.tsx",
  "app/admin/community/page.tsx",
  "app/admin/community/[id]/page.tsx",
  "lib/auth/community.ts",
  "lib/community-types.ts",
  "lib/community-workflow.ts",
  "lib/community-repository.ts",
  "lib/supabase/admin.ts",
  "supabase/migrations/20261007193000_phase4_community_contribution.sql",
  "supabase/templates/invite.html",
  "tests/unit/community-workflow.test.ts",
  "tests/e2e/phase4.spec.ts",
  "docs/21-phase-4-scope.md",
  "docs/22-phase-4-data-model.md",
  "docs/23-community-moderation-security.md",
  "docs/24-phase-4-checklist.md",
  "docs/25-phase-4-qa.md",
  "PHASE_4_HANDOFF.md",
];

const missing = required.filter((file) => !fs.existsSync(path.resolve(file)));
if (missing.length) {
  console.error("Phase 4 verification failed. Missing:", missing.join(", "));
  process.exit(1);
}

const migration = fs.readFileSync("supabase/migrations/20261007193000_phase4_community_contribution.sql", "utf8");
for (const token of [
  "community_memberships",
  "contributor_profiles",
  "contributions",
  "contribution_sources",
  "contribution_messages",
  "contribution_audit_log",
  "content_reports",
  "community_notifications",
  "transition_contribution_status",
  "activate_contributor_account",
  "get_public_contributor_stats",
  "enable row level security",
  "Evidence source required for this contribution type",
]) {
  if (!migration.includes(token)) {
    console.error(`Phase 4 migration missing ${token}`);
    process.exit(1);
  }
}

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const versionParts = pkg.version.split(".").map(Number);
if (versionParts[0] !== 0 || versionParts[1] < 4) {
  console.error("Phase 4 verifier requires package version 0.4.0 or newer");
  process.exit(1);
}
if (!pkg.scripts?.["verify:phase4"]) {
  console.error("Missing verify:phase4 script");
  process.exit(1);
}

const env = fs.readFileSync(".env.example", "utf8");
if (!env.includes("SUPABASE_SECRET_KEY=")) {
  console.error("Phase 4 admin invite secret placeholder missing");
  process.exit(1);
}
if (/SUPABASE_(?:SECRET_KEY|SERVICE_ROLE_KEY)=.+\S/.test(env)) {
  console.error("A Supabase server secret appears to be committed");
  process.exit(1);
}

const packageText = fs.readFileSync("package.json", "utf8").toLowerCase();
if (versionParts[1] === 4 && (packageText.includes("ai cultural assistant") || fs.existsSync(path.resolve("app/ai")))) {
  console.error("Phase 5 AI feature leaked into a Phase 4-only package");
  process.exit(1);
}

console.log(`Phase 4 verification PASS (${required.length} required deliverables).`);
