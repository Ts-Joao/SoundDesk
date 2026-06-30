"use client";

import Link from "next/link";
import {
  MusicNotes,
  Headphones,
  CheckCircle,
  Spinner,
  XCircle,
  ArrowRight,
} from "@phosphor-icons/react";
import { StatCard, CoverArt, ProgressBar } from "@/components/ui/index";
import { Badge } from "@/components/ui/Badge";
import { StatCardSkeleton, ListRowSkeleton } from "@/components/skeletons";
import { useStats, usePlaylists, useQueue } from "@/hooks/useApi";
import { getPlaylistProgress, formatRelative } from "@/lib/utils";

export function DashboardView() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: playlists, isLoading: plLoading } = usePlaylists();
  const { data: queue, isLoading: qLoading } = useQueue();

  return (
    <div style={{ padding: 24 }} className="sv-fade-in">
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 28 }}>
        {statsLoading ? (
          Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : stats ? (
          <>
            <StatCard label="Playlists"   value={stats.totalPlaylists}       icon={<MusicNotes  size={20} weight="duotone" />} color="#6C63FF" trend="↑ +1 esta semana" />
            <StatCard label="Músicas"     value={stats.totalTracks}          icon={<Headphones  size={20} weight="duotone" />} color="#43D9AD" />
            <StatCard label="Concluídos"  value={stats.completedDownloads}   icon={<CheckCircle size={20} weight="duotone" />} color="#22c55e" />
            <StatCard label="Processando" value={stats.processingDownloads}  icon={<Spinner     size={20} weight="duotone" />} color="#3b82f6" />
            <StatCard label="Com Erro"    value={stats.failedDownloads}      icon={<XCircle     size={20} weight="duotone" />} color="#ef4444" />
          </>
        ) : null}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Recent playlists */}
        <div style={{ background: "#1A1B2E", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>Últimas Playlists</span>
            <Link href="/playlists" style={{ display: "flex", alignItems: "center", gap: 4, color: "#6C63FF", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
              Ver todas <ArrowRight size={13} weight="bold" />
            </Link>
          </div>
          {plLoading
            ? Array.from({ length: 4 }).map((_, i) => <ListRowSkeleton key={i} withProgress />)
            : playlists?.slice(0, 4).map((pl) => (
                <Link key={pl.id} href={`/playlists/${pl.id}`} className="sv-row" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer", transition: "background 0.15s", textDecoration: "none" }}>
                  <CoverArt color={pl.color} name={pl.name} size={40} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{pl.name}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{pl.trackCount} músicas · {formatRelative(pl.updatedAt)}</div>
                  </div>
                  <div style={{ width: 60 }}>
                    <ProgressBar value={getPlaylistProgress(pl)} color={pl.color} height={4} />
                    <div style={{ fontSize: 9, color: pl.color, textAlign: "right", marginTop: 2, fontWeight: 700 }}>{getPlaylistProgress(pl)}%</div>
                  </div>
                </Link>
              ))
          }
        </div>

        {/* Queue */}
        <div style={{ background: "#1A1B2E", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>Fila de Downloads</span>
            <Link href="/queue" style={{ display: "flex", alignItems: "center", gap: 4, color: "#6C63FF", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
              Ver fila <ArrowRight size={13} weight="bold" />
            </Link>
          </div>
          {qLoading
            ? Array.from({ length: 5 }).map((_, i) => <ListRowSkeleton key={i} />)
            : queue?.slice(0, 5).map((job) => (
                <div key={job.id} className="sv-row" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 18px", borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{job.trackName}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>{job.playlistName}</div>
                    {job.status === "processing" && (
                      <ProgressBar value={job.progress} color="#3b82f6" height={3} />
                    )}
                  </div>
                  <Badge status={job.status} />
                </div>
              ))
          }
        </div>
      </div>
    </div>
  );
}
