import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Send, Sparkles, Trash2, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import { ErrorState, LoadingState, PageHeader, ReviewNotice } from "@/components/ai-ui";
import { chatWithCapable } from "@/lib/ai.functions";

export const Route = createFileRoute("/capable-ai")({
  validateSearch: (s: Record<string, unknown>) => ({
    q: typeof s["q"] === "string" ? (s["q"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Capable AI — Your AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Chat with Capable AI for practical help with interviews, CVs, presentations, professional messages and everyday workload questions.",
      },
      { property: "og:title", content: "Capable AI — Your AI workplace assistant" },
      { property: "og:description", content: "Practical, concise, professional AI help for early-career work." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CapableAI,
});

type Msg = { role: "user" | "assistant"; content: string };

const suggestions = [
  "Help me prepare for a job interview.",
  "Help me write a professional LinkedIn message.",
  "Explain this technical concept simply.",
  "Help me prepare for a presentation.",
  "Help me improve my CV.",
  "Help me organize my workload.",
];

function CapableAI() {
  const { q } = Route.useSearch();
  const chat = useServerFn(chatWithCapable);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState(q ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const value = text.trim();
    if (value.length < 2 || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: value }];
    setMessages(next);
    setInput("");
    setError(null);
    setLoading(true);
    try {
      const res = await chat({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: res.reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col">
      <PageHeader title="Capable AI" subtitle="Your AI workplace assistant." icon={Sparkles} />

      <div className="card-surface flex min-h-[28rem] flex-col p-4 sm:p-6">
        <div className="flex-1 space-y-5" aria-live="polite">
          {messages.length === 0 && !loading && (
            <div className="py-6 text-center">
              <p className="text-sm text-muted-foreground">
                Ask anything about your work, studies or career. Try one of these:
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void send(s)}
                    className="rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className="flex gap-3">
              <span
                className={
                  m.role === "user"
                    ? "flex size-8 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground"
                    : "flex size-8 shrink-0 items-center justify-center rounded-xl bg-ink text-ink-foreground"
                }
              >
                {m.role === "user" ? (
                  <User className="size-4" aria-hidden />
                ) : (
                  <Sparkles className="size-4" aria-hidden />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-muted-foreground">
                  {m.role === "user" ? "You" : "Capable AI"}
                </p>
                {m.role === "user" ? (
                  <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">{m.content}</p>
                ) : (
                  <div className="ai-prose mt-1 text-sm text-foreground">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && <LoadingState label="Capable AI is thinking…" />}
          {error && <ErrorState message={error} />}
          <div ref={endRef} />
        </div>

        <form
          className="mt-6 border-t border-border pt-4"
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
        >
          <label htmlFor="chat-input" className="sr-only">
            Message Capable AI
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Capable AI anything…"
              className="flex-1 rounded-xl bg-muted/60 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={input.trim().length < 2 || loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <Send className="size-4" aria-hidden />
                Send
              </button>
              <button
                type="button"
                onClick={() => {
                  setMessages([]);
                  setError(null);
                }}
                disabled={messages.length === 0 || loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <Trash2 className="size-4" aria-hidden />
                Clear
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="mt-4">
        <ReviewNotice>You remain responsible for reviewing anything you use from this conversation.</ReviewNotice>
      </div>
    </div>
  );
}
