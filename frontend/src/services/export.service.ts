import { request } from "./api";

export const exportsService = {
  list: () => request('/api/exports'),

  exportPlaylist: (id: string) => request(`/api/exports/playlists/${id}`, {
    method: 'POST',
  }),

  getById: (id: string) => request(`/api/exports/${id}`),

  retryExport: (id: string) => request(`/api/exports/playlists/${id}/retry`, {
    method: 'POST',
  }),

  cancelExport: (id: string) => request(`/api/exports/playlists/${id}/cancel`, {
    method: 'POST',
  }),

  getZip: (id: string) => request(`/api/exports/${id}/download`),
}
