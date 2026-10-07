import { createHash, createHmac } from "node:crypto";
import { getAIConfig } from "@/lib/ai-config";

export function hashText(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function deriveAnonymousKey(request: Request) {
  const config = getAIConfig();
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  const userAgent = request.headers.get("user-agent") ?? "unknown-agent";
  const source = `${forwarded || realIp || "unknown-ip"}|${userAgent.slice(0, 180)}`;
  const salt = config.safetyHashSalt;
  if (!salt) {
    throw new Error("AI_SAFETY_HASH_SALT belum dikonfigurasi.");
  }
  return createHmac("sha256", salt).update(source).digest("hex");
}

export function safeExcerpt(value: string, max = 500) {
  const compact = value.replace(/\s+/g, " ").trim();
  return compact.length <= max ? compact : `${compact.slice(0, max)}…`;
}
