"use client";

import Link from "next/link";
import {
  SquaresFour,
  MusicNotes,
  Books,
  Queue,
  Gear,
  X,
  HardDrive,
} from "@phosphor-icons/react";
import { ProgressBar } from "@/components/ui/index";
import { hexToRgba, formatBytes } from "@/lib/utils";
import { useQueue } from "@/hooks/useApi";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard",  label: "Dashboard",   icon: <SquaresFour  size={17} weight="duotone" /> },
  { href: "/playlists",  label: "Playlists",   icon: <MusicNotes   size={17} weight="duotone" /> },
  { href: "/library",    label: "Biblioteca",  icon: <Books        size={17} weight="duotone" /> },
  { href: "/queue",      label: "Fila",        icon: <Queue        size={17} weight="duotone" /> },
  { href: "/settings",   label: "Configurações", icon: <Gear       size={17} weight="duotone" /> },
];

const STORAGE_USED = 892;
const STORAGE_CAP  = 5 * 1024;

interface SidebarProps {
  pathname: string;
  mobileOpen: boolean;
  onClose: () => void;
  accentColor: string;
}

export function Sidebar({ pathname, mobileOpen, onClose, accentColor }: SidebarProps) {
  const { data: queue } = useQueue();
  const queueCount = queue?.filter((j) => j.status === "pending" || j.status === "processing").length ?? 0;

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  const content = (
    <>
      {/* Logo */}
      <div style={{ padding: "20px 16px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${accentColor}, #43D9AD)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
          <MusicNotes size={18} weight="fill" />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>SoundDesk</div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em" }}>MUSIC LIBRARY</div>
        </div>
        <button onClick={onClose} className="sv-icon-btn" style={{ marginLeft: "auto", background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", display: "flex", padding: 4 }}>
          <X size={16} weight="bold" />
        </button>
      </div>

      {/* Nav */}
      <nav style={{ padding: "6px 10px", flex: 1, overflowY: "auto" }}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          const badgeValue = item.href === "/queue" ? queueCount : undefined;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`sv-nav-item ${active ? "sv-nav-active" : ""}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "9px 12px",
                borderRadius: 8,
                background: active ? hexToRgba(accentColor, 0.18) : "transparent",
                color: active ? accentColor : "rgba(255,255,255,0.45)",
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                textDecoration: "none",
                transition: "all 0.15s",
                marginBottom: 2,
              }}
            >
              {item.icon}
              {item.label}
              {badgeValue !== undefined && badgeValue > 0 && (
                <span style={{ marginLeft: "auto", padding: "1px 6px", borderRadius: 99, background: "rgba(59,130,246,0.25)", color: "#60a5fa", fontSize: 10, fontWeight: 700 }}>
                  {badgeValue}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Storage */}
      <div style={{ padding: "14px 14px 18px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ padding: "10px 12px", background: hexToRgba(accentColor, 0.08), borderRadius: 10, border: `1px solid ${hexToRgba(accentColor, 0.15)}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <HardDrive size={12} weight="bold" style={{ color: "rgba(255,255,255,0.35)" }} />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>ARMAZENAMENTO</span>
          </div>
          <ProgressBar value={Math.round((STORAGE_USED / STORAGE_CAP) * 100)} color={accentColor} height={4} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{formatBytes(STORAGE_USED)} usados</span>
            <span style={{ fontSize: 11, color: accentColor, fontWeight: 700 }}>
              {Math.round((STORAGE_USED / STORAGE_CAP) * 100)}%
            </span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div
        className="sv-sidebar-desktop"
        style={{ width: 220, background: "#10111E", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0, flexShrink: 0 }}
      >
        {content}
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 499 }} onClick={onClose} />
      )}

      {/* Mobile drawer */}
      <div
        className="sv-sidebar-mobile"
        style={{ width: 220, background: "#10111E", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", height: "100vh", position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 500, transform: mobileOpen ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)", boxShadow: mobileOpen ? "8px 0 32px rgba(0,0,0,0.5)" : "none" }}
      >
        {content}
      </div>
    </>
  );
}
