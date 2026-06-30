"use client";

import Link from "next/link";
import { List, Plus } from "@phosphor-icons/react";
import { hexToRgba } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
  accentColor: string;
  pathname: string;
}

export function PageHeader({ title, subtitle, onMenuClick, accentColor, pathname }: PageHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "18px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(13,14,28,0.85)",
        backdropFilter: "blur(8px)",
        position: "sticky",
        top: 0,
        zIndex: 10,
        flexShrink: 0,
      }}
    >
      <button
        className="sv-mobile-menu-btn sv-icon-btn"
        onClick={onMenuClick}
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 8,
          color: "rgba(255,255,255,0.5)",
          cursor: "pointer",
          padding: "6px 9px",
          display: "none",
        }}
      >
        <List size={18} weight="bold" />
      </button>

      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.025em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ margin: "2px 0 0", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
            {subtitle}
          </p>
        )}
      </div>

      {pathname === "/dashboard" && (
        <Link
          href="/playlists"
          className="sv-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 14px",
            fontSize: 13,
            borderRadius: 8,
            fontWeight: 600,
            textDecoration: "none",
            whiteSpace: "nowrap",
            background: hexToRgba(accentColor, 0.18),
            border: `1px solid ${hexToRgba(accentColor, 0.45)}`,
            color: accentColor,
            transition: "all 0.15s ease",
          }}
        >
          <Plus size={14} weight="bold" />
          Nova Playlist
        </Link>
      )}
    </div>
  );
}
