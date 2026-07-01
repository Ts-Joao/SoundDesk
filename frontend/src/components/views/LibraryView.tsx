"use client";

import { useState } from "react";
import {
  Books,
  DownloadSimple,
  Info,
  Trash,
} from "@phosphor-icons/react";
import { SearchInput, CoverArt, EmptyState } from "@/components/ui/index";
import { LibraryRowSkeleton } from "@/components/skeletons";
import { useTracks, useDeleteTrack } from "@/hooks/useApi";
import { formatDuration, formatRelative } from "@/lib/utils";

export function LibraryView() {
  const [search, setSearch] = useState("");
  const [filterPlaylist, setFilterPlaylist] = useState("all");

  const { data: tracks, isLoading } = useTracks({ status: "completed" });
  const deleteTrack = useDeleteTrack();

  const filtered = (tracks ?? []).filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.artist.toLowerCase().includes(search.toLowerCase());
    const matchPlaylist = filterPlaylist === "all" || t.playlistId === filterPlaylist;
    return matchSearch && matchPlaylist;
  });

  const playlists = [
    ...new Map(
      (tracks ?? []).map((t) => [t.playlistId, { id: t.playlistId, name: t.playlistName }])
    ).values(),
  ];

  return (
    <div style={{ padding: 24 }} className="sv-fade-in">
      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar músicas ou artistas..." />
        <select
          value={filterPlaylist}
          onChange={(e) => setFilterPlaylist(e.target.value)}
          className="sv-input"
          style={{
            padding: "8px 12px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            color: "rgba(255,255,255,0.7)",
            fontSize: 13,
            outline: "none",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <option value="all">Todas playlists</option>
          {playlists.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
          {filtered.length} música{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div
        style={{
          background: "#1A1B2E",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 140px 160px 90px 90px 90px",
            padding: "8px 18px",
            fontSize: 11,
            fontWeight: 600,
            color: "rgba(255,255,255,0.25)",
            letterSpacing: "0.06em",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <div>MÚSICA</div>
          <div>ARTISTA</div>
          <div>PLAYLIST</div>
          <div>TAMANHO</div>
          <div>DATA</div>
          <div />
        </div>

        {isLoading ? (
          Array.from({ length: 7 }).map((_, i) => <LibraryRowSkeleton key={i} />)
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Books size={28} weight="duotone" />}
            title="Biblioteca vazia"
            description="Quando os downloads forem concluídos, suas músicas aparecerão aqui."
          />
        ) : (
          filtered.map((track) => (
            <div
              key={track.id}
              className="sv-row"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 140px 160px 90px 90px 90px",
                padding: "10px 18px",
                alignItems: "center",
                borderBottom: "1px solid rgba(255,255,255,0.03)",
                fontSize: 13,
                transition: "background 0.15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <CoverArt color={track.coverColor} name={track.name} size={36} />
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.85)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {track.name}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>
                    {formatDuration(track.duration)}
                  </div>
                </div>
              </div>
              <div style={{ color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {track.artist}
              </div>
              <div style={{ color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: 12 }}>
                {track.playlistName}
              </div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>
                {track.fileSize ?? "--"}
              </div>
              <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 11 }}>
                {formatRelative(track.downloadedAt)}
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <button
                  className="sv-icon-btn"
                  style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", padding: 4, display: "flex" }}
                >
                  <DownloadSimple size={14} weight="bold" />
                </button>
                <button
                  className="sv-icon-btn"
                  style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", padding: 4, display: "flex" }}
                >
                  <Info size={14} weight="bold" />
                </button>
                <button
                  className="sv-icon-btn"
                  onClick={() => deleteTrack.mutate(track.id)}
                  style={{ background: "none", border: "none", color: "rgba(239,68,68,0.5)", cursor: "pointer", padding: 4, display: "flex" }}
                >
                  <Trash size={14} weight="bold" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
