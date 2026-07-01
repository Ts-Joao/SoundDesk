"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { playlistsService } from "@/services/playlist.service";
import { qk } from "@/hooks/queryKeys";
import type { CreatePlaylistPayload } from "@/types/api";

/**
 * Cria uma nova playlist e invalida o cache de listas.
 */
export function useCreatePlaylist() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePlaylistPayload) =>
      playlistsService.create(payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["playlists"] }),
  });
}
