"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAppSettings } from "@/hooks/useAppSettings";

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  "/dashboard":  { title: "Dashboard",              subtitle: "Visão geral da sua biblioteca musical" },
  "/playlists":  { title: "Playlists",              subtitle: "Suas coleções de músicas" },
  "/library":    { title: "Biblioteca",             subtitle: "Todas as músicas baixadas" },
  "/queue":      { title: "Fila de Processamento",  subtitle: "Acompanhe o status dos downloads" },
  "/settings":   { title: "Configurações",          subtitle: "Preferências do sistema" },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { settings, update } = useAppSettings();
  const pathname = usePathname();

  const meta = PAGE_META[pathname] ??
    (pathname.startsWith("/playlists/")
      ? { title: "Detalhes da Playlist", subtitle: "Músicas e progresso" }
      : { title: "SoundVault", subtitle: "" });

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0D0E1C",
        color: "#fff",
      }}
    >
      <Sidebar
        pathname={pathname}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        accentColor={settings.accentColor}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          overflowY: "auto",
          height: "100vh",
        }}
      >
        <PageHeader
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuClick={() => setMobileOpen(true)}
          accentColor={settings.accentColor}
          pathname={pathname}
        />
        <main style={{ flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
