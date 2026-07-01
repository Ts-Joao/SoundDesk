"use client";

import { useQuery } from "@tanstack/react-query";
import { downloadsService } from "@/services/download.service";
import { mapApiDownloadJob } from "@/lib/trackMapper";
import { qk } from "@/hooks/queryKeys";
import type { QueueJob } from "@/types";
import type { DownloadStatus } from "@/types";

/**
 * Busca os jobs de download com polling automático a cada 5s.
 * Filtra por status quando fornecido.
 */
export function useDownloadJobs(status?: DownloadStatus) {
  return useQuery({
    queryKey: qk.downloads(status),
    queryFn: async (): Promise<QueueJob[]> => {
      const raw = await downloadsService.findJobs(status);
      return (raw as any[]).map(mapApiDownloadJob);
    },
    staleTime:       5_000,
    refetchInterval: 5_000,
  });
}
