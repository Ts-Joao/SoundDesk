"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { importsService } from "@/services/import.service";
import { qk } from "@/hooks/queryKeys";

export function useImportPlaylist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (playlistUrl: string) => importsService.playlist(playlistUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.playlists() });
      queryClient.invalidateQueries({ queryKey: qk.downloads() });
    },
  });
}
