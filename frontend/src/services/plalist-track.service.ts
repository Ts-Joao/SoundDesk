import type { ApiPlaylist, ApiTrack } from "@/types/api";
import { request } from "./api";

export const playlistTrackService = {
  addTrack: (trackId: string, playlistId: string) =>
    request<ApiPlaylist>(`/playlist-tracks/${playlistId}/tracks/${trackId}`, {
      method: "POST",
    }),

  getTracks: (playlistId: string) =>
    request<ApiTrack[]>(`/playlist-tracks/${playlistId}/tracks`),

  removeTrack: (playlistId: string, trackId: string) =>
    request<ApiPlaylist>(`/playlist-tracks/${playlistId}/tracks/${trackId}`, {
      method: "DELETE",
    }),
};