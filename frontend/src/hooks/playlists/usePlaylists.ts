"use client";

import { useQuery } from "@tanstack/react-query";
import { playlistsService } from "@/services/playlist.service";
import { getPlaylistColor } from "@/lib/playlistColor";
import { qk } from "@/hooks/queryKeys";
import type { Playlist } from "@/types";

/**
 * Busca a lista de playlists e aplica transformações de domínio:
 * - Gera `color` estável por ID
 * - Inicializa contadores de tracks (o backend não os retorna ainda)
 * - Filtra localmente por `search` se fornecido
 */
export function usePlaylists(search?: string) {
  return useQuery({
    queryKey: qk.playlists(search),
    queryFn: async (): Promise<Playlist[]> => {
      const raw = await playlistsService.list();

      const playlists: Playlist[] = raw.map((pl) => ({
        id:               pl.id,
        name:             pl.name,
        description:      pl.description ?? undefined,
        color:            getPlaylistColor(pl.id),
        status:           "active" as const,
        trackCount:       0,
        completedTracks:  0,
        failedTracks:     0,
        pendingTracks:    0,
        createdAt:        new Date().toISOString(),
        updatedAt:        new Date().toISOString(),
      }));

      if (!search) return playlists;

      const q = search.toLowerCase();
      return playlists.filter(
        (pl) =>
          pl.name.toLowerCase().includes(q) ||
          (pl.description?.toLowerCase().includes(q) ?? false)
      );
    },
    staleTime: 30_000,
  });
}
