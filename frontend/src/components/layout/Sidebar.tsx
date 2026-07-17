"use client";

import Link from "next/link";
import { SquaresFour, MusicNotes, Books, DownloadSimple, Archive, ShareNetwork, Heart, User, Gear, X, HardDrive } from "@phosphor-icons/react";
import { ProgressBar } from "@/components/ui/index";
import { hexToRgba, formatBytes } from "@/lib/utils";
import { useDownloadJobs } from "@/hooks/downloads/useDownloadJobs";

const NAV_ITEMS = [
  { href: "/dashboard",  label: "Dashboard",      icon: <SquaresFour    size={16} weight="duotone" /> },
  { href: "/playlists",  label: "Playlists",      icon: <MusicNotes     size={16} weight="duotone" /> },
  { href: "/library",    label: "Biblioteca",     icon: <Books          size={16} weight="duotone" /> },
  { href: "/downloads",  label: "Downloads",      icon: <DownloadSimple size={16} weight="duotone" />, badge: true },
  { href: "/exports",    label: "Exportações",    icon: <Archive        size={16} weight="duotone" /> },
  { href: "/shared",     label: "Compartilhadas", icon: <ShareNetwork   size={16} weight="duotone" />, divider: true },
  { href: "/favorites",  label: "Favoritos",      icon: <Heart          size={16} weight="duotone" /> },
  { href: "/profile",    label: "Perfil",         icon: <User           size={16} weight="duotone" />, divider: true },
  { href: "/settings",   label: "Configurações",  icon: <Gear           size={16} weight="duotone" /> },
];

const STORAGE_USED = 892;
const STORAGE_CAP  = 5 * 1024;

export function Sidebar({ pathname, mobileOpen, onClose, accentColor }: { pathname: string; mobileOpen: boolean; onClose: () => void; accentColor: string }) {
  const { data: jobs } = useDownloadJobs();
  const activeDownloads = jobs?.filter((j) => j.status === "pending" || j.status === "processing").length ?? 0;
  const isActive = (href: string) => pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  const content = (
    <>
      <div style={{ padding: "18px 14px 14px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg, ${accentColor}, #43D9AD)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
          <MusicNotes size={16} weight="fill" />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>SoundDesk</div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em" }}>MUSIC LIBRARY</div>
        </div>
        <button onClick={onClose} className="sv-icon-btn" style={{ marginLeft: "auto", background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", display: "flex", padding: 4 }}>
          <X size={15} weight="bold" />
        </button>
      </div>

      <nav style={{ padding: "4px 8px", flex: 1, overflowY: "auto" }}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          const badgeVal = item.badge ? activeDownloads : undefined;
          return (
            <div key={item.href}>
              {item.divider && <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "5px 4px" }} />}
              <Link href={item.href} onClick={onClose} className={`sv-nav-item ${active ? "sv-nav-active" : ""}`}
                style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: 7, background: active ? hexToRgba(accentColor, 0.16) : "transparent", color: active ? accentColor : "rgba(255,255,255,0.45)", fontSize: 12.5, fontWeight: active ? 600 : 400, textDecoration: "none", transition: "all 0.15s", marginBottom: 1 }}
              >
                {item.icon}
                <span style={{ flex: 1 }}>{item.label}</span>
                {badgeVal !== undefined && badgeVal > 0 && (
                  <span style={{ padding: "1px 5px", borderRadius: 99, background: "rgba(59,130,246,0.25)", color: "#60a5fa", fontSize: 10, fontWeight: 700 }}>{badgeVal}</span>
                )}
              </Link>
            </div>
          );
        })}
      </nav>

      <div style={{ padding: "10px 12px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ padding: "9px 10px", background: hexToRgba(accentColor, 0.07), borderRadius: 9, border: `1px solid ${hexToRgba(accentColor, 0.14)}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
            <HardDrive size={11} weight="bold" style={{ color: "rgba(255,255,255,0.35)" }} />
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" }}>ARMAZENAMENTO</span>
          </div>
          <ProgressBar value={Math.round((STORAGE_USED / STORAGE_CAP) * 100)} color={accentColor} height={4} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{formatBytes(STORAGE_USED)}</span>
            <span style={{ fontSize: 10, color: accentColor, fontWeight: 700 }}>{Math.round((STORAGE_USED / STORAGE_CAP) * 100)}%</span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className="sv-sidebar-desktop" style={{ width: 210, background: "#10111E", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0, flexShrink: 0 }}>
        {content}
      </div>
      {mobileOpen && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 499 }} onClick={onClose} />}
      <div className="sv-sidebar-mobile" style={{ width: 210, background: "#10111E", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", height: "100vh", position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 500, transform: mobileOpen ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)" }}>
        {content}
      </div>
    </>
  );
}
