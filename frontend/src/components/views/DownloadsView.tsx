"use client";

import {
  DownloadSimple, ArrowClockwise, X,
  CheckCircle, XCircle, Clock, Spinner,
} from "@phosphor-icons/react";
import { useDownloadJobs } from "@/hooks/downloads/useDownloadJobs";
import { useRetryDownload } from "@/hooks/downloads/useRetryDownload";
import { useCancelDownload } from "@/hooks/downloads/useCancelDownload";
import { StatCard, ProgressBar, EmptyState } from "@/components/ui/index";
import { Badge } from "@/components/ui/Badge";
import { StatCardSkeleton, JobCardSkeleton, Skeleton } from "@/components/skeletons";
import { useToast } from "@/contexts/ToastContext";
import type { TrackStatus } from "@/types";

const SECTIONS: { key: TrackStatus; label: string; color: string; icon: React.ReactNode }[] = [
  { key: "processing", label: "Em Processamento", color: "#3b82f6", icon: <Spinner     size={18} weight="duotone" /> },
  { key: "pending",    label: "Na Fila",           color: "#94a3b8", icon: <Clock       size={18} weight="duotone" /> },
  { key: "failed",     label: "Com Erro",          color: "#ef4444", icon: <XCircle     size={18} weight="duotone" /> },
  { key: "completed",  label: "Concluídos",        color: "#22c55e", icon: <CheckCircle size={18} weight="duotone" /> },
];

export function DownloadsView() {
  const toast = useToast();
  const { data: jobs, isLoading } = useDownloadJobs();
  const retry  = useRetryDownload();
  const cancel = useCancelDownload();

  const handleRetry = async (id: string) => {
    try {
      await retry.mutateAsync(id);
      toast.success("Download reiniciado");
    } catch (e: any) {
      toast.error("Falha ao reiniciar", e.message);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await cancel.mutateAsync(id);
      toast.info("Download cancelado");
    } catch (e: any) {
      toast.error("Falha ao cancelar", e.message);
    }
  };

  return (
    <div style={{ padding: 24 }} className="sv-fade-in">
      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
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

      {isLoading ? (
        <>
          <Skeleton width={160} height={12} style={{ marginBottom: 10 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
            <JobCardSkeleton withProgress /><JobCardSkeleton withProgress />
          </div>
          <Skeleton width={100} height={12} style={{ marginBottom: 10 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <JobCardSkeleton /><JobCardSkeleton /><JobCardSkeleton />
          </div>
        </>
      ) : !jobs?.length ? (
        <EmptyState
          icon={<DownloadSimple size={28} weight="duotone" />}
          title="Nenhum download"
          description="Adicione músicas a uma playlist para iniciar os downloads."
        />
      ) : (
        SECTIONS.map((section) => {
          const items = (jobs ?? []).filter((j) => j.status === section.key);
          if (!items.length) return null;
          return (
            <div key={section.key} style={{ marginBottom: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em" }}>
                  {section.label.toUpperCase()}
                </span>
                <span style={{ padding: "1px 7px", borderRadius: 99, background: `${section.color}20`, color: section.color, fontSize: 11, fontWeight: 700 }}>
                  {items.length}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {items.map((job) => (
                  <div
                    key={job.id}
                    className="sv-card"
                    style={{
                      background: "#1A1B2E",
                      border: `1px solid ${section.color}18`,
                      borderRadius: 10,
                      padding: "14px 16px",
                      borderLeft: `3px solid ${section.color}`,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: 160 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.85)", marginBottom: 2 }}>
                          {job.trackName}
                        </div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
                          {job.playlistName}
                        </div>
                      </div>
                      <Badge status={job.status} />
                      <div style={{ display: "flex", gap: 6 }}>
                        {job.status === "failed" && (
                          <button
                            onClick={() => handleRetry(job.id)}
                            disabled={retry.isPending}
                            className="sv-btn"
                            style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 7, color: "#60a5fa", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                          >
                            <ArrowClockwise size={13} weight="bold" />
                            Tentar novamente
                          </button>
                        )}
                        {(job.status === "pending" || job.status === "processing") && (
                          <button
                            onClick={() => handleCancel(job.id)}
                            disabled={cancel.isPending}
                            className="sv-btn"
                            style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 7, color: "#f87171", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                          >
                            <X size={13} weight="bold" />
                            Cancelar
                          </button>
                        )}
                      </div>
                    </div>
                    {job.status === "processing" && (
                      <div style={{ marginTop: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Progresso</span>
                          <span style={{ fontSize: 11, color: section.color, fontWeight: 700 }}>{job.progress ?? 0}%</span>
                        </div>
                        <ProgressBar value={job.progress ?? 0} color={section.color} height={5} />
                      </div>
                    )}
                    {job.error && (
                      <div style={{ marginTop: 8, padding: "6px 10px", background: "rgba(239,68,68,0.08)", borderRadius: 6, fontSize: 12, color: "#f87171", display: "flex", alignItems: "center", gap: 6 }}>
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
