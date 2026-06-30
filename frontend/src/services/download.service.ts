import { DownloadStatus } from "@/types";
import { request } from "./api";

export const downloadsService = {
  list: () => request('/api/downloads'),

  download: (id: string) => request(`/api/downloads/${id}/download`, {
    method: 'POST',
  }),

  retry: (id: string) => request(`/api/downloads/${id}/retry`, {
    method: 'POST',
  }),

  cancel: (id: string) => request(`/api/downloads/${id}/cancel`, {
    method: 'POST',
  }),

  findJobs: (status?: DownloadStatus) => request(`/api/downloads/jobs${status ? `?status=${status}` : ''}`),

  getById: (id: string) => request(`/api/downloads/${id}`),

  remove: (id: string) => request(`/api/downloads/${id}`, {
    method: 'DELETE',
  }),
}