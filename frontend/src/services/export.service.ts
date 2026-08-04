import { request, requestBlob } from "./api";

export const exportsService = {
  list: () => request('/exports'),

  exportPlaylist: (id: string) => request(`/exports/playlists/${id}`, {
    method: 'POST',
  }),

  getById: (id: string) => request(`/exports/${id}`),

  retryExport: (id: string) => request(`/exports/playlists/${id}/retry`, {
    method: 'POST',
  }),

  cancelExport: (id: string) => request(`/exports/playlists/${id}/cancel`, {
    method: 'POST',
  }),

  getZip: (id: string) => requestBlob(`/exports/${id}/download`),
}
