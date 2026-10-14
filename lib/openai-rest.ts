import "server-only";
import {
  type AIUsage,
  type ModerationResult,
} from "@/lib/ai-types";
import { getAIConfig } from "@/lib/ai-config";
import { isHighRiskModerationCategory } from "@/lib/ai-policy";

const OPENAI_API_BASE = "https://api.openai.com/v1";

type ResponseOutputItem = {
  type?: string;
  content?: Array<{ type?: string; text?: string; refusal?: string }>;
};

type ResponsesAPIResult = {
  output?: ResponseOutputItem[];
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
  };
  error?: { message?: string };
};

function getApiKey() {
  const key = getAIConfig().openAIKey;
  if (!key) {
    throw new Error("OPENAI_API_KEY belum dikonfigurasi.");
  }
  return key;
}

async function openAIRequest<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${OPENAI_API_BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API request failed (${response.status}).`);
  }

  return (await response.json()) as T;
}

export async function createEmbedding(input: string): Promise<number[]> {
  const config = getAIConfig();
  const result = await openAIRequest<{
    data?: Array<{ embedding?: number[] }>;
    error?: { message?: string };
  }>("/embeddings", {
    model: config.embeddingModel,
    input,
    dimensions: config.embeddingDimensions,
    encoding_format: "float",
  });

  const embedding = result.data?.[0]?.embedding;
  if (!embedding?.length) {
    throw new Error(result.error?.message || "Embedding tidak tersedia.");
  }
  return embedding;
}

export async function createEmbeddings(inputs: string[]): Promise<number[][]> {
  if (!inputs.length) return [];
  const config = getAIConfig();
  const result = await openAIRequest<{
    data?: Array<{ index?: number; embedding?: number[] }>;
    error?: { message?: string };
  }>("/embeddings", {
    model: config.embeddingModel,
    input: inputs,
    dimensions: config.embeddingDimensions,
    encoding_format: "float",
  });

  const data = result.data ?? [];
  const ordered = data
    .slice()
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
    .map((item) => item.embedding ?? []);

  if (ordered.length !== inputs.length || ordered.some((item) => !item.length)) {
    throw new Error(result.error?.message || "Batch embedding tidak lengkap.");
  }
  return ordered;
}

function extractOutputText(result: ResponsesAPIResult) {
  const chunks: string[] = [];
  for (const item of result.output ?? []) {
    if (item.type !== "message") continue;
    for (const content of item.content ?? []) {
      if (content.type === "output_text" && content.text) chunks.push(content.text);
      if (content.type === "refusal" && content.refusal) chunks.push(content.refusal);
    }
  }
  return chunks.join("\n").trim();
}

export async function createStructuredResponse<T>({
  instructions,
  input,
  schemaName,
  schema,
  safetyIdentifier,
  maxOutputTokens = 1200,
}: {
  instructions: string;
  input: string;
  schemaName: string;
  schema: Record<string, unknown>;
  safetyIdentifier?: string;
  maxOutputTokens?: number;
}): Promise<{ data: T; usage: AIUsage; model: string }> {
  const config = getAIConfig();
  const result = await openAIRequest<ResponsesAPIResult>("/responses", {
    model: config.model,
    instructions,
    input,
    reasoning: { effort: "low" },
    max_output_tokens: maxOutputTokens,
    store: false,
    safety_identifier: safetyIdentifier,
    text: {
      format: {
        type: "json_schema",
        name: schemaName,
        description: "Structured output for the Batak Digital Knowledge Platform.",
        strict: true,
        schema,
      },
    },
  });

  const text = extractOutputText(result);
  if (!text) {
    throw new Error(result.error?.message || "OpenAI tidak mengembalikan output teks.");
  }

  let data: T;
  try {
    data = JSON.parse(text) as T;
  } catch {
    throw new Error("Output model tidak dapat diparse sebagai JSON terstruktur.");
  }

  return {
    data,
    model: config.model,
    usage: {
      inputTokens: result.usage?.input_tokens,
      outputTokens: result.usage?.output_tokens,
      totalTokens: result.usage?.total_tokens,
    },
  };
}

export async function moderateText(input: string): Promise<ModerationResult> {
  try {
    const result = await openAIRequest<{
      results?: Array<{
        flagged?: boolean;
        categories?: Record<string, boolean>;
      }>;
    }>("/moderations", {
      model: "omni-moderation-latest",
      input,
    });

    const item = result.results?.[0];
    const categories = Object.entries(item?.categories ?? {})
      .filter(([, value]) => value)
      .map(([key]) => key);
    return {
      flagged: Boolean(item?.flagged),
      highRisk: categories.some(isHighRiskModerationCategory),
      categories,
    };
  } catch {
    // Moderation failure must not silently turn into a safety bypass for high-risk flows.
    // The caller may continue for ordinary cultural questions, but should log the failure.
    return { flagged: false, highRisk: false, categories: ["moderation_unavailable"] };
  }
}
