import fs from "node:fs";
import path from "node:path";

const required = [
  "app/assistant/page.tsx",
  "app/semantic-search/page.tsx",
  "app/learn/page.tsx",
  "app/about/ai/page.tsx",
  "app/admin/ai/page.tsx",
  "app/api/assistant/route.ts",
  "app/api/assistant/feedback/route.ts",
  "app/api/semantic-search/route.ts",
  "app/api/learning-plan/route.ts",
  "app/api/admin/ai-review/route.ts",
  "components/assistant-client.tsx",
  "components/semantic-search-client.tsx",
  "components/learning-planner.tsx",
  "components/admin-ai-review-client.tsx",
  "lib/ai-config.ts",
  "lib/ai-types.ts",
  "lib/ai-policy.ts",
  "lib/ai-security.ts",
  "lib/openai-rest.ts",
  "lib/ai-repository.ts",
  "lib/ai-grounding.ts",
  "scripts/index-ai.mjs",
  "supabase/migrations/20261007223000_phase5_ai_mature_platform.sql",
  "tests/unit/ai-policy.test.ts",
  "tests/e2e/phase5.spec.ts",
  "docs/26-phase-5-scope.md",
  "docs/27-ai-rag-architecture.md",
  "docs/28-ai-safety-privacy.md",
  "docs/29-phase-5-checklist.md",
  "docs/30-phase-5-qa.md",
  "RUN_IN_VSCODE_WINDOWS.md",
  "PHASE_5_HANDOFF.md",
];

const missing = required.filter((file) => !fs.existsSync(path.resolve(file)));
if (missing.length) {
  console.error("Phase 5 verification failed. Missing:", missing.join(", "));
  process.exit(1);
}

const migration = fs.readFileSync("supabase/migrations/20261007223000_phase5_ai_mature_platform.sql", "utf8");
for (const token of [
  "create extension if not exists vector",
  "ai_documents",
  "hybrid_search_ai",
  "ai_request_log",
  "ai_feedback",
  "ai_editorial_reviews",
  "consume_ai_rate_limit",
  "security_invoker = true",
  "enable row level security",
  "ai_index_source_rows",
]) {
  if (!migration.includes(token)) {
    console.error(`Phase 5 migration missing ${token}`);
    process.exit(1);
  }
}

const indexView = migration.slice(
  migration.indexOf("create or replace view public.ai_index_source_rows"),
  migration.indexOf("revoke all on public.ai_index_source_rows"),
);
if (indexView.includes("public.genealogy_nodes") || indexView.includes("public.genealogy_edges")) {
  console.error("Living-person/genealogy graph data must not enter the public AI index in Phase 5.");
  process.exit(1);
}

const openai = fs.readFileSync("lib/openai-rest.ts", "utf8");
if (!openai.includes('"/responses"') || !openai.includes('"/embeddings"')) {
  console.error("Phase 5 must use Responses API and embeddings.");
  process.exit(1);
}
if (/assistants|threads\.runs/i.test(openai)) {
  console.error("Deprecated Assistants API pattern found in Phase 5 implementation.");
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
if (pkg.version !== "0.5.0") {
  console.error("Phase 5 package version must be 0.5.0");
  process.exit(1);
}
for (const script of ["verify:phase5", "verify:all", "ai:index"]) {
  if (!pkg.scripts?.[script]) {
    console.error(`Missing ${script} script`);
    process.exit(1);
  }
}

const env = fs.readFileSync(".env.example", "utf8");
for (const variable of [
  "OPENAI_API_KEY=",
  "OPENAI_MODEL=",
  "OPENAI_EMBEDDING_MODEL=",
  "AI_STORE_PROMPTS=false",
  "AI_SAFETY_HASH_SALT=",
]) {
  if (!env.includes(variable)) {
    console.error(`Missing Phase 5 env placeholder ${variable}`);
    process.exit(1);
  }
}
if (/NEXT_PUBLIC_OPENAI/i.test(env)) {
  console.error("OpenAI secrets must never be NEXT_PUBLIC.");
  process.exit(1);
}
if (/OPENAI_API_KEY=\s*sk-[A-Za-z0-9_-]+/.test(env)) {
  console.error("An OpenAI API key appears to be committed.");
  process.exit(1);
}


const policy = fs.readFileSync("lib/ai-policy.ts", "utf8");
if (!policy.includes("sanitizeInlineSourceCitations")) {
  console.error("Phase 5 must sanitize inline citation labels against retrieved source keys.");
  process.exit(1);
}

const aiConfig = fs.readFileSync("lib/ai-config.ts", "utf8");
if (!aiConfig.includes("config.safetyHashSalt")) {
  console.error("Phase 5 must require AI_SAFETY_HASH_SALT before AI is configured.");
  process.exit(1);
}

const assistantRoute = fs.readFileSync("app/api/assistant/route.ts", "utf8");
if (!assistantRoute.includes("generateGroundedAssistantAnswer") || !assistantRoute.includes("retrieveAIContext")) {
  console.error("Assistant must retrieve context before generation.");
  process.exit(1);
}

const adminRoute = fs.readFileSync("app/api/admin/ai-review/route.ts", "utf8");
if (/\.from\(["'](?:entities|claims|sources|relationships)["']\)\s*\.update/.test(adminRoute)) {
  console.error("AI editorial review must not directly publish/update cultural knowledge.");
  process.exit(1);
}

console.log(`Phase 5 verification PASS (${required.length} required deliverables).`);
