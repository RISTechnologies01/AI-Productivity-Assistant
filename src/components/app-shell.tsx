import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Loader2, LogOut, Menu, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { useAuth } from "@/hooks/use-auth";
import { navGroups } from "@/lib/nav";
import { cn } from "@/lib/utils";

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-primary">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary font-display text-lg font-bold text-primary-foreground">
        C
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-lg font-bold tracking-tight text-sidebar-foreground">Capable</span>
          <span className="mt-1 text-[11px] text-ink-muted">Work smarter. Grow capable.</span>
        </span>
      )}
    </Link>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-6" aria-label="Main navigation">
      {navGroups.map((group) => (
        <div key={group.title}>
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
            {group.title}
          </p>
          <ul className="space-y-1">
            {group.items.map((item) => {
              const active = pathname === item.to;
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring",
                      active && "bg-sidebar-accent text-sidebar-foreground",
                    )}
                  >
                    <Icon className={cn("size-4.5 shrink-0", active && "text-primary")} aria-hidden />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function SidebarFooter() {
  return (
    <div className="border-t border-sidebar-border px-5 py-4">
      <p className="text-[11px] leading-relaxed text-ink-muted">
        AI can make mistakes. Review important content before you send or submit it.
      </p>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] flex-col bg-sidebar lg:flex">
        <div className="px-5 py-6">
          <Logo />
        </div>
        <NavLinks />
        <SidebarFooter />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between bg-sidebar px-4 py-3 lg:hidden">
        <Logo compact />
        <span className="font-display text-base font-bold text-sidebar-foreground">Capable</span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          className="flex size-10 items-center justify-center rounded-xl text-sidebar-foreground transition-colors hover:bg-sidebar-accent focus-visible:outline-2 focus-visible:outline-sidebar-ring"
        >
          {open ? <Menu className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/60"
          />
          <div className="absolute inset-y-0 left-0 flex w-[280px] max-w-[85vw] flex-col bg-sidebar shadow-lift">
            <div className="flex items-center justify-between px-5 py-5">
              <Logo />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close navigation menu"
                className="flex size-9 items-center justify-center rounded-lg text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
            <SidebarFooter />
          </div>
        </div>
      )}

      <div className="lg:pl-[264px]">
        <main id="main-content" className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
          {children}
        </main>
        <footer className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 lg:px-10">
          <div className="card-surface p-5">
            <p className="font-display text-sm font-bold text-foreground">Responsible AI Notice</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Capable uses artificial intelligence to generate suggestions and content. AI-generated information may
              contain errors or inaccuracies. Always review and verify important information before using it for
              professional, academic, financial, legal, medical, or other important decisions.
            </p>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Capable — Work smarter. Grow capable.
          </p>
        </footer>
      </div>
    </div>
  );
}
