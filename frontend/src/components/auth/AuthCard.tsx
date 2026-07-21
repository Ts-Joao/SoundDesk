"use client";

import Link from "next/link";
import { MusicNotes } from "@phosphor-icons/react";
import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="sv-fade-in">
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32, justifyContent: "center" }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: "linear-gradient(135deg, #6C63FF, #43D9AD)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
          }}
        >
          <MusicNotes size={20} weight="fill" />
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.025em" }}>SoundDesk</div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em" }}>MUSIC LIBRARY</div>
        </div>
      </div>

      {/* Card */}
      <div
        style={{
          background: "#1A1B2E",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: "32px 28px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: "0 0 6px", letterSpacing: "-0.025em" }}>
            {title}
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", margin: 0 }}>{subtitle}</p>
        </div>
        {children}
      </div>

      {footer && <div style={{ marginTop: 20, textAlign: "center" }}>{footer}</div>}
    </div>
  );
}

// Reutilizável: input de auth
interface AuthInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  icon?: ReactNode;
}

export function AuthInput({
  label, type = "text", value, onChange, placeholder, error, autoComplete, icon,
}: AuthInputProps) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.55)", letterSpacing: "0.04em", display: "block", marginBottom: 7 }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {icon && (
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", display: "flex", pointerEvents: "none" }}>
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="sv-input"
          style={{
            width: "100%",
            padding: icon ? "10px 14px 10px 38px" : "10px 14px",
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}`,
            borderRadius: 9,
            color: "#fff",
            fontSize: 14,
            outline: "none",
            transition: "border-color 0.15s, box-shadow 0.15s",
            boxSizing: "border-box",
          }}
        />
      </div>
      {error && (
        <p style={{ fontSize: 11, color: "#f87171", margin: "5px 0 0" }}>{error}</p>
      )}
    </div>
  );
}

// Link estilizado para auth
export function AuthLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} style={{ color: "#6C63FF", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
      {children}
    </Link>
  );
}
