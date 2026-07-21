"use client";

// Re-exports para compatibilidade com o DashboardView
// O projeto compõe as stats localmente sem endpoint dedicado de dashboard
export { useDashboardStats } from "./useDashboardStats";

// Stub para dados de gráfico — substituir por endpoint real quando disponível
import { useQuery } from "@tanstack/react-query";
import type { DownloadDataPoint } from "@/types/dashboard";

const WEEK_STUB: DownloadDataPoint[] = [
  { date: "Seg", completed: 12, failed: 1 },
  { date: "Ter", completed: 8,  failed: 0 },
  { date: "Qua", completed: 20, failed: 2 },
  { date: "Qui", completed: 15, failed: 1 },
  { date: "Sex", completed: 25, failed: 0 },
  { date: "Sáb", completed: 10, failed: 3 },
  { date: "Dom", completed: 18, failed: 0 },
];

export function useDownloadsByWeek() {
  return useQuery({
    queryKey: ["dashboard", "downloads-week"],
    queryFn: async (): Promise<DownloadDataPoint[]> => {
      // TODO: GET /api/dashboard/downloads-by-week
      return WEEK_STUB;
    },
    staleTime: 60_000,
  });
}
