import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Mail, NotebookPen, Send, Sparkles, TrendingUp } from "lucide-react";
import { useState } from "react";

import { DemoBadge } from "@/components/ai-ui";
import { toolItems } from "@/lib/nav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Capable — AI Productivity Dashboard for Early Careers" },
      {
        name: "description",
        content:
          "Capable is an AI productivity assistant for students, interns and young professionals: write emails, summarize meetings, plan tasks and research faster.",
      },
      { property: "og:title", content: "Capable — Work smarter. Grow capable." },
      {
        property: "og:description",
        content:
          "One AI workspace for emails, meeting summaries, task planning, research and workplace questions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const examplePrompts = [
  "Write an email to my manager asking for leave.",
  "Summarize my meeting notes.",
  "Help me plan my day.",
  "Explain this topic.",
  "Help me prepare for an interview.",
];

const stats = [
  { label: "Tasks completed", value: "18", delta: "+5 this week", icon: CheckCircle2, tone: "success" as const },
  { label: "Emails generated", value: "12", delta: "+3 this week", icon: Mail, tone: "primary" as const },
  { label: "Meetings summarized", value: "7", delta: "+2 this week", icon: NotebookPen, tone: "ink" as const },
];

function routeForPrompt(prompt: string) {
  const p = prompt.toLowerCase();
  if (p.includes("email") || p.includes("write to")) return "/email-studio";
  if (p.includes("meeting") || p.includes("notes")) return "/meeting-intelligence";
  if (p.includes("plan") || p.includes("task") || p.includes("day")) return "/task-planner";
  if (p.includes("explain") || p.includes("research") || p.includes("study")) return "/research-assistant";
  return "/capable-ai";
}

function Dashboard() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  const go = (value: string) => {
    const target = routeForPrompt(value);
    navigate({ to: target, search: { q: value } as never });
  };

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{greeting}, Thabo 👋</h1>
        <p className="mt-2 text-base text-muted-foreground">What would you like to accomplish today?</p>

        <form
          className="mt-6 card-surface p-3 sm:p-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (prompt.trim().length < 3) return;
            go(prompt.trim());
          }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label htmlFor="dashboard-prompt" className="sr-only">
              What can I help you with?
            </label>
            <div className="flex flex-1 items-center gap-3 rounded-xl bg-muted/60 px-4 py-3">
              <Sparkles className="size-4.5 shrink-0 text-primary" aria-hidden />
              <input
                id="dashboard-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What can I help you with?"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
            <button
              type="submit"
              disabled={prompt.trim().length < 3}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Send className="size-4" aria-hidden />
              Get started
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {examplePrompts.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => go(p)}
                className="rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {p}
              </button>
            ))}
          </div>
        </form>
      </section>

      <section aria-labelledby="tools-heading">
        <h2 id="tools-heading" className="font-display text-xl font-bold text-foreground">
          Your AI toolkit
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {toolItems.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.to}
                to={tool.to}
                className="card-surface group flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <span className="flex size-11 items-center justify-center rounded-2xl bg-ink text-ink-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-foreground">{tool.label}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Open tool
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="overview-heading">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="overview-heading" className="font-display text-xl font-bold text-foreground">
            Productivity overview
          </h2>
          <DemoBadge />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Example figures shown so you can see how your activity will appear.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="card-surface p-5">
                <div className="flex items-center justify-between">
                  <span
                    className={
                      stat.tone === "success"
                        ? "flex size-10 items-center justify-center rounded-xl bg-success-soft text-success"
                        : stat.tone === "primary"
                          ? "flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground"
                          : "flex size-10 items-center justify-center rounded-xl bg-muted text-foreground"
                    }
                  >
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
                    <TrendingUp className="size-3.5" aria-hidden />
                    {stat.delta}
                  </span>
                </div>
                <p className="mt-4 font-display text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
