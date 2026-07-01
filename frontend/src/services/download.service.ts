import { DownloadStatus } from "@/types";
import { request } from "./api";

export const downloadsService = {
  list: () => request('/downloads'),

  download: (id: string) => request(`/downloads/${id}/download`, {
    method: 'POST',
  }),

  retry: (id: string) => request(`/downloads/${id}/retry`, {
    method: 'POST',
  }),

  cancel: (id: string) => request(`/downloads/${id}/cancel`, {
    method: 'POST',
  }),

  findJobs: (status?: DownloadStatus) => request(`/downloads/jobs${status ? `?status=${status}` : ''}`),

  getById: (id: string) => request(`/downloads/${id}`),

  remove: (id: string) => request(`/downloads/${id}`, {
    method: 'DELETE',
  }),
}