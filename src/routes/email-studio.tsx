import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Mail, RefreshCw, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";

import {
  CopyButton,
  EmptyState,
  ErrorState,
  Field,
  LoadingState,
  PageHeader,
  Panel,
  ReviewNotice,
} from "@/components/ai-ui";
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email-studio")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s["q"] === "string" ? (s["q"] as string) : undefined }),
  head: () => ({
    meta: [
      { title: "Email Studio — Capable" },
      {
        name: "description",
        content: "Write better workplace emails in less time with AI-assisted tone, length and structure control.",
      },
      { property: "og:title", content: "Email Studio — Capable" },
      { property: "og:description", content: "Turn a plain sentence into a polished, professional workplace email." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailStudio,
});

const tones = ["Formal", "Friendly", "Persuasive", "Concise", "Apologetic"] as const;
const lengths = ["Short", "Medium", "Detailed"] as const;

function EmailStudio() {
  const { q } = Route.useSearch();
  const run = useServerFn(generateEmail);

  const [context, setContext] = useState("");
  const [intent, setIntent] = useState(q ?? "");
  const [tone, setTone] = useState<(typeof tones)[number]>("Formal");
  const [length, setLength] = useState<(typeof lengths)[number]>("Medium");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [hasResult, setHasResult] = useState(false);

  const valid = intent.trim().length >= 10;

  const generate = async () => {
    if (!valid || loading) return;
    setLoading(true);
    setError(null);
    try {
      const out = await run({ data: { context: context.trim(), intent: intent.trim(), tone, length } });
      setSubject(out.subject);
      setBody(out.body);
      setHasResult(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate the email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setContext("");
    setIntent("");
    setSubject("");
    setBody("");
    setHasResult(false);
    setError(null);
  };

  return (
    <div>
      <PageHeader title="Email Studio" subtitle="Write better workplace emails in less time." icon={Mail} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Tell Capable what you need">
          <div className="space-y-5">
            <Field label="Recipient / Context" htmlFor="context" optional hint="Who is this email for, and why?">
              <input
                id="context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="My line manager, Sarah, at my internship"
                className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
              />
            </Field>

            <Field
              label="What do you want to say?"
              htmlFor="intent"
              hint="Describe it in your own words. Capable will not invent dates, names or commitments you didn't mention."
            >
              <textarea
                id="intent"
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                rows={6}
                placeholder="I need to ask my manager if I can work remotely on Friday because I have an appointment."
                className="w-full resize-y rounded-xl border border-input bg-card px-4 py-3 text-sm leading-relaxed outline-none transition-colors focus:border-primary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
              />
            </Field>

            {intent.trim().length > 0 && !valid && (
              <p className="text-xs font-medium text-destructive">
                Add a little more detail (at least 10 characters) so the email is accurate.
              </p>
            )}

            <Field label="Tone">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Tone">
                {tones.map((t) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={tone === t}
                    onClick={() => setTone(t)}
                    className={
                      tone === t
                        ? "rounded-full bg-ink px-4 py-2 text-sm font-semibold text-ink-foreground"
                        : "rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Length">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Length">
                {lengths.map((l) => (
                  <button
                    key={l}
                    type="button"
                    aria-pressed={length === l}
                    onClick={() => setLength(l)}
                    className={
                      length === l
                        ? "rounded-full bg-ink px-4 py-2 text-sm font-semibold text-ink-foreground"
                        : "rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
                    }
                  >
                    {l}
                  </button>
                ))}
              </div>
            </Field>

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="button"
                onClick={generate}
                disabled={!valid || loading}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <Sparkles className="size-4" aria-hidden />
                {loading ? "Generating…" : "Generate Email"}
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <Trash2 className="size-4" aria-hidden />
                Clear
              </button>
            </div>
          </div>
        </Panel>

        <Panel title="Generated Email" description="Fully editable before you send.">
          <div className="space-y-4">
            {error && <ErrorState message={error} />}
            {loading && <LoadingState label="Drafting your email…" />}

            {!loading && !hasResult && !error && (
              <EmptyState
                icon={Mail}
                title="No email yet"
                description="Describe what you want to say and Capable will draft a professional version you can edit."
              />
            )}

            {!loading && hasResult && (
              <>
                <Field label="Subject" htmlFor="subject">
                  <input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm font-medium outline-none focus:border-primary"
                  />
                </Field>
                <Field label="Email body" htmlFor="body">
                  <textarea
                    id="body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={14}
                    className="w-full resize-y rounded-xl border border-input bg-card px-4 py-3 text-sm leading-relaxed outline-none focus:border-primary"
                  />
                </Field>
                <div className="flex flex-wrap gap-3">
                  <CopyButton value={`Subject: ${subject}\n\n${body}`} label="Copy" />
                  <button
                    type="button"
                    onClick={generate}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
                  >
                    <RefreshCw className="size-4" aria-hidden />
                    Regenerate
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSubject("");
                      setBody("");
                      setHasResult(false);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <Trash2 className="size-4" aria-hidden />
                    Clear
                  </button>
                </div>
                <ReviewNotice />
              </>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
