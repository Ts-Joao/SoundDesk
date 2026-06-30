"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { playlistTrackService } from "@/services/plalist-track.service";

interface AddTrackToPlaylistVars {
  trackId:    string;
  playlistId: string;
}

/**
 * Associa uma track a uma playlist via POST /playlist-tracks/:playlistId/tracks/:trackId.
 */
export function useAddTrackToPlaylist() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ trackId, playlistId }: AddTrackToPlaylistVars) =>
      playlistTrackService.addTrack(trackId, playlistId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["playlist-tracks", vars.playlistId] });
      qc.invalidateQueries({ queryKey: ["playlists", vars.playlistId] });
    },
  });
}
