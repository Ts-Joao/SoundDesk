"use client";

import { useQuery } from "@tanstack/react-query";
import { playlistsService } from "@/services/playlist.service";
import { playlistTrackService } from "@/services/plalist-track.service";
import { getPlaylistColor } from "@/lib/playlistColor";
import { mapBackendStatus } from "@/lib/trackMapper";
import { qk } from "@/hooks/queryKeys";
import type { Playlist } from "@/types";

/**
 * Busca a lista de playlists e aplica transformações de domínio:
 * - Gera `color` estável por ID ou usa a vinda do backend
 * - Busca tracks para calcular contadores reais de forma reativa
 * - Filtra localmente por `search` se fornecido
 */
export function usePlaylists(search?: string) {
  return useQuery({
    queryKey: qk.playlists(search),
    queryFn: async (): Promise<Playlist[]> => {
      const raw = await playlistsService.list();

      const playlists: Playlist[] = await Promise.all(
        raw.map(async (pl) => {
          const rawTracks = await playlistTrackService.getTracks(pl.id).catch(() => []);
          const color = pl.color || getPlaylistColor(pl.id);

          const completedTracks = rawTracks.filter(
            (t) => mapBackendStatus(t.status) === "completed"
          ).length;
          const failedTracks = rawTracks.filter((t) => mapBackendStatus(t.status) === "failed").length;
          const pendingTracks = rawTracks.filter(
            (t) => mapBackendStatus(t.status) === "pending" || mapBackendStatus(t.status) === "processing"
          ).length;

          return {
            id:               pl.id,
            name:             pl.name,
            description:      pl.description ?? undefined,
            color,
            status:           "active" as const,
            trackCount:       rawTracks.length,
            completedTracks,
            failedTracks,
            pendingTracks,
            createdAt:        new Date().toISOString(), // Fallback
            updatedAt:        new Date().toISOString(),
          };
        })
      );

      if (!search) return playlists;

      const q = search.toLowerCase();
      return playlists.filter(
        (pl) =>
          pl.name.toLowerCase().includes(q) ||
          (pl.description?.toLowerCase().includes(q) ?? false)
      );
    },
    staleTime: 10_000, // Reduced staleTime for more accurate updates
  });
}
