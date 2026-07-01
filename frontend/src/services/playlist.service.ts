import type { ApiPlaylist, CreatePlaylistPayload } from "@/types/api";
import { request } from "./api";

export const playlistsService = {
  list: () =>
    request<ApiPlaylist[]>("/playlists"),

  create: (payload: CreatePlaylistPayload) =>
    request<ApiPlaylist>("/playlists", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getById: (id: string) =>
    request<ApiPlaylist>(`/playlists/${id}`),

  update: (id: string, payload: Partial<CreatePlaylistPayload>) =>
    request<ApiPlaylist>(`/playlists/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  delete: (id: string) =>
    request<void>(`/playlists/${id}`, {
      method: "DELETE",
    }),
};