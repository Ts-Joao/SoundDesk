"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tracksService } from "@/services/track.service";
import type { CreateTrackPayload } from "@/types/api";

/**
 * Cria uma track e invalida o cache de tracks.
 */
export function useCreateTrack() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTrackPayload) =>
      tracksService.create(payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["tracks"] }),
  });
}
