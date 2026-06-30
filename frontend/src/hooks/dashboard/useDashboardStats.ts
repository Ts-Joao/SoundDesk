"use client";

import { usePlaylists } from "@/hooks/playlists/usePlaylists";
import { useTracks } from "@/hooks/tracks/useTracks";
import { useDownloadJobs } from "@/hooks/downloads/useDownloadJobs";
import type { LibraryStats } from "@/types";

/**
 * Compõe estatísticas do dashboard a partir de dados já em cache.
 * Reutiliza os queries de playlists, tracks e downloads —
 * sem requests adicionais.
 */
export function useDashboardStats(): {
  data: LibraryStats | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const playlistsQuery = usePlaylists();
  const tracksQuery    = useTracks();
  const jobsQuery      = useDownloadJobs();

  const isLoading = playlistsQuery.isLoading || tracksQuery.isLoading || jobsQuery.isLoading;
  const isError   = playlistsQuery.isError   || tracksQuery.isError   || jobsQuery.isError;

  if (!playlistsQuery.data || !tracksQuery.data || !jobsQuery.data) {
    return { data: undefined, isLoading, isError };
  }

  const playlists = playlistsQuery.data;
  const tracks    = tracksQuery.data;
  const jobs      = jobsQuery.data;

  const completed  = tracks.filter((t) => t.status === "completed").length;
  const processing = jobs.filter((j) => j.status === "processing").length;
  const failed     = jobs.filter((j) => j.status === "failed").length;
  const pending    = jobs.filter((j) => j.status === "pending").length;

  const data: LibraryStats = {
    totalPlaylists:      playlists.length,
    totalTracks:         tracks.length,
    completedDownloads:  completed,
    processingDownloads: processing,
    failedDownloads:     failed,
    pendingDownloads:    pending,
    storageUsedMb:       Math.round(completed * 6.5),
    storageCapacityMb:   5120,
  };

  return { data, isLoading: false, isError: false };
}
