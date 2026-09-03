const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.7-flash";

export class AiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type Msg = { role: "system" | "user" | "assistant"; content: string };

function friendlyMessage(status: number, raw: string) {
  if (status === 402) {
    return "AI credits are exhausted for this workspace. Add credits in Lovable to keep using Capable AI features.";
  }
  if (status === 429) {
    return "Too many requests right now. Please wait a moment and try again.";
  }
  if (status === 403) {
    return "AI access is currently blocked for this workspace. Please contact the app owner.";
  }
  if (status === 401) {
    return "The AI service is not configured correctly (missing or invalid key).";
  }
  return raw || "The AI service could not complete this request.";
}

async function callGateway(messages: Msg[], jsonMode: boolean): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new AiError("Missing LOVABLE_API_KEY", 401);

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!res.ok) {
    let raw = "";
    try {
      const body = (await res.json()) as { error?: { message?: string }; message?: string };
      raw = body?.error?.message ?? body?.message ?? "";
    } catch {
      raw = await res.text().catch(() => "");
    }
    throw new AiError(friendlyMessage(res.status, raw), res.status);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new AiError("The AI returned an empty response. Please try again.", 502);
  return text;
}

export async function aiText(system: string, user: string, history: Msg[] = []) {
  return callGateway([{ role: "system", content: system }, ...history, { role: "user", content: user }], false);
}

export async function aiJson<T>(system: string, user: string): Promise<T> {
  const text = await callGateway(
    [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    true,
  );
  const cleaned = text
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  const candidate = start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned;
  try {
    return JSON.parse(candidate) as T;
  } catch {
    throw new AiError("The AI response could not be read. Please try again.", 502);
  }
}

export const RESPONSIBLE_AI_RULES = `Safety and integrity constraints (always apply):
- Never fabricate facts, names, dates, deadlines, numbers, sources or commitments that the user did not provide.
- If required information is missing, write exactly "Not specified" or clearly flag the gap.
- Clearly indicate uncertainty rather than presenting guesses as verified fact.
- Preserve the user's intended meaning; do not change their decisions.
- Do not make high-stakes professional, legal, medical or financial decisions on the user's behalf; recommend human review instead.
- Keep language professional, practical and appropriate for students, interns, graduates and early-career professionals.`;
