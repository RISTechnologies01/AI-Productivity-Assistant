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
        content: "Manage your Capable profile name, theme preference, AI response style and responsible AI information.",
      },
      { property: "og:title", content: "Settings — Capable" },
      { property: "og:description", content: "Profile, theme and AI response preferences for Capable." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage;
});

function SettingsPage() {
  return null;
}
