import type { ApiPlaylist } from "@/types/api";
import { request } from "./api";

export const importsService = {
  playlist: (playlistUrl: string) =>
    request<ApiPlaylist>("/imports/", {
      method: "POST",
      body: JSON.stringify({ playlist_url: playlistUrl }),
    }),
};
