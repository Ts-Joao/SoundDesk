"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { playlistsService } from "@/services/playlist.service";
import { playlistTrackService } from "@/services/plalist-track.service";
import { getPlaylistColor } from "@/lib/playlistColor";
import { mapApiTrack, mapBackendStatus } from "@/lib/trackMapper";
import { qk } from "@/hooks/queryKeys";
import type { Playlist } from "@/types";
import type { ApiPlaylist, ApiTrack } from "@/types/api";

/**
 * Busca uma playlist pelo ID combinando:
 * - GET /playlists/:id (ou dados do cache de lista)
 * - GET /playlist-tracks/:id/tracks
 *
 * Calcula contadores de status das tracks no cliente.
 */
export function usePlaylist(id: string) {
  const qc = useQueryClient();

  return useQuery({
    queryKey: qk.playlist(id),
    queryFn: async () => {
      // Reutiliza do cache de lista se disponível para evitar request extra
      const cachedList = qc.getQueryData<Playlist[]>(qk.playlists());
      const cachedPlaylist = cachedList?.find((p) => p.id === id);

      const [rawPlaylist, rawTracks] = await Promise.all([
        cachedPlaylist
          ? Promise.resolve({
              id:               cachedPlaylist.id,
              name:             cachedPlaylist.name,
              description:      cachedPlaylist.description,
              color:            cachedPlaylist.color,
              created_at:       cachedPlaylist.createdAt,
              updated_at:       cachedPlaylist.updatedAt,
              track_count:       cachedPlaylist.trackCount,
              completed_tracks: cachedPlaylist.completedTracks,
              failed_tracks:    cachedPlaylist.failedTracks,
              pending_tracks:   cachedPlaylist.pendingTracks,
            } as ApiPlaylist)
          : playlistsService.getById(id),
        playlistTrackService.getTracks(id),
      ]);

      const color = rawPlaylist.color || cachedPlaylist?.color || getPlaylistColor(rawPlaylist.id);

      const tracks = rawTracks.map((t: ApiTrack) =>
        mapApiTrack(t, {
          playlistId:   rawPlaylist.id,
          playlistName: rawPlaylist.name,
        })
      );

      return {
        id:              rawPlaylist.id,
        name:            rawPlaylist.name,
        description:     rawPlaylist.description ?? undefined,
        color,
        status:          "active" as const,
        trackCount:      rawPlaylist.track_count ?? tracks.length,
        completedTracks: rawPlaylist.completed_tracks ?? 0,
        failedTracks:    rawPlaylist.failed_tracks ?? 0,
        pendingTracks:   rawPlaylist.pending_tracks ?? 0,
        createdAt:       rawPlaylist.created_at ?? new Date().toISOString(),
        updatedAt:       rawPlaylist.updated_at ?? new Date().toISOString(),
        tracks,
      };
    },
    enabled: !!id,
  });
}
