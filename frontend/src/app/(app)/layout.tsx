"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { useAppSettings } from "@/hooks/useAppSettings";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { settings } = useAppSettings();
  const pathname = usePathname();

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0D0E1C", color: "#fff", overflow: "hidden" }}>
      <Sidebar
        pathname={pathname}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        accentColor={settings.accentColor}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <AppHeader
          onMenuClick={() => setMobileOpen(true)}
          accentColor={settings.accentColor}
        />
        <main style={{ flex: 1, overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
