import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { NotebookPen, RefreshCw, Sparkles, Trash2, Wand2 } from "lucide-react";
import { useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

import {
  BulletList,
  CopyButton,
  DemoBadge,
  EmptyState,
  ErrorState,
  Field,
  LoadingState,
  OutputSection,
  PageHeader,
  Panel,
  ReviewNotice,
} from "@/components/ai-ui";
import { summarizeMeeting, type MeetingResult } from "@/lib/ai.functions";

export const Route = createFileRoute("/meeting-intelligence")({
  head: () => ({
    meta: [
      { title: "Meeting Intelligence — Capable" },
      {
        name: "description",
        content:
          "Paste messy meeting notes and get a clear summary, key decisions, action items with owners and deadlines.",
      },
      { property: "og:title", content: "Meeting Intelligence — Capable" },
      { property: "og:description", content: "Turn meeting notes into clear, actionable information." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MeetingIntelligence,
});

const demoNotes = `Weekly team sync - Tuesday
Sarah said the client feedback on the onboarding flow was mostly positive but they want the signup steps reduced.
We agreed to cut the signup from 4 steps to 3.
Thabo to redo the wireframes by Friday.
Analytics dashboard still blocked - waiting on data team, nobody knows who owns it.
Budget for the extra design sprint not confirmed yet, Sarah will check with finance.
Next review meeting scheduled for the 14th.`;

function toPlainText(r: MeetingResult) {
  const lines = [
    "MEETING SUMMARY",
    r.summary,
    "",
    "KEY DECISIONS",
    ...(r.keyDecisions.length ? r.keyDecisions.map((d) => `- ${d}`) : ["Not specified"]),
    "",
    "ACTION ITEMS",
    ...(r.actionItems.length
      ? r.actionItems.map((a) => `- ${a.task} | Owner: ${a.owner} | Deadline: ${a.deadline}`)
      : ["Not specified"]),
    "",
    "IMPORTANT DISCUSSION POINTS",
    ...(r.discussionPoints.length ? r.discussionPoints.map((d) => `- ${d}`) : ["Not specified"]),
    "",
    "UNRESOLVED QUESTIONS",
    ...(r.unresolvedQuestions.length ? r.unresolvedQuestions.map((d) => `- ${d}`) : ["Not specified"]),
    "",
    "DEADLINES",
    ...(r.deadlines.length ? r.deadlines.map((d) => `- ${d}`) : ["Not specified"]),
  ];
  return lines.join("\n");
}

function MeetingIntelligence() {
  const run = useServerFn(summarizeMeeting);
  const { user } = useAuth();
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MeetingResult | null>(null);
  const [editable, setEditable] = useState("");
  const [editing, setEditing] = useState(false);

  const valid = notes.trim().length >= 20;

  const summarize = async () => {
    if (!valid || loading) return;
    setLoading(true);
    setError(null);
    try {
      const out = await run({ data: { notes: notes.trim() } });
      setResult(out);
      if (user) {
        await supabase.from("meetings").insert({ user_id: user.id, notes: notes.trim(), result: out as never });
      }
      setEditable(toPlainText(out));
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not summarize these notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Meeting Intelligence"
        subtitle="Turn meeting notes into clear, actionable information."
        icon={NotebookPen}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <Panel
          title="Paste your meeting notes"
          description="Unstructured, rough or long notes are fine."
          action={
            <button
              type="button"
              onClick={() => setNotes(demoNotes)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted"
            >
              <Wand2 className="size-3.5" aria-hidden />
              Load demo notes
            </button>
          }
        >
          <div className="space-y-4">
            <Field label="Meeting notes" htmlFor="notes">
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={16}
                placeholder="Paste your meeting notes here…"
                className="w-full resize-y rounded-xl border border-input bg-card px-4 py-3 text-sm leading-relaxed outline-none focus:border-primary"
              />
            </Field>
            {notes.trim().length > 0 && !valid && (
              <p className="text-xs font-medium text-destructive">
                Please paste at least a couple of sentences of notes.
              </p>
            )}
            {notes === demoNotes && (
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <DemoBadge /> Example notes loaded — replace them with your own at any time.
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={summarize}
                disabled={!valid || loading}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Sparkles className="size-4" aria-hidden />
                {loading ? "Summarizing…" : "Summarize Meeting"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setNotes("");
                  setResult(null);
                  setError(null);
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <Trash2 className="size-4" aria-hidden />
                Clear notes
              </button>
            </div>
          </div>
        </Panel>

        <Panel title="Structured output">
          <div className="space-y-5">
            {error && <ErrorState message={error} />}
            {loading && <LoadingState label="Reading your notes…" />}
            {!loading && !result && !error && (
              <EmptyState
                icon={NotebookPen}
                title="Nothing summarized yet"
                description="Paste notes and Capable will extract decisions, owners, deadlines and open questions — never inventing missing details."
              />
            )}

            {!loading && result && !editing && (
              <>
                <OutputSection title="Meeting Summary">
                  <p className="text-sm leading-relaxed text-foreground">{result.summary || "Not specified"}</p>
                </OutputSection>

                <OutputSection title="Key Decisions">
                  <BulletList items={result.keyDecisions} />
                </OutputSection>

                <OutputSection title="Action Items">
                  {result.actionItems.length ? (
                    <div className="overflow-x-auto rounded-xl border border-border">
                      <table className="w-full min-w-[480px] text-left text-sm">
                        <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
                          <tr>
                            <th scope="col" className="px-4 py-2.5 font-semibold">
                              Task
                            </th>
                            <th scope="col" className="px-4 py-2.5 font-semibold">
                              Responsible
                            </th>
                            <th scope="col" className="px-4 py-2.5 font-semibold">
                              Deadline
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.actionItems.map((a, i) => (
                            <tr key={i} className="border-t border-border align-top">
                              <td className="px-4 py-3 text-foreground">{a.task}</td>
                              <td className="px-4 py-3 text-muted-foreground">{a.owner || "Not specified"}</td>
                              <td className="px-4 py-3 text-muted-foreground">{a.deadline || "Not specified"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm italic text-muted-foreground">Not specified</p>
                  )}
                </OutputSection>

                <OutputSection title="Important Discussion Points">
                  <BulletList items={result.discussionPoints} />
                </OutputSection>

                <OutputSection title="Unresolved Questions">
                  <BulletList items={result.unresolvedQuestions} />
                </OutputSection>

                <OutputSection title="Deadlines">
                  <BulletList items={result.deadlines} />
                </OutputSection>
              </>
            )}

            {!loading && result && editing && (
              <Field label="Edit summary" htmlFor="edit-summary">
                <textarea
                  id="edit-summary"
                  value={editable}
                  onChange={(e) => setEditable(e.target.value)}
                  rows={22}
                  className="w-full resize-y rounded-xl border border-input bg-card px-4 py-3 font-mono text-xs leading-relaxed outline-none focus:border-primary"
                />
              </Field>
            )}

            {!loading && result && (
              <>
                <div className="flex flex-wrap gap-3">
                  <CopyButton value={editing ? editable : toPlainText(result)} label="Copy summary" />
                  <button
                    type="button"
                    onClick={() => setEditing((v) => !v)}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    {editing ? "Done editing" : "Edit output"}
                  </button>
                  <button
                    type="button"
                    onClick={summarize}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <RefreshCw className="size-4" aria-hidden />
                    Regenerate
                  </button>
                </div>
                <ReviewNotice>
                  Capable only uses what appears in your notes and marks anything missing as “Not specified”. Check the
                  action items before sharing them with your team.
                </ReviewNotice>
              </>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
