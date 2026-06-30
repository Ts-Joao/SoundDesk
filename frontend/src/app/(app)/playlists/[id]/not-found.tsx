import Link from "next/link";
import { MusicNotes, ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export default function PlaylistNotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px",
        gap: 16,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "rgba(108,99,255,0.10)",
          border: "1px solid rgba(108,99,255,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#6C63FF",
        }}
      >
        <MusicNotes size={32} weight="duotone" />
      </div>

      <div>
        <p style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.85)", margin: "0 0 6px" }}>
          Playlist não encontrada
        </p>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0 }}>
          Esta playlist não existe ou foi removida.
        </p>
      </div>

      <Link
        href="/playlists"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 7,
          padding: "8px 16px",
          background: "rgba(108,99,255,0.14)",
          border: "1px solid rgba(108,99,255,0.3)",
          borderRadius: 8,
          color: "#a299ff",
          fontSize: 13,
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        <ArrowLeft size={15} weight="bold" />
        Voltar às playlists
      </Link>
    </div>
  );
}
