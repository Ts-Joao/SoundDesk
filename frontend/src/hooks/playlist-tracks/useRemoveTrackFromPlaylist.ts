"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { playlistTrackService } from "@/services/plalist-track.service";

interface RemoveTrackFromPlaylistVars {
  playlistId: string;
  trackId:    string;
}

/**
 * Remove a associação de uma track a uma playlist.
 */
export function useRemoveTrackFromPlaylist() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ playlistId, trackId }: RemoveTrackFromPlaylistVars) =>
      playlistTrackService.removeTrack(playlistId, trackId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["playlist-tracks", vars.playlistId] });
      qc.invalidateQueries({ queryKey: ["playlists", vars.playlistId] });
    },
  });
}
