import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";

import { Field, PageHeader, Panel } from "@/components/ai-ui";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Capable" },
      {
        name: "description",
        content:
          "Manage your Capable profile name, theme preference, AI response style and responsible AI information.",
      },
      { property: "og:title", content: "Settings — Capable" },
      { property: "og:description", content: "Profile, theme and AI response preferences for Capable." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

const themes = ["System", "Light", "Dark"] as const;
const lengths = ["Concise", "Balanced", "Detailed"] as const;
const tones = ["Professional", "Friendly", "Direct"] as const;

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

function SettingsPage() {
  const [name, setName] = useState("Thabo");
  const [theme, setTheme] = useState<(typeof themes)[number]>("System");
  const [length, setLength] = useState<(typeof lengths)[number]>("Balanced");
  const [tone, setTone] = useState<(typeof tones)[number]>("Professional");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = theme === "Dark" || (theme === "System" && prefersDark);
    root.classList.toggle("dark", dark);
  }, [theme]);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 2500);
    return () => clearTimeout(t);
  }, [saved]);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <PageHeader title="Settings" subtitle="Personalise Capable and how the AI responds." icon={SettingsIcon} />

      <div className="space-y-6">
        <Panel title="Profile" description="How Capable greets you across the app.">
          <Field label="Profile name" htmlFor="profile-name">
            <input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </Field>
        </Panel>

        <Panel title="Theme preference" description="Choose how Capable looks on this device.">
          <div className="flex flex-wrap gap-2">
            {themes.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                aria-pressed={theme === t}
                className={
                  theme === t
                    ? "rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-ink-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    : "rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                }
              >
                {t}
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="AI response preferences" description="Your preferred default style for generated content.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Response length" htmlFor="pref-length">
              <select
                id="pref-length"
                value={length}
                onChange={(e) => setLength(e.target.value as (typeof lengths)[number])}
                className={inputClass}
              >
                {lengths.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </Field>
            <Field label="Default tone" htmlFor="pref-tone">
              <select
                id="pref-tone"
                value={tone}
                onChange={(e) => setTone(e.target.value as (typeof tones)[number])}
                className={inputClass}
              >
                {tones.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSaved(true)}
              className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Save preferences
            </button>
            {saved && (
              <span className="rounded-full bg-success-soft px-3 py-1 text-xs font-semibold text-success" role="status">
                Preferences saved for this session
              </span>
            )}
          </div>
        </Panel>

        <Panel title="Responsible AI">
          <div className="flex gap-3 rounded-xl bg-muted/60 p-4">
            <ShieldAlert className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Capable uses artificial intelligence to generate suggestions and content. AI-generated information may
              contain errors or inaccuracies. Always review and verify important information before using it for
              professional, academic, financial, legal, medical, or other important decisions.
            </p>
          </div>
        </Panel>

        <Panel title="About Capable">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Capable is an AI productivity assistant for students, interns, graduates and young professionals. It brings
            email writing, meeting summaries, task planning, research and a general workplace assistant into one
            workspace. Tagline: <span className="font-semibold text-foreground">Work smarter. Grow capable.</span>
          </p>
        </Panel>
      </div>
    </div>
  );
}
