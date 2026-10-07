import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const openAIKey = process.env.OPENAI_API_KEY;
const embeddingModel = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";
const dimensions = Number.parseInt(process.env.OPENAI_EMBEDDING_DIMENSIONS || "512", 10);

if (!supabaseUrl || !supabaseSecret || !openAIKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, or OPENAI_API_KEY in .env.local");
  process.exit(1);
}
if (dimensions !== 512) {
  console.error("Phase 5 schema uses vector(512). Keep OPENAI_EMBEDDING_DIMENSIONS=512 unless you also migrate the database.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseSecret, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function hash(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

async function loadSourceRows() {
  const rows = [];
  const pageSize = 1000;
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from("ai_index_source_rows")
      .select("*")
      .range(from, from + pageSize - 1);
    if (error) throw new Error(`Cannot read ai_index_source_rows: ${error.message}`);
    rows.push(...(data || []));
    if (!data || data.length < pageSize) break;
  }
  return rows;
}

async function createEmbeddings(inputs) {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openAIKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: embeddingModel,
      input: inputs,
      dimensions,
      encoding_format: "float",
    }),
  });
  if (!response.ok) {
    throw new Error(`OpenAI embeddings ${response.status}: ${(await response.text()).slice(0, 500)}`);
  }
  const json = await response.json();
  return (json.data || [])
    .slice()
    .sort((a, b) => a.index - b.index)
    .map((item) => item.embedding);
}

const sourceRows = await loadSourceRows();
console.log(`Source-backed rows available: ${sourceRows.length}`);

const { data: existing, error: existingError } = await supabase
  .from("ai_documents")
  .select("document_key,content_hash,embedding_model,status");
if (existingError) throw new Error(existingError.message);
const existingMap = new Map((existing || []).map((row) => [row.document_key, row]));

const normalized = sourceRows.map((row) => {
  const textForEmbedding = `${row.title}\n\n${row.content}`.slice(0, 12000);
  return {
    row,
    textForEmbedding,
    contentHash: hash(textForEmbedding),
  };
});

const changed = normalized.filter(({ row, contentHash }) => {
  const current = existingMap.get(row.document_key);
  return !current || current.content_hash !== contentHash || current.embedding_model !== embeddingModel || current.status !== "published";
});

let embeddedCount = 0;
for (let offset = 0; offset < changed.length; offset += 32) {
  const batch = changed.slice(offset, offset + 32);
  const embeddings = await createEmbeddings(batch.map((item) => item.textForEmbedding));
  if (embeddings.length !== batch.length) throw new Error("Embedding batch returned an unexpected number of rows.");

  const payload = batch.map((item, index) => ({
    document_key: item.row.document_key,
    document_type: item.row.document_type,
    title: item.row.title,
    content: item.row.content,
    entity_id: item.row.entity_id,
    entity_slug: item.row.entity_slug,
    entity_type: item.row.entity_type,
    source_id: item.row.source_id,
    citation_locator: item.row.citation_locator,
    claim_status: item.row.claim_status,
    cultural_context: item.row.cultural_context,
    content_hash: item.contentHash,
    embedding: embeddings[index],
    embedding_model: embeddingModel,
    status: "published",
    metadata: item.row.metadata || {},
  }));

  const { error } = await supabase.from("ai_documents").upsert(payload, { onConflict: "document_key" });
  if (error) throw new Error(`Upsert failed: ${error.message}`);
  embeddedCount += batch.length;
  console.log(`Embedded/upserted ${embeddedCount}/${changed.length}`);
}

const activeKeys = new Set(normalized.map((item) => item.row.document_key));
const staleKeys = (existing || [])
  .map((row) => row.document_key)
  .filter((key) => !activeKeys.has(key));
for (let offset = 0; offset < staleKeys.length; offset += 200) {
  const chunk = staleKeys.slice(offset, offset + 200);
  if (!chunk.length) continue;
  const { error } = await supabase
    .from("ai_documents")
    .update({ status: "archived" })
    .in("document_key", chunk);
  if (error) throw new Error(`Archive stale documents failed: ${error.message}`);
}

console.log(`AI indexing complete. changed=${changed.length}, unchanged=${normalized.length - changed.length}, archived=${staleKeys.length}`);
