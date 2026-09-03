import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Circle, ListChecks, Plus, RefreshCw, Sparkles, Trash2 } from "lucide-react";
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
  ReviewNotice,
} from "@/components/ai-ui";
import { buildPlan, type PlanResult } from "@/lib/ai.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/task-planner")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s["q"] === "string" ? (s["q"] as string) : undefined }),
  head: () => ({
    meta: [
      { title: "Task Planner — Capable" },
      {
        name: "description",
        content: "Turn your workload into a realistic daily plan with AI prioritisation, time blocks and reasoning.",
      },
      { property: "og:title", content: "Task Planner — Capable" },
      { property: "og:description", content: "Turn your workload into a realistic plan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TaskPlanner,
});

type TaskRow = {
  id: string;
  name: string;
  deadline: string;
  duration: string;
  priority: string;
  done: boolean;
};

const priorities = ["", "High", "Medium", "Low"];

const newRow = (): TaskRow => ({
  id: crypto.randomUUID(),
  name: "",
  deadline: "",
  duration: "",
  priority: "",
  done: false,
});

function priorityClass(p: string) {
  const v = p.toLowerCase();
  if (v === "high") return "bg-accent text-accent-foreground";
  if (v === "medium") return "bg-muted text-foreground";
  return "bg-success-soft text-success";
}

function TaskPlanner() {
  const { q } = Route.useSearch();
  const run = useServerFn(buildPlan);

  const [rows, setRows] = useState<TaskRow[]>([newRow()]);
  const [brainDump, setBrainDump] = useState(q && !q.toLowerCase().startsWith("help me plan") ? q : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<PlanResult | null>(null);
  const [doneBlocks, setDoneBlocks] = useState<Record<number, boolean>>({});

  const filled = rows.filter((r) => r.name.trim());
  const valid = filled.length > 0 || brainDump.trim().length >= 10;

  const update = (id: string, patch: Partial<TaskRow>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const generate = async () => {
    if (!valid || loading) return;
    setLoading(true);
    setError(null);
    try {
      const out = await run({
        data: {
          brainDump: brainDump.trim(),
          tasks: filled.map((r) => ({
            name: r.name.trim(),
            deadline: r.deadline.trim(),
            duration: r.duration.trim(),
            priority: r.priority,
          })),
        },
      });
      setPlan(out);
      setDoneBlocks({});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not build your plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const planText = plan
    ? [
        `TODAY'S PLAN (${plan.planDate})`,
        ...plan.blocks.map((b) => `${b.time} — ${b.task} (${b.priority}, ${b.duration})`),
        "",
        "PRIORITY BREAKDOWN",
        `High: ${plan.priorities.high.join("; ") || "None"}`,
        `Medium: ${plan.priorities.medium.join("; ") || "None"}`,
        `Low: ${plan.priorities.low.join("; ") || "None"}`,
        "",
        "AI PLANNING NOTES",
        ...plan.notes.map((n) => `- ${n}`),
      ].join("\n")
    : "";

  return (
    <div>
      <PageHeader title="Task Planner" subtitle="Turn your workload into a realistic plan." icon={ListChecks} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <Panel title="Your tasks" description="Add tasks, describe your workload, or do both.">
          <div className="space-y-5">
            <div className="space-y-3">
              {rows.map((row, i) => (
                <div key={row.id} className="rounded-xl border border-border p-3">
                  <div className="flex items-start gap-2">
                    <button
                      type="button"
                      aria-label={row.done ? `Mark ${row.name || "task"} incomplete` : `Mark ${row.name || "task"} complete`}
                      onClick={() => update(row.id, { done: !row.done })}
                      className="mt-2.5 shrink-0 text-muted-foreground transition-colors hover:text-success"
                    >
                      {row.done ? (
                        <CheckCircle2 className="size-5 text-success" aria-hidden />
                      ) : (
                        <Circle className="size-5" aria-hidden />
                      )}
                    </button>
                    <div className="flex-1 space-y-2">
                      <input
                        aria-label={`Task ${i + 1} name`}
                        value={row.name}
                        onChange={(e) => update(row.id, { name: e.target.value })}
                        placeholder="Task name"
                        className={cn(
                          "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary",
                          row.done && "text-success line-through",
                        )}
                      />
                      <div className="grid gap-2 sm:grid-cols-3">
                        <input
                          aria-label={`Task ${i + 1} deadline`}
                          value={row.deadline}
                          onChange={(e) => update(row.id, { deadline: e.target.value })}
                          placeholder="Deadline"
                          className="rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                        />
                        <input
                          aria-label={`Task ${i + 1} estimated duration`}
                          value={row.duration}
                          onChange={(e) => update(row.id, { duration: e.target.value })}
                          placeholder="Est. duration"
                          className="rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                        />
                        <select
                          aria-label={`Task ${i + 1} priority`}
                          value={row.priority}
                          onChange={(e) => update(row.id, { priority: e.target.value })}
                          className="rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                        >
                          {priorities.map((p) => (
                            <option key={p || "none"} value={p}>
                              {p || "Priority"}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-label={`Delete task ${i + 1}`}
                      onClick={() => setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== row.id) : [newRow()]))}
                      className="mt-2 shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setRows((prev) => [...prev, newRow()])}
                className="inline-flex items-center gap-2 rounded-xl border border-dashed border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                <Plus className="size-4" aria-hidden />
                Add task
              </button>
            </div>

            <Field
              label="Or just describe your workload"
              htmlFor="brain-dump"
              optional
              hint="Capable will pull out the individual tasks for you."
            >
              <textarea
                id="brain-dump"
                value={brainDump}
                onChange={(e) => setBrainDump(e.target.value)}
                rows={4}
                placeholder="I have a report due Friday, a presentation next week, three emails to answer, and a meeting at 10 AM."
                className="w-full resize-y rounded-xl border border-input bg-card px-4 py-3 text-sm leading-relaxed outline-none focus:border-primary"
              />
            </Field>

            {!valid && (rows.some((r) => r.name) || brainDump.length > 0) && (
              <p className="text-xs font-medium text-destructive">Add at least one task or describe your workload.</p>
            )}

            <button
              type="button"
              onClick={generate}
              disabled={!valid || loading}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Sparkles className="size-4" aria-hidden />
              {loading ? "Building…" : "Build My Plan"}
            </button>
          </div>
        </Panel>

        <Panel title="Today's Plan">
          <div className="space-y-6">
            {error && <ErrorState message={error} />}
            {loading && <LoadingState label="Prioritising your workload…" />}
            {!loading && !plan && !error && (
              <EmptyState
                icon={ListChecks}
                title="No plan yet"
                description="Add your tasks and Capable will build a realistic schedule with priorities and reasoning."
              />
            )}

            {!loading && plan && (
              <>
                <OutputSection title={`Time blocks — ${plan.planDate}`}>
                  <ul className="space-y-2">
                    {plan.blocks.map((b, i) => {
                      const done = !!doneBlocks[i];
                      return (
                        <li
                          key={i}
                          className={cn(
                            "flex items-start gap-3 rounded-xl border border-border p-3.5 transition-colors",
                            done && "border-success/40 bg-success-soft",
                          )}
                        >
                          <button
                            type="button"
                            aria-label={done ? `Mark ${b.task} incomplete` : `Mark ${b.task} complete`}
                            onClick={() => setDoneBlocks((prev) => ({ ...prev, [i]: !prev[i] }))}
                            className="mt-0.5 text-muted-foreground transition-colors hover:text-success"
                          >
                            {done ? (
                              <CheckCircle2 className="size-5 text-success" aria-hidden />
                            ) : (
                              <Circle className="size-5" aria-hidden />
                            )}
                          </button>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              {b.time} · {b.duration}
                            </p>
                            <p className={cn("mt-1 text-sm font-medium text-foreground", done && "line-through")}>
                              {b.task}
                            </p>
                          </div>
                          <span
                            className={cn(
                              "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase",
                              priorityClass(b.priority),
                            )}
                          >
                            {b.priority}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </OutputSection>

                <OutputSection title="Priority Breakdown">
                  <div className="grid gap-3 sm:grid-cols-3">
                    {(["high", "medium", "low"] as const).map((level) => (
                      <div key={level} className="rounded-xl border border-border p-3.5">
                        <p
                          className={cn(
                            "mb-2 inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase",
                            priorityClass(level),
                          )}
                        >
                          {level}
                        </p>
                        {plan.priorities[level].length ? (
                          <ul className="space-y-1.5 text-sm text-foreground">
                            {plan.priorities[level].map((t, i) => (
                              <li key={i}>{t}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm italic text-muted-foreground">None</p>
                        )}
                      </div>
                    ))}
                  </div>
                </OutputSection>

                <OutputSection title="AI Planning Notes">
                  <BulletList items={plan.notes} empty="No notes provided." />
                </OutputSection>

                <div className="flex flex-wrap gap-3">
                  <CopyButton value={planText} label="Copy plan" />
                  <button
                    type="button"
                    onClick={generate}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <RefreshCw className="size-4" aria-hidden />
                    Regenerate plan
                  </button>
                </div>
                <ReviewNotice>
                  This schedule is a suggestion based on what you entered. Adjust it to fit your real commitments.
                </ReviewNotice>
              </>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
