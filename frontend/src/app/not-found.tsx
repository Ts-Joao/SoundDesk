import Link from "next/link";
import {
  MusicNotes,
  HouseLine,
  ArrowLeft,
} from "@phosphor-icons/react/dist/ssr";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0D0E1C",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 24,
        padding: 24,
        fontFamily: "Inter, -apple-system, sans-serif",
        color: "#fff",
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "rgba(108,99,255,0.12)",
          border: "1px solid rgba(108,99,255,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#6C63FF",
        }}
      >
        <MusicNotes size={40} weight="duotone" />
      </div>

      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: 72,
            fontWeight: 900,
            letterSpacing: "-0.04em",
            color: "rgba(255,255,255,0.08)",
            lineHeight: 1,
            margin: "0 0 8px",
          }}
        >
          404
        </h1>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "rgba(255,255,255,0.85)",
            margin: "0 0 8px",
          }}
        >
          Página não encontrada
        </h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", margin: 0 }}>
          A página que você está procurando não existe ou foi removida.
        </p>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 18px",
            background: "rgba(108,99,255,0.18)",
            border: "1px solid rgba(108,99,255,0.4)",
            borderRadius: 9,
            color: "#a299ff",
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
            transition: "all 0.15s",
          }}
        >
          <HouseLine size={16} weight="bold" />
          Ir para o início
        </Link>
        <Link
          href="/playlists"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 18px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 9,
            color: "rgba(255,255,255,0.6)",
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={16} weight="bold" />
          Ver playlists
        </Link>
      </div>
    </div>
  );
}
