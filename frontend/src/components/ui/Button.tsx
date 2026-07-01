"use client";

import { type ReactNode } from "react";
import { hexToRgba } from "@/lib/utils";

type Variant = "primary" | "ghost" | "danger" | "success";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  accentColor?: string;
  type?: "button" | "submit" | "reset";
  icon?: ReactNode;
  fullWidth?: boolean;
}

const SIZE_STYLES: Record<Size, React.CSSProperties> = {
  sm: { padding: "5px 10px", fontSize: 12, gap: 5, borderRadius: 7 },
  md: { padding: "8px 14px", fontSize: 13, gap: 6, borderRadius: 8 },
  lg: { padding: "10px 18px", fontSize: 14, gap: 8, borderRadius: 10 },
};

export function Button({
  children,
  onClick,
  variant = "ghost",
  size = "md",
  disabled = false,
  accentColor = "#6C63FF",
  type = "button",
  icon,
  fullWidth = false,
}: ButtonProps) {
  const getVariant = (): React.CSSProperties => {
    switch (variant) {
      case "primary":
        return {
          background: hexToRgba(accentColor, 0.18),
          border: `1px solid ${hexToRgba(accentColor, 0.45)}`,
          color: accentColor,
        };
      case "danger":
        return {
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.25)",
          color: "#f87171",
        };
      case "success":
        return {
          background: "rgba(34,197,94,0.12)",
          border: "1px solid rgba(34,197,94,0.25)",
          color: "#4ade80",
        };
      default:
        return {
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.6)",
        };
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="sv-btn"
      style={{
        display: "inline-flex",
        alignItems: "center",
        whiteSpace: "nowrap",
        fontWeight: 600,
        fontFamily: "inherit",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "all 0.15s ease",
        width: fullWidth ? "100%" : undefined,
        justifyContent: fullWidth ? "center" : undefined,
        ...SIZE_STYLES[size],
        ...getVariant(),
      }}
    >
      {icon && <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>}
      {children}
    </button>
  );
}
