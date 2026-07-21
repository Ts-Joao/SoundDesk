"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";
import { qk } from "@/hooks/queryKeys";
import type { LibraryStats } from "@/types";

export interface DashboardData {
  stats: LibraryStats;
  recentTracks: Array<{
    id: string;
    title: string;
    artist: string;
    coverPath: string;
    duration: number;
  }>;
  recentPlaylists: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  recentDownloads: Array<{
    id: string;
    status: string;
    trackName: string;
    playlistName: string;
  }>;
  recentExports: Array<{
    id: string;
    playlist: string;
    status: string;
  }>;
}

/**
 * Busca estatísticas e dados do dashboard diretamente do backend.
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: qk.dashboardStats(),
    queryFn: async (): Promise<DashboardData> => {
      const raw = await dashboardService.stats();
      const s = raw.stats;

      const completed = s.completed_downloads;
      const exportsCount = s.completed_exports;
      const storageUsed = Math.round(completed * 6.5);
      const storageExports = Math.round(exportsCount * 12);

      return {
        stats: {
          totalPlaylists:      s.total_playlists,
          totalTracks:         s.total_tracks,
          completedDownloads:  completed,
          processingDownloads: s.processing_downloads,
          failedDownloads:     s.failed_downloads,
          pendingDownloads:    0,
          totalExports:        s.completed_exports,
          storageUsedMb:       storageUsed,
          storageCapacityMb:   5120,
        },
        recentTracks: raw.recent_tracks.map(t => ({
          id: t.id,
          title: t.title,
          artist: t.artist,
          coverPath: t.cover_path,
          duration: t.duration,
        })),
        recentPlaylists: raw.recent_playlists.map(p => ({
          id: p.id,
          name: p.name,
          color: p.color,
        })),
        recentDownloads: raw.recent_downloads.map(d => ({
          id: d.id,
          status: d.status,
          trackName: d.track_name ?? "Sem Faixa",
          playlistName: d.playlist_name ?? "Sem Playlist",
        })),
        recentExports: raw.recent_exports.map(e => ({
          id: e.id,
          playlist: e.playlist,
          status: e.status,
        })),
      };
    },
    staleTime: 10_000,
  });
}
