"use client";

import { X } from "@phosphor-icons/react";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  maxWidth?: number;
}

export function Modal({ title, children, onClose, maxWidth = 480 }: ModalProps) {
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="sv-fade-in"
        style={{ background: "#1A1B2E", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, width: "100%", maxWidth, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{title}</span>
          <button onClick={onClose} className="sv-icon-btn" style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: 4, display: "flex" }}>
            <X size={18} weight="bold" />
          </button>
        </div>
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    </div>
  );
}
