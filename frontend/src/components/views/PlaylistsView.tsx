"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, MusicNotes, DownloadSimple, PencilSimple, Trash, Spinner, UploadSimple } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { SearchInput, CoverArt, ProgressBar, EmptyState } from "@/components/ui/index";
import { CreatePlaylistModal, ConfirmDialog, EditPlaylistModal } from "@/components/modals/index";
import { ImportPlaylistModal } from "@/components/modals/ImportPlaylistModal";
import { PlaylistCardSkeleton } from "@/components/skeletons";
import { usePlaylists, useDeletePlaylist, useCreateExport } from "@/hooks/useApi";
import { exportsService } from "@/services/export.service";
import { getPlaylistProgress, formatRelative, hexToRgba } from "@/lib/utils";
import type { Playlist } from "@/types";

const ACCENT = "#6C63FF";

export function PlaylistsView() {
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Playlist | null>(null);
  const [editTarget, setEditTarget] = useState<Playlist | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);

  const { data: playlists, isLoading, refetch } = usePlaylists(search);
  const deleteMutation = useDeletePlaylist();
  const createExport = useCreateExport();

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const handleDownloadPlaylist = async (playlistId: string) => {
    setExportingId(playlistId);
    try {
      const job = await createExport.mutateAsync(playlistId) as any;
      const jobId = job.id;

      const checkStatus = async (): Promise<string> => {
        const data: any = await exportsService.getById(jobId);
        if (data.status === "COMPLETED" || data.status === "completed" || data.status === "READY") {
          return "completed";
        }
        if (data.status === "FAILED" || data.status === "failed") {
          return "failed";
        }
        await new Promise(resolve => setTimeout(resolve, 1500));
        return checkStatus();
      };

      const status = await checkStatus();
      if (status === "completed") {
        const blob = await exportsService.getZip(jobId);
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `playlist-${jobId}.zip`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      } else {
        alert("Erro ao exportar a playlist. Tente novamente.");
      }
    } catch (err) {
      console.error("Export failed:", err);
      alert("Falha ao iniciar a exportação da playlist.");
    } finally {
      setExportingId(null);
    }
  };

  return (
    <div style={{ padding: 24 }} className="sv-fade-in">
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar playlist..." />
        <div style={{ flex: 1 }} />
        <Button variant="ghost" icon={<UploadSimple size={14} weight="bold" />} onClick={() => setShowImport(true)}>
          Importar Playlist
        </Button>
        <Button variant="primary" accentColor={ACCENT} icon={<Plus size={14} weight="bold" />} onClick={() => setShowCreate(true)}>
          Nova Playlist
        </Button>
      </div>

      {isLoading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
          {Array.from({ length: 5 }).map((_, i) => <PlaylistCardSkeleton key={i} />)}
        </div>
      ) : !playlists?.length ? (
        <EmptyState
          icon={<MusicNotes size={28} weight="duotone" />}
          title="Nenhuma playlist encontrada"
          description="Crie sua primeira playlist para organizar suas músicas favoritas."
          action="Criar Playlist"
          onAction={() => setShowCreate(true)}
          accentColor={ACCENT}
        />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
          {playlists.map((pl) => {
            const progress = getPlaylistProgress(pl);
            return (
              <div key={pl.id} className="sv-card" style={{ background: "#1A1B2E", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
                <div style={{ height: 4, background: `linear-gradient(90deg, ${pl.color}, ${pl.color}55)` }} />
                <div style={{ padding: "16px 16px 14px" }}>
                  <Link href={`/playlists/${pl.id}`} style={{ display: "flex", gap: 12, marginBottom: 12, textDecoration: "none" }}>
                    <CoverArt color={pl.color} name={pl.name} size={52} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{pl.name}</div>
                      {pl.description && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{pl.description}</div>}
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 5 }}>{pl.trackCount} músicas · {formatRelative(pl.createdAt)}</div>
                    </div>
                  </Link>

                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{pl.completedTracks}/{pl.trackCount} concluídas</span>
                      <span style={{ fontSize: 11, color: pl.color, fontWeight: 700 }}>{progress}%</span>
                    </div>
                    <ProgressBar value={progress} color={pl.color} height={5} />
                  </div>

                  {(pl.failedTracks > 0 || pl.pendingTracks > 0) && (
                    <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                      {pl.pendingTracks > 0 && <span style={{ fontSize: 11, color: "#94a3b8", background: "rgba(148,163,184,0.12)", padding: "2px 7px", borderRadius: 5 }}>{pl.pendingTracks} pendente{pl.pendingTracks > 1 ? "s" : ""}</span>}
                      {pl.failedTracks > 0 && <span style={{ fontSize: 11, color: "#f87171", background: "rgba(239,68,68,0.12)", padding: "2px 7px", borderRadius: 5 }}>{pl.failedTracks} com erro</span>}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 6 }}>
                    <Button size="sm" variant="primary" accentColor={pl.color} icon={exportingId === pl.id ? <Spinner size={13} className="sv-spin" /> : <DownloadSimple size={13} weight="bold" />} onClick={() => handleDownloadPlaylist(pl.id)} disabled={exportingId !== null}>{exportingId === pl.id ? "Exportando..." : "Download"}</Button>
                    <Button size="sm" icon={<PencilSimple size={13} weight="bold" />} onClick={() => setEditTarget(pl)}>Editar</Button>
                    <Button size="sm" variant="danger" icon={<Trash size={13} weight="bold" />} onClick={() => setDeleteTarget(pl)}>Excluir</Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCreate && <CreatePlaylistModal onClose={() => setShowCreate(false)} onSuccess={() => refetch()} accentColor={ACCENT} />}
      {showImport && <ImportPlaylistModal onClose={() => setShowImport(false)} onSuccess={() => refetch()} accentColor={ACCENT} />}
      {editTarget && (
        <EditPlaylistModal
          playlist={editTarget}
          onClose={() => setEditTarget(null)}
          onSuccess={() => refetch()}
          accentColor={editTarget.color}
        />
      )}
      {deleteTarget && (
        <ConfirmDialog
          title="Excluir Playlist"
          message={`Excluir "${deleteTarget.name}"? Todas as músicas associadas serão removidas permanentemente.`}
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
