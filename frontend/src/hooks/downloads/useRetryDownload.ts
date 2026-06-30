"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { downloadsService } from "@/services/download.service";

/**
 * Retenta um job de download que falhou.
 */
export function useRetryDownload() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => downloadsService.retry(jobId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["downloads"] }),
  });
}
