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
