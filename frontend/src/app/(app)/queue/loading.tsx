import { StatCardSkeleton, JobCardSkeleton, Skeleton } from "@/components/skeletons";

export default function QueueLoading() {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} small />)}
      </div>
      <div style={{ marginBottom: 20 }}>
        <Skeleton width={160} height={12} style={{ marginBottom: 10 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <JobCardSkeleton withProgress />
          <JobCardSkeleton withProgress />
        </div>
      </div>
      <div>
        <Skeleton width={100} height={12} style={{ marginBottom: 10 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <JobCardSkeleton />
          <JobCardSkeleton />
          <JobCardSkeleton />
        </div>
      </div>
    </div>
  );
}
