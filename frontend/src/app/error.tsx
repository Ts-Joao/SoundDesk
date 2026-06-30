"use client";

import { useEffect } from "react";
import { Warning, ArrowClockwise } from "@phosphor-icons/react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[SoundVault Error]", error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body
        style={{
          minHeight: "100vh",
          background: "#0D0E1C",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 20,
          padding: 24,
          fontFamily: "Inter, -apple-system, sans-serif",
          color: "#fff",
          margin: 0,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "rgba(239,68,68,0.12)",
            border: "1px solid rgba(239,68,68,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ef4444",
          }}
        >
          <Warning size={32} weight="duotone" />
        </div>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>
            Algo deu errado
          </h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0, maxWidth: 320 }}>
            {error.message || "Ocorreu um erro inesperado. Tente novamente."}
          </p>
        </div>
        <button
          onClick={reset}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 18px",
            background: "rgba(239,68,68,0.12)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 9,
            color: "#f87171",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <ArrowClockwise size={16} weight="bold" />
          Tentar novamente
        </button>
      </body>
    </html>
  );
}
