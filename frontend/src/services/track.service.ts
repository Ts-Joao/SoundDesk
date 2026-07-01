import type { ApiTrack, CreateTrackPayload } from "@/types/api";
import { request } from "./api";

export const tracksService = {
  list: () =>
    request<ApiTrack[]>("/tracks"),

  create: (payload: CreateTrackPayload) =>
    request<ApiTrack>("/tracks", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getById: (id: string) =>
    request<ApiTrack>(`/tracks/${id}`),

  update: (id: string, payload: Partial<CreateTrackPayload>) =>
    request<ApiTrack>(`/tracks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  delete: (id: string) =>
    request<void>(`/tracks/${id}`, {
      method: "DELETE",
    }),
};