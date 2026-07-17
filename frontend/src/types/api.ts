// ============================================================
// API Types — shapes exatos das respostas da FastAPI
// Separados dos tipos de domínio do frontend (src/types/index.ts)
// ============================================================

/** Retorno de GET /playlists e GET /playlists/:id */
export interface ApiPlaylist {
  id: string;
  name: string;
  description?: string | null;
  color?: string;
  created_at: string;
  updated_at: string;
  track_count: number;
  completed_tracks: number;
  failed_tracks: number;
  pending_tracks: number;
}

/** Retorno de GET /tracks, GET /tracks/:id e GET /playlist-tracks/:id/tracks */
export interface ApiTrack {
  id: string;
  title: string;
  artist: string;
  source_url: string;
  duration: number;
  status: string;
  file_path: string | null;
  cover_path: string | null;
}

/** Retorno de GET /downloads/jobs e GET /downloads/jobs/:id */
export interface ApiDownloadJob {
  id: string;
  track_id: string;
  status: string;
  error_message: string | null;
  started_at: string | null;
  finished_at: string | null;
}

/** Retorno de GET /exports e GET /exports/:id */
export interface ApiExportJob {
  id: string;
  playlist_id: string;
  status: string;
  file_path: string | null;
  error_message: string | null;
  started_at: string | null;
  finished_at: string | null;
}

/** Payload para POST /playlists */
export interface CreatePlaylistPayload {
  name: string;
  description?: string;
  color?: string;
}

/** Payload para POST /tracks */
export interface CreateTrackPayload {
  title: string;
  artist: string;
  source_url: string;
  duration: number;
  status?: string;
}

export interface ApiDashboardStats {
  total_tracks: number;
  total_playlists: number;
  completed_downloads: number;
  processing_downloads: number;
  failed_downloads: number;
  completed_exports: number;
  processing_exports: number;
}

export interface ApiRecentTrack {
  id: string;
  title: string;
  artist: string;
  cover_path: string;
  duration: number;
}

export interface ApiRecentPlaylist {
  id: string;
  name: string;
  color: string;
}

export interface ApiRecentDownload {
  id: string;
  status: string;
  track_name: string | null;
  playlist_name: string | null;
}

export interface ApiRecentExport {
  id: string;
  playlist: string;
  status: string;
}

export interface ApiDashboardResponse {
  stats: ApiDashboardStats;
  recent_tracks: ApiRecentTrack[];
  recent_playlists: ApiRecentPlaylist[];
  recent_downloads: ApiRecentDownload[];
  recent_exports: ApiRecentExport[];
}

