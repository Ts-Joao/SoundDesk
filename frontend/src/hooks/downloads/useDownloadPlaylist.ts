"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { downloadsService } from "@/services/download.service";

/**
 * Dispara o download de uma playlist completa.
 * Invalida o cache de downloads após sucesso.
 */
export function useDownloadPlaylist() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (playlistId: string) =>
      downloadsService.download(playlistId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["downloads"] }),
  });
}
