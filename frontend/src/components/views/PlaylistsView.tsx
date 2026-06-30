"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, MusicNotes, DownloadSimple, PencilSimple, Trash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { SearchInput, CoverArt, ProgressBar, EmptyState } from "@/components/ui/index";
import { CreatePlaylistModal, ConfirmDialog } from "@/components/modals/index";
import { PlaylistCardSkeleton } from "@/components/skeletons";
import { usePlaylists, useDeletePlaylist } from "@/hooks/useApi";
import { getPlaylistProgress, formatRelative, hexToRgba } from "@/lib/utils";
import type { Playlist } from "@/types";

const ACCENT = "#6C63FF";

export function PlaylistsView() {
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Playlist | null>(null);

  const { data: playlists, isLoading, refetch } = usePlaylists(search);
  const deleteMutation = useDeletePlaylist();

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div style={{ padding: 24 }} className="sv-fade-in">
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar playlist..." />
        <div style={{ flex: 1 }} />
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
                    <Button size="sm" variant="primary" accentColor={pl.color} icon={<DownloadSimple size={13} weight="bold" />}>Download</Button>
                    <Button size="sm" icon={<PencilSimple size={13} weight="bold" />}>Editar</Button>
                    <Button size="sm" variant="danger" icon={<Trash size={13} weight="bold" />} onClick={() => setDeleteTarget(pl)}>Excluir</Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCreate && <CreatePlaylistModal onClose={() => setShowCreate(false)} onSuccess={() => refetch()} accentColor={ACCENT} />}
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
