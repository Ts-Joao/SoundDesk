"use client";

import { Warning, ArrowClockwise } from "@phosphor-icons/react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", gap: 16, textAlign: "center" }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444" }}>
        <Warning size={28} weight="duotone" />
      </div>
      <div>
        <p style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.85)", margin: "0 0 6px" }}>Algo deu errado</p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0 }}>{error.message}</p>
      </div>
      <button
        onClick={reset}
        style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
      >
        <ArrowClockwise size={15} weight="bold" />
        Tentar novamente
      </button>
    </div>
  );
}
