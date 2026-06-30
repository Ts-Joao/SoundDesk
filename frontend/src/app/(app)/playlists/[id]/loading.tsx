import { TableRowSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/skeletons";

export default function PlaylistDetailLoading() {
  return (
    <div style={{ padding: 24 }}>
      {/* Hero skeleton */}
      <div
        style={{
          background: "#1A1B2E",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16,
          padding: 22,
          marginBottom: 20,
          borderTop: "3px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
          <Skeleton width={88} height={88} style={{ borderRadius: 12, flexShrink: 0 }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
            <Skeleton width="50%" height={22} />
            <Skeleton width="35%" height={13} />
            <Skeleton width="30%" height={13} />
            <Skeleton width="100%" height={6} style={{ borderRadius: 99, marginTop: 4 }} />
          </div>
        </div>
      </div>

      {/* Table skeleton */}
      <div
        style={{
          background: "#1A1B2E",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Skeleton width={80} height={14} />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <TableRowSkeleton
            key={i}
            columns="40px 1fr 140px 100px 80px 70px 80px"
            withDate
            trailingCells={1}
          />
        ))}
      </div>
    </div>
  );
}
