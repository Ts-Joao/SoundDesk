"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { playlistsService } from "@/services/playlist.service";

/**
 * Remove uma playlist pelo ID e invalida o cache de listas.
 */
export function useDeletePlaylist() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => playlistsService.delete(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["playlists"] }),
  });
}
