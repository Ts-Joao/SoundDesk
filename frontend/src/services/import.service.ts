import type { ApiPlaylist } from "@/types/api";
import { request } from "./api";

export const importsService = {
  playlist: (playlistUrl: string) =>
    request<ApiPlaylist>(`/imports?playlist_url=${encodeURIComponent(playlistUrl)}`, {
      method: "POST",
    }),
};
