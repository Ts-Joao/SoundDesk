import { StatCardSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 72,
            background: "rgba(255,255,255,0.04)",
            borderRadius: 10,
            marginBottom: 8,
            animation: "sv-shimmer 1.5s ease-in-out infinite",
          }}
        />
      ))}
    </div>
  );
}
