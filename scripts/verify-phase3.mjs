import fs from "node:fs";
import path from "node:path";

const required = [
  "app/tarombo/page.tsx",
  "app/tarombo/[slug]/page.tsx",
  "app/partuturan/page.tsx",
  "app/relations/page.tsx",
  "components/genealogy-tree.tsx",
  "components/partuturan-calculator.tsx",
  "components/relationship-path.tsx",
  "lib/phase3-data.ts",
  "lib/phase3-repository.ts",
  "lib/genealogy-engine.ts",
  "lib/kinship-engine.ts",
  "lib/relationship-engine.ts",
  "supabase/migrations/20261007170000_phase3_genealogy_kinship.sql",
  "tests/unit/genealogy-engine.test.ts",
  "tests/unit/kinship-engine.test.ts",
  "tests/unit/relationship-engine.test.ts",
  "tests/e2e/phase3.spec.ts",
  "docs/15-phase-3-scope.md",
  "docs/16-phase-3-data-model.md",
  "docs/17-genealogy-privacy-and-inference.md",
  "docs/18-phase-3-editorial-workflow.md",
  "docs/19-phase-3-checklist.md",
  "docs/20-phase-3-qa.md",
  "PHASE_3_HANDOFF.md",
];

const missing = required.filter((file) => !fs.existsSync(path.resolve(file)));
if (missing.length) {
  console.error("Phase 3 verification failed. Missing:", missing.join(", "));
  process.exit(1);
}

const migration = fs.readFileSync("supabase/migrations/20261007170000_phase3_genealogy_kinship.sql", "utf8");
for (const token of [
  "genealogy_datasets",
  "genealogy_nodes",
  "genealogy_edges",
  "genealogy_edge_sources",
  "kinship_rules",
  "kinship_rule_sources",
  "find_public_genealogy_path",
  "living_status <> 'living' or privacy_level <> 'public'",
  "validate_genealogy_edge_dataset",
]) {
  if (!migration.includes(token)) {
    console.error(`Phase 3 migration missing ${token}`);
    process.exit(1);
  }
}

const phase3Data = fs.readFileSync("lib/phase3-data.ts", "utf8");
if (!phase3Data.includes("Dataset fiktif") || !phase3Data.includes("tata-kelakuan-sumut")) {
  console.error("Phase 3 pilot data must keep demo genealogy fictional and kinship rules sourced.");
  process.exit(1);
}

if (!fs.existsSync(path.resolve("PHASE_4_HANDOFF.md"))) {
  const privacyLeaks = ["public user genealogy account", "AI cultural assistant", "community contribution"];
  const packageText = fs.readFileSync("package.json", "utf8").toLowerCase();
  if (privacyLeaks.some((item) => packageText.includes(item.toLowerCase()))) {
    console.error("Phase 4/5 feature leaked into Phase 3 package metadata.");
    process.exit(1);
  }
}

console.log(`Phase 3 verification PASS (${required.length} required deliverables).`);
