"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { exportsService } from "@/services/export.service";

/**
 * Inicia a exportação de uma playlist como ZIP.
 */
export function useCreateExport() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (playlistId: string) =>
      exportsService.exportPlaylist(playlistId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["exports"] }),
  });
}
