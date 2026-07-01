// ============================================================
// Skeleton — Base
// ============================================================
export function Skeleton({ width = "100%", height = 16, style = {} }: {
  width?: string | number; height?: number; style?: React.CSSProperties;
}) {
  return (
    <div style={{ width, height, borderRadius: 6, background: "rgba(255,255,255,0.06)", animation: "sv-shimmer 1.5s ease-in-out infinite", ...style }} />
  );
}

// ============================================================
// StatCard Skeleton
// ============================================================
export function StatCardSkeleton({ small }: { small?: boolean }) {
  return (
    <div style={{ background: "#1A1B2E", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: small ? "12px 14px" : "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
      <Skeleton width={small ? 34 : 44} height={small ? 34 : 44} style={{ borderRadius: small ? 8 : 12, flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <Skeleton width="60%" height={10} />
        <Skeleton width="40%" height={small ? 18 : 24} />
      </div>
    </div>
  );
}

// ============================================================
// ListRow Skeleton (dashboard panels)
// ============================================================
export function ListRowSkeleton({ withProgress }: { withProgress?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <Skeleton width={40} height={40} style={{ borderRadius: 10, flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <Skeleton width="55%" height={12} />
        <Skeleton width="35%" height={10} />
      </div>
      {withProgress
        ? <Skeleton width={60} height={4} />
        : <Skeleton width={70} height={20} style={{ borderRadius: 99 }} />
      }
    </div>
  );
}

// ============================================================
// PlaylistCard Skeleton
// ============================================================
export function PlaylistCardSkeleton() {
  return (
    <div style={{ background: "#1A1B2E", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
      <Skeleton width="100%" height={3} style={{ borderRadius: 0 }} />
      <div style={{ padding: "16px 16px 14px" }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          <Skeleton width={52} height={52} style={{ borderRadius: 12, flexShrink: 0 }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, paddingTop: 4 }}>
            <Skeleton width="70%" height={14} />
            <Skeleton width="50%" height={11} />
            <Skeleton width="40%" height={11} />
          </div>
        </div>
        <div style={{ marginBottom: 14, display: "flex", flexDirection: "column", gap: 6 }}>
          <Skeleton width="100%" height={11} />
          <Skeleton width="100%" height={5} style={{ borderRadius: 99 }} />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <Skeleton width={90} height={28} style={{ borderRadius: 8 }} />
          <Skeleton width={70} height={28} style={{ borderRadius: 8 }} />
          <Skeleton width={36} height={28} style={{ borderRadius: 8 }} />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TableRow Skeleton (playlist detail)
// ============================================================
export function TableRowSkeleton({ columns, withDate, trailingCells = 0 }: {
  columns: string; withDate?: boolean; trailingCells?: number;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: columns, padding: "10px 18px", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
      <Skeleton width={20} height={12} />
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Skeleton width={34} height={34} style={{ borderRadius: 8, flexShrink: 0 }} />
        <Skeleton width="60%" height={12} />
      </div>
      <Skeleton width="70%" height={12} />
      <Skeleton width={70} height={20} style={{ borderRadius: 99 }} />
      <Skeleton width={36} height={12} />
      {withDate && <Skeleton width={50} height={11} />}
      {Array.from({ length: trailingCells }).map((_, i) => (
        <div key={i} style={{ display: "flex", gap: 4 }}>
          <Skeleton width={16} height={16} style={{ borderRadius: 4 }} />
          <Skeleton width={16} height={16} style={{ borderRadius: 4 }} />
        </div>
      ))}
    </div>
  );
}

// ============================================================
// LibraryRow Skeleton
// ============================================================
export function LibraryRowSkeleton() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 160px 90px 90px 90px", padding: "10px 18px", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Skeleton width={36} height={36} style={{ borderRadius: 8, flexShrink: 0 }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <Skeleton width="65%" height={12} />
          <Skeleton width="30%" height={10} />
        </div>
      </div>
      <Skeleton width="70%" height={12} />
      <Skeleton width="60%" height={11} />
      <Skeleton width={40} height={11} />
      <Skeleton width={48} height={10} />
      <div style={{ display: "flex", gap: 4 }}>
        <Skeleton width={16} height={16} style={{ borderRadius: 4 }} />
        <Skeleton width={16} height={16} style={{ borderRadius: 4 }} />
        <Skeleton width={16} height={16} style={{ borderRadius: 4 }} />
      </div>
    </div>
  );
}

// ============================================================
// JobCard Skeleton
// ============================================================
export function JobCardSkeleton({ withProgress }: { withProgress?: boolean }) {
  return (
    <div style={{ background: "#1A1B2E", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "14px 16px", borderLeft: "3px solid rgba(255,255,255,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <Skeleton width="50%" height={13} />
          <Skeleton width="35%" height={10} />
        </div>
        <Skeleton width={70} height={20} style={{ borderRadius: 99 }} />
      </div>
      {withProgress && <Skeleton width="100%" height={5} style={{ marginTop: 10, borderRadius: 99 }} />}
    </div>
  );
}
