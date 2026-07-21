"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, Plus, DownloadSimple, ArrowClockwise,
  Trash, MusicNote, PencilSimple, Spinner,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { SearchInput, CoverArt, ProgressBar, EmptyState } from "@/components/ui/index";
import { Badge } from "@/components/ui/Badge";
import { AddTrackModal, EditPlaylistModal } from "@/components/modals/index";
import { TableRowSkeleton } from "@/components/skeletons";
import { usePlaylist, useDeleteTrack, useCreateExport } from "@/hooks/useApi";
import { getPlaylistProgress, formatDuration, formatDate, formatRelative } from "@/lib/utils";
import type { Track } from "@/types";

interface PlaylistDetailViewProps {
  playlistId: string;
}

const ACCENT = "#6C63FF";

export function PlaylistDetailView({ playlistId }: PlaylistDetailViewProps) {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const { data, isLoading, isError, refetch } = usePlaylist(playlistId);
  const deleteTrack = useDeleteTrack();
  const createExport = useCreateExport();

  if (isError) notFound();

  const filtered = data?.tracks.filter(
    (t: Track) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.artist.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const progress = data ? getPlaylistProgress(data) : 0;

  const handleDownloadPlaylist = async () => {
    if (!data) return;
    setIsExporting(true);
    try {
      const job = await createExport.mutateAsync(data.id) as any;
      const jobId = job.id;

      const checkStatus = async (): Promise<string> => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/exports/${jobId}`);
        const dataStatus = await res.json();
        if (dataStatus.status === "COMPLETED" || dataStatus.status === "completed" || dataStatus.status === "READY") {
          return "completed";
        }
        if (dataStatus.status === "FAILED" || dataStatus.status === "failed") {
          return "failed";
        }
        await new Promise(resolve => setTimeout(resolve, 1500));
        return checkStatus();
      };

      const status = await checkStatus();
      if (status === "completed") {
        window.open(`${process.env.NEXT_PUBLIC_API_URL}/api/exports/${jobId}/download`, "_blank");
      } else {
        alert("Erro ao exportar a playlist. Tente novamente.");
      }
    } catch (err) {
      console.error("Export failed:", err);
      alert("Falha ao iniciar a exportação da playlist.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadTrack = (trackId: string) => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/api/tracks/${trackId}/download`, "_blank");
  };

  return (
    <div style={{ padding: 24 }} className="sv-fade-in">
      <Link href="/playlists" className="sv-back-btn" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 500, marginBottom: 18, textDecoration: "none", transition: "color 0.15s" }}>
        <ArrowLeft size={16} weight="bold" /> Voltar às playlists
      </Link>

      {/* Hero */}
      {isLoading ? (
        <div style={{ background: "#1A1B2E", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 22, marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 18 }}>
            <div style={{ width: 88, height: 88, borderRadius: 12, background: "rgba(255,255,255,0.06)", animation: "sv-shimmer 1.5s infinite" }} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ width: "50%", height: 22, background: "rgba(255,255,255,0.06)", borderRadius: 6, animation: "sv-shimmer 1.5s infinite" }} />
              <div style={{ width: "35%", height: 13, background: "rgba(255,255,255,0.06)", borderRadius: 6, animation: "sv-shimmer 1.5s infinite" }} />
              <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 99, animation: "sv-shimmer 1.5s infinite", marginTop: 4 }} />
            </div>
          </div>
        </div>
      ) : data && (
        <div style={{ background: "#1A1B2E", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 22, marginBottom: 20, borderTop: `3px solid ${data.color}` }}>
          <div style={{ display: "flex", gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>
            <CoverArt color={data.color} name={data.name} size={88} />
            <div style={{ flex: 1, minWidth: 200 }}>
              <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>{data.name}</h2>
              {data.description && <p style={{ margin: "0 0 10px", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{data.description}</p>}
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>{data.trackCount} músicas · Criada {formatDate(data.createdAt)}</div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{data.completedTracks} de {data.trackCount} concluídas</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: data.color }}>{progress}%</span>
                </div>
                <ProgressBar value={progress} color={data.color} height={6} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <Button variant="primary" accentColor={data.color} icon={isExporting ? <Spinner size={15} className="sv-spin" /> : <DownloadSimple size={15} weight="bold" />} onClick={handleDownloadPlaylist} disabled={isExporting}>{isExporting ? "Exportando..." : "Baixar tudo"}</Button>
              <Button icon={<PencilSimple size={15} weight="bold" />} onClick={() => setShowEdit(true)}>Editar</Button>
              {data.failedTracks > 0 && <Button icon={<ArrowClockwise size={15} weight="bold" />}>Reprocessar</Button>}
            </div>
          </div>
        </div>
      )}

      {/* Tracks table */}
      <div style={{ background: "#1A1B2E", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.8)", flexShrink: 0 }}>Músicas</span>
          <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nome ou artista..." />
          <div style={{ flex: 1 }} />
          <Button size="sm" variant="primary" accentColor={ACCENT} icon={<Plus size={13} weight="bold" />} onClick={() => setShowAdd(true)}>Adicionar</Button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 140px 100px 80px 70px 80px", padding: "8px 18px", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.25)", letterSpacing: "0.06em", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <div>#</div><div>NOME</div><div>ARTISTA</div><div>STATUS</div><div>DURAÇÃO</div><div>DATA</div><div />
        </div>

        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <TableRowSkeleton key={i} columns="40px 1fr 140px 100px 80px 70px 80px" withDate trailingCells={1} />
            ))
          : filtered.length === 0
            ? <EmptyState icon={<MusicNote size={28} weight="duotone" />} title="Nenhuma música" description="Adicione URLs de músicas para começar." action="Adicionar Música" onAction={() => setShowAdd(true)} accentColor={ACCENT} />
            : filtered.map((track: Track, i: number) => (
                <div key={track.id} className="sv-row" style={{ display: "grid", gridTemplateColumns: "40px 1fr 140px 100px 80px 70px 80px", padding: "10px 18px", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.03)", fontSize: 13, transition: "background 0.15s" }}>
                  <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>{i + 1}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    {track.cover_path !== undefined ? (
                      <img src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${encodeURIComponent(track.cover_path)}`} alt={track.name} style={{ width: 34, height: 34, borderRadius: 8, objectFit: "cover" }} />
                    ) : (
                      <CoverArt color={track.coverColor} name={track.name} size={34} />
                    )}
                    <div style={{ fontWeight: 600, color: "rgba(255,255,255,0.85)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{track.name}</div>
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{track.artist}</div>
                  <div><Badge status={track.status} /></div>
                  <div style={{ color: "rgba(255,255,255,0.35)", fontFamily: "monospace", fontSize: 12 }}>{formatDuration(track.duration)}</div>
                  <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 11 }}>{formatRelative(track.addedAt)}</div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {track.status === "completed" && (
                      <button className="sv-icon-btn" onClick={() => handleDownloadTrack(track.id)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", padding: 4, display: "flex" }}>
                        <DownloadSimple size={14} weight="bold" />
                      </button>
                    )}
                    {track.status === "failed" && (
                      <button className="sv-icon-btn" style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", padding: 4, display: "flex" }}>
                        <ArrowClockwise size={14} weight="bold" />
                      </button>
                    )}
                    <button className="sv-icon-btn" onClick={() => deleteTrack.mutate(track.id)} style={{ background: "none", border: "none", color: "rgba(239,68,68,0.5)", cursor: "pointer", padding: 4, display: "flex" }}>
                      <Trash size={14} weight="bold" />
                    </button>
                  </div>
                </div>
              ))
        }
      </div>

      {showAdd && data && (
        <AddTrackModal playlistName={data.name} playlistId={data.id} onClose={() => setShowAdd(false)} onSuccess={() => refetch()} accentColor={ACCENT} />
      )}

      {showEdit && data && (
        <EditPlaylistModal playlist={data as any} onClose={() => setShowEdit(false)} onSuccess={() => refetch()} accentColor={data.color} />
      )}
    </div>
  );
}
