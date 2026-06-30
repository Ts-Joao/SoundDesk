"use client";

import { useQuery } from "@tanstack/react-query";
import { playlistTrackService } from "@/services/plalist-track.service";
import { mapApiTrack } from "@/lib/trackMapper";
import { getPlaylistColor } from "@/lib/playlistColor";
import { qk } from "@/hooks/queryKeys";
import type { Track } from "@/types";

/**
 * Busca as tracks de uma playlist específica via GET /playlist-tracks/:id/tracks.
 * Diferente de useTracks, este hook é escopado por playlist.
 */
export function usePlaylistTracks(playlistId: string) {
  return useQuery({
    queryKey: qk.playlistTracks(playlistId),
    queryFn: async (): Promise<Track[]> => {
      const raw = await playlistTrackService.getTracks(playlistId);
      const color = getPlaylistColor(playlistId);
      return raw.map((t) =>
        mapApiTrack(t, { playlistId, coverColor: color })
      );
    },
    enabled: !!playlistId,
    staleTime: 10_000,
  });
}
