"use client";

// ============================================================
// useApi.ts — Barrel de re-exports (compatibilidade)
// ============================================================
// Este arquivo mantém todos os imports existentes nos componentes
// funcionando sem nenhuma alteração necessária nas views.
//
// Novos hooks devem ser importados diretamente dos módulos:
//   import { usePlaylists } from "@/hooks/playlists/usePlaylists"
// ============================================================

// Query Keys
export { qk } from "@/hooks/queryKeys";

// Playlists
export { usePlaylists }  from "@/hooks/playlists/usePlaylists";
export { usePlaylist }   from "@/hooks/playlists/usePlaylist";
export { useCreatePlaylist } from "@/hooks/playlists/useCreatePlaylist";
export { useDeletePlaylist } from "@/hooks/playlists/useDeletePlaylist";

// Tracks
export { useTracks }       from "@/hooks/tracks/useTracks";
export { useCreateTrack }  from "@/hooks/tracks/useCreateTrack";
export { useDeleteTrack }  from "@/hooks/tracks/useDeleteTrack";

// Playlist Tracks
export { usePlaylistTracks }         from "@/hooks/playlist-tracks/usePlaylistTracks";
export { useAddTrackToPlaylist }      from "@/hooks/playlist-tracks/useAddTrackToPlaylist";
export { useRemoveTrackFromPlaylist } from "@/hooks/playlist-tracks/useRemoveTrackFromPlaylist";

// Downloads
export { useDownloadJobs }    from "@/hooks/downloads/useDownloadJobs";
export { useDownloadPlaylist } from "@/hooks/downloads/useDownloadPlaylist";
export { useRetryDownload }   from "@/hooks/downloads/useRetryDownload";
export { useCancelDownload }  from "@/hooks/downloads/useCancelDownload";

// Exports
export { useExportJobs }   from "@/hooks/exports/useExportJobs";
export { useCreateExport } from "@/hooks/exports/useCreateExport";
export { useRetryExport }  from "@/hooks/exports/useRetryExport";
export { useCancelExport } from "@/hooks/exports/useCancelExport";

// Dashboard
export { useDashboardStats } from "@/hooks/dashboard/useDashboardStats";

// Composição
export { useAddTracks } from "@/hooks/useAddTracks";

// Aliases de compatibilidade (nomes antigos → novos)
export { useDashboardStats as useStats } from "@/hooks/dashboard/useDashboardStats";
export { useDownloadJobs   as useQueue } from "@/hooks/downloads/useDownloadJobs";
