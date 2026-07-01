import { StatCardSkeleton, ListRowSkeleton } from "@/components/skeletons";

export default function DashboardLoading() {
  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 14,
          marginBottom: 28,
        }}
      >
        {Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {[0, 1].map((col) => (
          <div
            key={col}
            style={{
              background: "#1A1B2E",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "16px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ width: 140, height: 14, background: "rgba(255,255,255,0.06)", borderRadius: 6, animation: "sv-shimmer 1.5s ease-in-out infinite" }} />
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
              <ListRowSkeleton key={i} withProgress={col === 0} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
