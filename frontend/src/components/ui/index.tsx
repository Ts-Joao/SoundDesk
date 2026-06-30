"use client";

import { MagnifyingGlass } from "@phosphor-icons/react";
import { getInitials, hexToRgba } from "@/lib/utils";
import type { ReactNode } from "react";

// ============================================================
// CoverArt
// ============================================================
export function CoverArt({ color, name, size = 44 }: { color: string; name: string; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size > 60 ? 12 : 8,
        background: `${color}22`,
        border: `1px solid ${color}33`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color,
        fontSize: size > 60 ? 26 : 13,
        fontWeight: 700,
        flexShrink: 0,
        userSelect: "none",
      }}
    >
      {getInitials(name)}
    </div>
  );
}

// ============================================================
// ProgressBar
// ============================================================
export function ProgressBar({
  value,
  color = "#6C63FF",
  height = 6,
}: {
  value: number;
  color?: string;
  height?: number;
}) {
  return (
    <div style={{ width: "100%", height, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
      <div
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          height: "100%",
          background: color,
          borderRadius: 99,
          transition: "width 0.4s ease",
        }}
      />
    </div>
  );
}

// ============================================================
// SearchInput
// ============================================================
export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div style={{ position: "relative", minWidth: 200 }}>
      <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", display: "flex" }}>
        <MagnifyingGlass size={15} weight="bold" />
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="sv-input"
        style={{
          padding: "8px 12px 8px 32px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 8,
          color: "#fff",
          fontSize: 13,
          width: "100%",
          outline: "none",
          transition: "border-color 0.15s, box-shadow 0.15s",
        }}
      />
    </div>
  );
}

// ============================================================
// Toggle
// ============================================================
export function Toggle({
  value,
  onChange,
  accentColor = "#6C63FF",
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  accentColor?: string;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 99,
        background: value ? accentColor : "rgba(255,255,255,0.12)",
        border: "none",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#fff",
          position: "absolute",
          top: 3,
          left: value ? 23 : 3,
          transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        }}
      />
    </button>
  );
}

// ============================================================
// SegmentedControl
// ============================================================
interface SegOption { value: string; label: string; icon?: ReactNode }

export function SegmentedControl({
  options,
  value,
  onChange,
  accentColor = "#6C63FF",
}: {
  options: SegOption[];
  value: string;
  onChange: (v: string) => void;
  accentColor?: string;
}) {
  return (
    <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 9, padding: 3, gap: 2 }}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: 7,
              border: "none",
              background: active ? hexToRgba(accentColor, 0.22) : "transparent",
              color: active ? accentColor : "rgba(255,255,255,0.4)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s",
              fontFamily: "inherit",
            }}
          >
            {opt.icon}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ============================================================
// StatCard
// ============================================================
export function StatCard({
  label,
  value,
  icon,
  color,
  small,
  trend,
}: {
  label: string;
  value: number | string;
  icon: ReactNode;
  color: string;
  small?: boolean;
  trend?: string;
}) {
  return (
    <div style={{ background: "#1A1B2E", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: small ? "12px 14px" : "16px 18px", display: "flex", alignItems: small ? "center" : "flex-start", gap: 14 }}>
      <div style={{ width: small ? 34 : 44, height: small ? 34 : 44, borderRadius: small ? 8 : 12, background: `${color}18`, border: `1px solid ${color}28`, display: "flex", alignItems: "center", justifyContent: "center", color, flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</div>
        <div style={{ fontSize: small ? 22 : 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1, marginTop: 3 }}>{value}</div>
        {trend && <div style={{ fontSize: 11, color: "rgba(34,197,94,0.9)", marginTop: 3 }}>{trend}</div>}
      </div>
    </div>
  );
}

// ============================================================
// EmptyState
// ============================================================
export function EmptyState({
  icon,
  title,
  description,
  action,
  onAction,
  accentColor = "#6C63FF",
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: string;
  onAction?: () => void;
  accentColor?: string;
}) {
  return (
    <div className="sv-fade-in" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px", textAlign: "center", gap: 12 }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.25)", marginBottom: 4 }}>
        {icon}
      </div>
      <p style={{ fontSize: 16, fontWeight: 600, color: "rgba(255,255,255,0.85)", margin: 0 }}>{title}</p>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0, maxWidth: 280 }}>{description}</p>
      {action && onAction && (
        <button
          onClick={onAction}
          className="sv-btn"
          style={{
            marginTop: 8,
            padding: "8px 18px",
            background: hexToRgba(accentColor, 0.18),
            border: `1px solid ${hexToRgba(accentColor, 0.35)}`,
            borderRadius: 8,
            color: accentColor,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {action}
        </button>
      )}
    </div>
  );
}
