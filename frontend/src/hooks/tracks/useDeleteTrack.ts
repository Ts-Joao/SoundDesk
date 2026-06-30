"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tracksService } from "@/services/track.service";

/**
 * Remove uma track e invalida os caches de tracks e playlists.
 */
export function useDeleteTrack() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tracksService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tracks"] });
      qc.invalidateQueries({ queryKey: ["playlists"] });
      qc.invalidateQueries({ queryKey: ["downloads"] });
    },
  });
}
