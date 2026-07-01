"use client";

import { useQuery } from "@tanstack/react-query";
import { tracksService } from "@/services/track.service";
import { mapApiTrack } from "@/lib/trackMapper";
import { qk } from "@/hooks/queryKeys";
import type { Track } from "@/types";

export interface UseTracksParams {
  playlistId?: string;
  status?:     string;
  search?:     string;
}

/**
 * Busca todas as tracks e aplica filtros locais opcionais.
 * Não faz N+1: uma única chamada GET /tracks, filtragem no cliente.
 */
export function useTracks(params?: UseTracksParams) {
  return useQuery({
    queryKey: qk.tracks(params),
    queryFn: async (): Promise<Track[]> => {
      const raw = await tracksService.list();
      const mapped = raw.map((t) => mapApiTrack(t));

      if (!params) return mapped;

      let filtered = mapped;

      if (params.playlistId && params.playlistId !== "all") {
        filtered = filtered.filter((t) => t.playlistId === params.playlistId);
      }
      if (params.status) {
        filtered = filtered.filter((t) => t.status === params.status);
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.artist.toLowerCase().includes(q)
        );
      }

      return filtered;
    },
    staleTime: 10_000,
  });
}
