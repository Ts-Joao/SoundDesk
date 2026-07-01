"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { downloadsService } from "@/services/download.service";

/**
 * Cancela um job de download em andamento.
 */
export function useCancelDownload() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => downloadsService.cancel(jobId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["downloads"] }),
  });
}
