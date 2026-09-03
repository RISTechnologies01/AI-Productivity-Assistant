import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type EmailResult = { subject: string; body: string };

export type MeetingResult = {
  summary: string;
  keyDecisions: string[];
  actionItems: { task: string; owner: string; deadline: string }[];
  discussionPoints: string[];
  unresolvedQuestions: string[];
  deadlines: string[];
};

export type PlanResult = {
  planDate: string;
  blocks: { time: string; task: string; priority: "high" | "medium" | "low"; duration: string }[];
  priorities: { high: string[]; medium: string[]; low: string[] };
  notes: string[];
};

export type ResearchResult = {
  overview: string;
  keyInsights: string[];
  concepts: { term: string; explanation: string }[];
  applications: string[];
  risks: string[];
  recommendations: string[];
  uncertainty: string;
};

const EmailInput = z.object({
  context: z.string().max(2000).optional().default(""),
  intent: z.string().min(5).max(4000),
  tone: z.enum(["Formal", "Friendly", "Persuasive", "Concise", "Apologetic"]),
  length: z.enum(["Short", "Medium", "Detailed"]),
});

const MeetingInput = z.object({ notes: z.string().min(20).max(20000) });

const PlanInput = z.object({
  brainDump: z.string().max(6000).optional().default(""),
  tasks: z
    .array(
      z.object({
        name: z.string(),
        deadline: z.string().optional().default(""),
        duration: z.string().optional().default(""),
        priority: z.string().optional().default(""),
      }),
    )
    .max(40)
    .optional()
    .default([]),
});

const ResearchInput = z.object({
  topic: z.string().min(2).max(500),
  goal: z.enum([
    "Explain a topic",
    "Summarize information",
    "Compare concepts",
    "Identify key insights",
    "Generate recommendations",
    "Create study notes",
  ]),
  material: z.string().max(20000).optional().default(""),
});

const ChatInput = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(8000) }))
    .min(1)
    .max(40),
});

function toError(err: unknown) {
  const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
  return new Error(message);
}

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => EmailInput.parse(d))
  .handler(async ({ data }): Promise<EmailResult> => {
    const { aiJson, RESPONSIBLE_AI_RULES } = await import("./ai-gateway.server");
    const system = `ROLE: You are Capable Email Studio, an expert workplace communication assistant for students, interns and early-career professionals.
OBJECTIVE: Turn the user's plain-language intent into one polished, ready-to-send workplace email.
INSTRUCTIONS:
- Write in the requested tone and length.
- Use only information the user supplied. If a specific date, name or detail is missing, use a neutral placeholder in square brackets such as [date] or [Manager's name].
- Include a natural greeting and sign-off; end the sign-off with [Your name] unless the user gave their name.
- Length guide: Short = under 80 words, Medium = 90-150 words, Detailed = 160-260 words.
${RESPONSIBLE_AI_RULES}
OUTPUT FORMAT: Return ONLY JSON: {"subject": string, "body": string}. Body uses plain text with \\n line breaks, no markdown.`;

    const user = `Recipient / context: ${data.context || "Not specified"}
Tone: ${data.tone}
Length: ${data.length}
What the user wants to say:
"""
${data.intent}
"""`;

    try {
      const out = await aiJson<EmailResult>(system, user);
      return { subject: out.subject ?? "", body: out.body ?? "" };
    } catch (err) {
      throw toError(err);
    }
  });

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => MeetingInput.parse(d))
  .handler(async ({ data }): Promise<MeetingResult> => {
    const { aiJson, RESPONSIBLE_AI_RULES } = await import("./ai-gateway.server");
    const system = `ROLE: You are Capable Meeting Intelligence, an assistant that converts messy meeting notes into structured, actionable output.
OBJECTIVE: Extract an accurate structured summary strictly from the supplied notes.
INSTRUCTIONS:
- Only use content present in the notes. Never infer owners, dates or decisions.
- Where an owner or deadline is absent, use the exact string "Not specified".
- Keep each list item short and concrete.
${RESPONSIBLE_AI_RULES}
OUTPUT FORMAT: Return ONLY JSON with this shape:
{"summary": string, "keyDecisions": string[], "actionItems": [{"task": string, "owner": string, "deadline": string}], "discussionPoints": string[], "unresolvedQuestions": string[], "deadlines": string[]}
Use empty arrays when a section has nothing in the notes.`;

    try {
      const out = await aiJson<MeetingResult>(system, `Meeting notes:\n"""\n${data.notes}\n"""`);
      return {
        summary: out.summary ?? "",
        keyDecisions: out.keyDecisions ?? [],
        actionItems: out.actionItems ?? [],
        discussionPoints: out.discussionPoints ?? [],
        unresolvedQuestions: out.unresolvedQuestions ?? [],
        deadlines: out.deadlines ?? [],
      };
    } catch (err) {
      throw toError(err);
    }
  });

export const buildPlan = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => PlanInput.parse(d))
  .handler(async ({ data }): Promise<PlanResult> => {
    const { aiJson, RESPONSIBLE_AI_RULES } = await import("./ai-gateway.server");
    const system = `ROLE: You are Capable Task Planner, a realistic workload planner for students and early-career professionals.
OBJECTIVE: Turn the user's tasks into a realistic, achievable plan for today.
INSTRUCTIONS:
- Identify individual tasks, prioritise by deadline pressure, effort and impact.
- Build a schedule inside a normal working day (roughly 08:00-17:00) with short breaks; never schedule more work than fits.
- Fixed-time commitments (e.g. a meeting at 10 AM) keep their stated time.
- Mark urgency honestly; do not invent deadlines that were not given.
- Planning notes explain briefly WHY the top items were prioritised (2-4 short notes).
${RESPONSIBLE_AI_RULES}
OUTPUT FORMAT: Return ONLY JSON:
{"planDate": string, "blocks": [{"time": string, "task": string, "priority": "high"|"medium"|"low", "duration": string}], "priorities": {"high": string[], "medium": string[], "low": string[]}, "notes": string[]}`;

    const taskLines = data.tasks
      .filter((t) => t.name.trim())
      .map(
        (t) =>
          `- ${t.name} | deadline: ${t.deadline || "Not specified"} | estimated duration: ${t.duration || "Not specified"} | priority: ${t.priority || "Not specified"}`,
      )
      .join("\n");

    const user = `Structured tasks:\n${taskLines || "None provided"}\n\nNatural language description:\n${data.brainDump || "None provided"}`;

    try {
      const out = await aiJson<PlanResult>(system, user);
      return {
        planDate: out.planDate ?? "Today",
        blocks: out.blocks ?? [],
        priorities: {
          high: out.priorities?.high ?? [],
          medium: out.priorities?.medium ?? [],
          low: out.priorities?.low ?? [],
        },
        notes: out.notes ?? [],
      };
    } catch (err) {
      throw toError(err);
    }
  });

export const runResearch = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ResearchInput.parse(d))
  .handler(async ({ data }): Promise<ResearchResult> => {
    const { aiJson, RESPONSIBLE_AI_RULES } = await import("./ai-gateway.server");
    const system = `ROLE: You are Capable Research Assistant, helping students and young professionals understand topics quickly and accurately.
OBJECTIVE: Produce a structured, honest research briefing for the requested topic and goal.
INSTRUCTIONS:
- If source material is supplied, ground the answer in it and say when something goes beyond it.
- Explain clearly, in accessible language, without dumbing down technical accuracy.
- Never cite sources, statistics or studies you cannot be confident about.
- The "uncertainty" field states plainly what is uncertain, contested, time-sensitive or outside your knowledge.
${RESPONSIBLE_AI_RULES}
OUTPUT FORMAT: Return ONLY JSON:
{"overview": string, "keyInsights": string[], "concepts": [{"term": string, "explanation": string}], "applications": string[], "risks": string[], "recommendations": string[], "uncertainty": string}`;

    const user = `Topic: ${data.topic}
What the user needs: ${data.goal}
Supplied material: ${data.material ? `\n"""\n${data.material}\n"""` : "None provided"}`;

    try {
      const out = await aiJson<ResearchResult>(system, user);
      return {
        overview: out.overview ?? "",
        keyInsights: out.keyInsights ?? [],
        concepts: out.concepts ?? [],
        applications: out.applications ?? [],
        risks: out.risks ?? [],
        recommendations: out.recommendations ?? [],
        uncertainty: out.uncertainty ?? "",
      };
    } catch (err) {
      throw toError(err);
    }
  });

export const chatWithCapable = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ChatInput.parse(d))
  .handler(async ({ data }): Promise<{ reply: string }> => {
    const { aiText, RESPONSIBLE_AI_RULES } = await import("./ai-gateway.server");
    const system = `ROLE: You are Capable AI, a workplace productivity assistant for students, interns, graduates and young professionals.
OBJECTIVE: Give practical, concise, professional help with communication, planning, learning, career preparation and everyday work tasks.
INSTRUCTIONS:
- Be direct and useful. Prefer short paragraphs, bullets and concrete examples over long essays.
- Ask a clarifying question only when the answer would otherwise be wrong.
- Use markdown for structure.
${RESPONSIBLE_AI_RULES}`;

    const history = data.messages.slice(0, -1);
    const last = data.messages[data.messages.length - 1]!;

    try {
      const reply = await aiText(system, last.content, history);
      return { reply };
    } catch (err) {
      throw toError(err);
    }
  });
