"use client";

import { useState } from "react";
import type { AppSettings } from "@/types";

const DEFAULT: AppSettings = {
  theme: "dark",
  accentColor: "#6C63FF",
  compactMode: false,
  animations: true,
  notifications: true,
  language: "pt-BR",
};

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT);

  const update = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  return { settings, update };
}
