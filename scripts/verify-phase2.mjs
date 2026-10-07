import fs from "node:fs";
import path from "node:path";

const required = [
  "app/map/page.tsx",
  "app/language/page.tsx",
  "app/gallery/page.tsx",
  "app/admin/completeness/page.tsx",
  "components/cultural-map.tsx",
  "components/tradition-timeline.tsx",
  "components/media-gallery.tsx",
  "lib/phase2-data.ts",
  "lib/phase2-repository.ts",
  "lib/completeness.ts",
  "supabase/migrations/20261007130000_phase2_interactive_culture.sql",
  "tests/unit/phase2-search.test.ts",
  "tests/unit/completeness.test.ts",
  "tests/e2e/phase2.spec.ts",
  "docs/11-phase-2-scope.md",
  "docs/12-phase-2-data-model.md",
  "docs/13-phase-2-content-policy.md",
  "docs/14-phase-2-checklist.md",
  "PHASE_2_HANDOFF.md",
];

const missing = required.filter((file) => !fs.existsSync(path.resolve(file)));
if (missing.length) {
  console.error("Phase 2 verification failed. Missing:", missing.join(", "));
  process.exit(1);
}

const migration = fs.readFileSync("supabase/migrations/20261007130000_phase2_interactive_culture.sql", "utf8");
for (const token of ["map_locations", "tradition_timeline_steps", "dictionary_entries", "content_completeness", "search_knowledge_v2", "rights_status"]) {
  if (!migration.includes(token)) {
    console.error(`Phase 2 migration missing ${token}`);
    process.exit(1);
  }
}

// Phase 3+ features are allowed in later cumulative codebases.

console.log(`Phase 2 verification PASS (${required.length} required deliverables).`);
