import type { DownloadDataPoint } from "@/types/dashboard";
import type { ApiDashboardResponse } from "@/types/api";
import { request } from "./api";

export const dashboardService = {
  /** GET /dashboard → estatísticas gerais */
  stats: (): Promise<ApiDashboardResponse> => request("/dashboard"),

  /** GET /dashboard/downloads-by-week → dados para gráfico de linha */
  downloadsByWeek: (): Promise<DownloadDataPoint[]> =>
    request("/dashboard/downloads-by-week"),

  /** GET /dashboard/downloads-by-month */
  downloadsByMonth: (): Promise<DownloadDataPoint[]> =>
    request("/dashboard/downloads-by-month"),
};
