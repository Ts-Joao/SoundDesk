"use client";

// ============================================================
// Query Keys — chaves centralizadas para o React Query
// Importar de cá em todos os hooks para consistência
// ============================================================

export const qk = {
  /** Lista de playlists (com filtro opcional de busca) */
  playlists: (search?: string) => ["playlists", search ?? ""] as const,

  /** Playlist individual + suas tracks */
  playlist: (id: string) => ["playlists", id] as const,

  /** Tracks da playlist (endpoint playlist-tracks) */
  playlistTracks: (id: string) => ["playlist-tracks", id] as const,

  /** Lista global de tracks */
  tracks: (params?: object) => ["tracks", params ?? {}] as const,

  /** Jobs de download (com filtro opcional de status) */
  downloads: (status?: string) => ["downloads", status ?? "all"] as const,

  /** Jobs de exportação */
  exports: () => ["exports"] as const,
} as const;
