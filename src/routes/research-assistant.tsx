import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { BookOpen, RefreshCw, ShieldAlert, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";

import {
  BulletList,
  CopyButton,
  EmptyState,
  ErrorState,
  Field,
  LoadingState,
  OutputSection,
  PageHeader,
  Panel,
} from "@/components/ai-ui";
import { runResearch, type ResearchResult } from "@/lib/ai.functions";

export const Route = createFileRoute("/research-assistant")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s["q"] === "string" ? (s["q"] as string) : undefined }),
  head: () => ({
    meta: [
      { title: "Research Assistant — Capable" },
      {
        name: "description",
        content:
          "Understand complex topics faster with structured AI research: overviews, key insights, concepts, risks and recommendations.",
      },
      { property: "og:title", content: "Research Assistant — Capable" },
      { property: "og:description", content: "Understand complex topics faster." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResearchAssistant,
});

const goals = [
  "Explain a topic",
  "Summarize information",
  "Compare concepts",
  "Identify key insights",
  "Generate recommendations",
  "Create study notes",
] as const;

function toText(r: ResearchResult, topic: string) {
  return [
    `RESEARCH: ${topic}`,
    "",
    "OVERVIEW",
    r.overview,
    "",
    "KEY INSIGHTS",
    ...r.keyInsights.map((i) => `- ${i}`),
    "",
    "IMPORTANT CONCEPTS",
    ...r.concepts.map((c) => `- ${c.term}: ${c.explanation}`),
    "",
    "OPPORTUNITIES / APPLICATIONS",
    ...r.applications.map((i) => `- ${i}`),
    "",
    "RISKS OR LIMITATIONS",
    ...r.risks.map((i) => `- ${i}`),
    "",
    "RECOMMENDATIONS",
    ...r.recommendations.map((i) => `- ${i}`),
    "",
    "UNCERTAINTY",
    r.uncertainty,
  ].join("\n");
}

function ResearchAssistant() {
  const { q } = Route.useSearch();
  const run = useServerFn(runResearch);

  const [topic, setTopic] = useState(q && !q.toLowerCase().startsWith("explain this topic") ? (q ?? "") : "");
  const [goal, setGoal] = useState<(typeof goals)[number]>("Explain a topic");
  const [material, setMaterial] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResearchResult | null>(null);

  const valid = topic.trim().length >= 3;

  const generate = async () => {
    if (!valid || loading) return;
    setLoading(true);
    setError(null);
    try {
      const out = await run({ data: { topic: topic.trim(), goal, material: material.trim() } });
      setResult(out);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not complete this research. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Research Assistant" subtitle="Understand complex topics faster." icon={BookOpen} />

      <div className="mb-6 flex items-start gap-3 rounded-xl border border-primary/25 bg-accent p-4 text-sm text-accent-foreground">
        <ShieldAlert className="mt-0.5 size-4.5 shrink-0" aria-hidden />
        <p className="font-medium">Always verify important information using reliable sources.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <Panel title="What are you researching?">
          <div className="space-y-5">
            <Field label="Research Topic" htmlFor="topic">
              <input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. How machine learning is used in fraud detection"
                className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </Field>
            {topic.length > 0 && !valid && (
              <p className="text-xs font-medium text-destructive">Enter a topic with at least 3 characters.</p>
            )}

            <Field label="What do you need?">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Research goal">
                {goals.map((g) => (
                  <button
                    key={g}
                    type="button"
                    aria-pressed={goal === g}
                    onClick={() => setGoal(g)}
                    className={
                      goal === g
                        ? "rounded-full bg-ink px-4 py-2 text-sm font-semibold text-ink-foreground"
                        : "rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
                    }
                  >
                    {g}
                  </button>
                ))}
              </div>
            </Field>

            <Field
              label="Paste an article, document or research material"
              htmlFor="material"
              optional
              hint="When you supply material, Capable grounds its answer in it."
            >
              <textarea
                id="material"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                rows={9}
                placeholder="Paste text here…"
                className="w-full resize-y rounded-xl border border-input bg-card px-4 py-3 text-sm leading-relaxed outline-none focus:border-primary"
              />
            </Field>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={generate}
                disabled={!valid || loading}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Sparkles className="size-4" aria-hidden />
                {loading ? "Researching…" : "Research with AI"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTopic("");
                  setMaterial("");
                  setResult(null);
                  setError(null);
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <Trash2 className="size-4" aria-hidden />
                Clear
              </button>
            </div>
          </div>
        </Panel>

        <Panel title="Research briefing">
          <div className="space-y-5">
            {error && <ErrorState message={error} />}
            {loading && <LoadingState label="Researching your topic…" />}
            {!loading && !result && !error && (
              <EmptyState
                icon={BookOpen}
                title="No briefing yet"
                description="Enter a topic and Capable will structure the essentials, flagging anything uncertain."
              />
            )}

            {!loading && result && (
              <>
                <OutputSection title="Overview">
                  <p className="text-sm leading-relaxed text-foreground">{result.overview}</p>
                </OutputSection>
                <OutputSection title="Key Insights">
                  <BulletList items={result.keyInsights} empty="None identified." />
                </OutputSection>
                <OutputSection title="Important Concepts">
                  {result.concepts.length ? (
                    <dl className="space-y-3">
                      {result.concepts.map((c, i) => (
                        <div key={i} className="rounded-xl border border-border p-3.5">
                          <dt className="text-sm font-semibold text-foreground">{c.term}</dt>
                          <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.explanation}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <p className="text-sm italic text-muted-foreground">None identified.</p>
                  )}
                </OutputSection>
                <OutputSection title="Opportunities / Applications">
                  <BulletList items={result.applications} empty="None identified." />
                </OutputSection>
                <OutputSection title="Risks or Limitations">
                  <BulletList items={result.risks} empty="None identified." />
                </OutputSection>
                <OutputSection title="Recommendations">
                  <BulletList items={result.recommendations} empty="None provided." />
                </OutputSection>

                {result.uncertainty && (
                  <div className="rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm leading-relaxed text-foreground">
                    <p className="mb-1 font-semibold">What is uncertain</p>
                    <p>{result.uncertainty}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <CopyButton value={toText(result, topic)} label="Copy briefing" />
                  <button
                    type="button"
                    onClick={generate}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <RefreshCw className="size-4" aria-hidden />
                    Regenerate
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  This briefing is AI-generated and is not verified fact. Always verify important information using
                  reliable sources.
                </p>
              </>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
