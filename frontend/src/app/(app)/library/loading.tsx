import { LibraryRowSkeleton } from "@/components/skeletons";

export default function LibraryLoading() {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 240, height: 38, background: "rgba(255,255,255,0.06)", borderRadius: 8, animation: "sv-shimmer 1.5s ease-in-out infinite" }} />
        <div style={{ width: 160, height: 38, background: "rgba(255,255,255,0.06)", borderRadius: 8, animation: "sv-shimmer 1.5s ease-in-out infinite" }} />
      </div>
      <div style={{ background: "#1A1B2E", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 160px 90px 90px 90px", padding: "8px 18px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          {["MÚSICA","ARTISTA","PLAYLIST","TAMANHO","DATA",""].map((h, i) => (
            <div key={i} style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.22)", letterSpacing: "0.06em" }}>{h}</div>
          ))}
        </div>
        {Array.from({ length: 7 }).map((_, i) => <LibraryRowSkeleton key={i} />)}
      </div>
    </div>
  );
}
