import { PlaylistCardSkeleton } from "@/components/skeletons";

export default function PlaylistsLoading() {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <div style={{ width: 240, height: 38, background: "rgba(255,255,255,0.06)", borderRadius: 8, animation: "sv-shimmer 1.5s ease-in-out infinite" }} />
        <div style={{ width: 130, height: 38, background: "rgba(255,255,255,0.06)", borderRadius: 8, animation: "sv-shimmer 1.5s ease-in-out infinite", marginLeft: "auto" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {Array.from({ length: 5 }).map((_, i) => <PlaylistCardSkeleton key={i} />)}
      </div>
    </div>
  );
}
