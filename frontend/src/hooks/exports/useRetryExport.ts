"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { exportsService } from "@/services/export.service";

/**
 * Retenta uma exportação que falhou.
 */
export function useRetryExport() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => exportsService.retryExport(jobId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["exports"] }),
  });
}
