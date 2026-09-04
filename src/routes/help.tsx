import { createFileRoute } from "@tanstack/react-router";
import { LifeBuoy, ShieldAlert } from "lucide-react";

import { PageHeader, Panel } from "@/components/ai-ui";
import { toolItems } from "@/lib/nav";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & Responsible AI — Capable" },
      {
        name: "description",
        content:
          "Learn what Capable does, how each AI tool works, how to write effective prompts and why you should verify AI-generated information.",
      },
      { property: "og:title", content: "Help & Responsible AI — Capable" },
      { property: "og:description", content: "Guides for using Capable's AI tools responsibly and effectively." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HelpPage,
});

const promptTips = [
  "Say who the output is for — a manager, lecturer, client or teammate.",
  "Include the real details: dates, names and deadlines. Capable will not invent them.",
  "State the outcome you want, for example 'ask for Friday remote work politely'.",
  "Choose a tone and length instead of accepting the default.",
  "Iterate: regenerate or edit the output rather than starting from scratch.",
];

const principles = [
  "Capable never knowingly fabricates facts, names, dates or sources.",
  "Missing information is shown as 'Not specified' rather than guessed.",
  "Uncertainty is stated clearly instead of presented as fact.",
  "High-stakes professional decisions stay with you, not the AI.",
  "You review and approve every piece of generated content before you use it.",
];

function HelpPage() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <PageHeader
        title="Help"
        subtitle="How Capable works and how to get the best from it."
        icon={LifeBuoy}
      />

      <div className="space-y-6">
        <Panel title="What Capable does">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Capable is one AI workspace for students, interns, graduates and young professionals. It helps you
            communicate, summarize, plan, research and solve everyday academic and workplace tasks — so you can work
            smarter and grow capable.
          </p>
        </Panel>

        <Panel title="How each AI tool works">
          <ul className="space-y-4">
            {toolItems.map((tool) => {
              const Icon = tool.icon;
              return (
                <li key={tool.to} className="flex gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
                    <Icon className="size-4.5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{tool.label}</p>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-5 text-sm text-muted-foreground">
            Every tool follows the same flow: enter your input, let the AI process it, review the structured output,
            then edit, copy or regenerate.
          </p>
        </Panel>

        <Panel title="How to write effective prompts">
          <ul className="space-y-2">
            {promptTips.map((tip) => (
              <li key={tip} className="flex gap-2 text-sm text-muted-foreground">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                {tip}
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Why you should verify AI output">
          <p className="text-sm leading-relaxed text-muted-foreground">
            AI models predict likely text; they do not check facts. Details such as figures, policies, citations and
            technical claims can be wrong even when the writing sounds confident. Verify anything important against a
            reliable source, and confirm names, dates and commitments with the people involved before sending.
          </p>
        </Panel>

        <Panel title="Responsible AI principles">
          <ul className="space-y-2">
            {principles.map((p) => (
              <li key={p} className="flex gap-2 text-sm text-muted-foreground">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-success" aria-hidden />
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex gap-3 rounded-xl bg-muted/60 p-4">
            <ShieldAlert className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Capable uses artificial intelligence to generate suggestions and content. AI-generated information may
              contain errors or inaccuracies. Always review and verify important information before using it for
              professional, academic, financial, legal, medical, or other important decisions.
            </p>
          </div>
        </Panel>
      </div>
    </div>
  );
}
