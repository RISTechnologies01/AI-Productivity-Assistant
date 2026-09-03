import {
  LayoutDashboard,
  Mail,
  NotebookPen,
  ListChecks,
  BookOpen,
  Sparkles,
  Settings,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  description: string;
};

export type NavGroup = { title: string; items: NavItem[] };

export const navGroups: NavGroup[] = [
  {
    title: "Main",
    items: [
      {
        label: "Dashboard",
        to: "/",
        icon: LayoutDashboard,
        description: "Your productivity home base.",
      },
    ],
  },
  {
    title: "Productivity",
    items: [
      {
        label: "Email Studio",
        to: "/email-studio",
        icon: Mail,
        description: "Create professional emails in seconds.",
      },
      {
        label: "Meeting Intelligence",
        to: "/meeting-intelligence",
        icon: NotebookPen,
        description: "Turn messy meeting notes into clear summaries and action items.",
      },
      {
        label: "Task Planner",
        to: "/task-planner",
        icon: ListChecks,
        description: "Organize your workload and prioritize what matters.",
      },
    ],
  },
  {
    title: "AI Tools",
    items: [
      {
        label: "Research Assistant",
        to: "/research-assistant",
        icon: BookOpen,
        description: "Understand topics faster with AI-powered research support.",
      },
      {
        label: "Capable AI",
        to: "/capable-ai",
        icon: Sparkles,
        description: "Your general-purpose workplace AI assistant.",
      },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Settings", to: "/settings", icon: Settings, description: "Preferences and profile." },
      { label: "Help", to: "/help", icon: LifeBuoy, description: "Guides and responsible AI." },
    ],
  },
];

export const toolItems = navGroups
  .flatMap((g) => g.items)
  .filter((i) => i.to !== "/" && i.to !== "/settings" && i.to !== "/help");
