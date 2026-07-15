"use client";

import {
  Spinner,
  ListDashes,
  XCircle,
  CheckCircle,
  ArrowClockwise,
} from "@phosphor-icons/react";
import { StatCard, ProgressBar } from "@/components/ui/index";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatCardSkeleton, JobCardSkeleton, Skeleton } from "@/components/skeletons";
import { useQueue } from "@/hooks/useApi";
import type { TrackStatus } from "@/types";

const SECTIONS: {
  key: TrackStatus;
  label: string;
  color: string;
  icon: React.ReactNode;
}[] = [
    { key: "processing", label: "Em Processamento", color: "#3b82f6", icon: <Spinner size={18} weight="duotone" /> },
    { key: "pending", label: "Na Fila", color: "#94a3b8", icon: <ListDashes size={18} weight="duotone" /> },
    { key: "failed", label: "Com Erro", color: "#ef4444", icon: <XCircle size={18} weight="duotone" /> },
    { key: "completed", label: "Concluídos", color: "#22c55e", icon: <CheckCircle size={18} weight="duotone" /> },
  ];

export function QueueView() {
  const { data: jobs, isLoading } = useQueue();

  return (
    <div style={{ padding: 24 }} className="sv-fade-in">
      {/* Summary cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} small />)
          : SECTIONS.map((s) => (
            <StatCard
              key={s.key}
              label={s.label}
              value={(jobs ?? []).filter((j) => j.status === s.key).length}
              icon={s.icon}
              color={s.color}
              small
            />
          ))
        }
      </div>

      {/* Job sections */}
      {isLoading ? (
        <>
          <div style={{ marginBottom: 16 }}>
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
        </>
      ) : (
        SECTIONS.map((section) => {
          const sectionJobs = (jobs ?? []).filter((j) => j.status === section.key);
          if (!sectionJobs.length) return null;

          return (
            <div key={section.key} style={{ marginBottom: 20 }}>
              {/* Section header */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.5)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {section.label.toUpperCase()}
                </span>
                <span
                  style={{
                    padding: "1px 7px",
                    borderRadius: 99,
                    background: `${section.color}20`,
                    color: section.color,
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {sectionJobs.length}
                </span>
              </div>

              {/* Jobs */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {sectionJobs.map((job) => (
                  <div
                    key={job.id}
                    className="sv-card sv-job-card"
                    style={{
                      background: "#1A1B2E",
                      border: `1px solid ${section.color}18`,
                      borderRadius: 10,
                      padding: "14px 16px",
                      borderLeft: `3px solid ${section.color}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 160 }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "rgba(255,255,255,0.85)",
                            marginBottom: 2,
                          }}
                        >
                          {job.trackName}
                        </div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                          {job.playlistName}
                        </div>
                      </div>

                      <Badge status={job.status} />

                      {job.status === "failed" && (
                        <Button size="sm" icon={<ArrowClockwise size={13} weight="bold" />}>
                          Reprocessar
                        </Button>
                      )}
                    </div>

                    {job.status === "processing" && (
                      <div style={{ marginTop: 10 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 4,
                          }}
                        >
                          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
                            Progresso
                          </span>
                          <span
                            style={{
                              fontSize: 11,
                              color: section.color,
                              fontWeight: 700,
                            }}
                          >
                            {job.progress}%
                          </span>
                        </div>
                        <ProgressBar
                          value={job.progress}
                          color={section.color}
                          height={5}
                        />
                      </div>
                    )}

                    {job.error && (
                      <div
                        style={{
                          marginTop: 8,
                          padding: "6px 10px",
                          background: "rgba(239,68,68,0.08)",
                          borderRadius: 6,
                          fontSize: 12,
                          color: "#f87171",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <XCircle size={13} weight="fill" />
                        {job.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
