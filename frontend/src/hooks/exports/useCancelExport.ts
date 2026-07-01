"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { exportsService } from "@/services/export.service";

/**
 * Cancela uma exportação em andamento.
 */
export function useCancelExport() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => exportsService.cancelExport(jobId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["exports"] }),
  });
}
