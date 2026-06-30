"use client";

import { useQuery } from "@tanstack/react-query";
import { exportsService } from "@/services/export.service";
import { qk } from "@/hooks/queryKeys";
import type { ApiExportJob } from "@/types/api";

/**
 * Busca todos os jobs de exportação.
 */
export function useExportJobs() {
  return useQuery({
    queryKey: qk.exports(),
    queryFn: () => exportsService.list() as Promise<ApiExportJob[]>,
    staleTime: 10_000,
  });
}
