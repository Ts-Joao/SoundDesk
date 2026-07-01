"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tracksService } from "@/services/track.service";
import { playlistTrackService } from "@/services/plalist-track.service";
import { downloadsService } from "@/services/download.service";

interface AddTracksVars {
  playlistId: string;
  urls:       string[];
}

/**
 * Hook de composição: para cada URL fornecida,
 * 1. Cria a track (POST /tracks)
 * 2. Associa à playlist (POST /playlist-tracks/:id/tracks/:trackId)
 * 3. Dispara o download da playlist (POST /downloads/:id/download)
 *
 * As steps 1 e 2 rodam sequencialmente por URL.
 * O download é disparado uma única vez ao final.
 */
export function useAddTracks() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ playlistId, urls }: AddTracksVars) => {
      for (const url of urls) {
        const track = await tracksService.create({
          title:      "Pendente...",
          artist:     "Pendente...",
          source_url: url,
          duration:   0,
          status:     "PENDING",
        });

        await playlistTrackService.addTrack(track.id, playlistId);
      }

      await downloadsService.download(playlistId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["playlists"] });
      qc.invalidateQueries({ queryKey: ["tracks"] });
      qc.invalidateQueries({ queryKey: ["downloads"] });
      qc.invalidateQueries({ queryKey: ["playlist-tracks"] });
    },
  });
}
