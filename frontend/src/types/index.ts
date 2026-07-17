// ============================================================
// TYPES — SoundDesk
// ============================================================

export type TrackStatus = "pending" | "processing" | "completed" | "failed";
export type PlaylistStatus = "active" | "archived";
export type DownloadStatus = "pending" | "processing" | "completed" | "failed" | "retrying" | "canceled";
export type Theme = "dark" | "light";
export type Language = "pt-BR" | "en-US";

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  color: string;
  trackCount: number;
  createdAt: string;
  updatedAt: string;
  status: PlaylistStatus;
  totalDuration?: number;
  completedTracks: number;
  failedTracks: number;
  pendingTracks: number;
}

export interface Track {
  id: string;
  playlistId: string;
  playlistName: string;
  name: string;
  artist: string;
  duration: number;
  url: string;
  status: TrackStatus;
  addedAt: string;
  downloadedAt?: string | null;
  fileSize?: string | null;
  coverColor: string;
  progress?: number;
  error?: string;
  cover_path?: string;
}

export interface QueueJob {
  id: string;
  trackName: string;
  playlistName: string;
  status: TrackStatus;
  progress: number;
  startedAt?: string | null;
  completedAt?: string | null;
  url?: string;
  error?: string;
}

export interface LibraryStats {
  totalPlaylists: number;
  totalTracks: number;
  completedDownloads: number;
  processingDownloads: number;
  failedDownloads: number;
  pendingDownloads: number;
  storageUsedMb: number;
  storageCapacityMb: number;
  totalExports?: number;
}

export interface AppSettings {
  theme: Theme;
  accentColor: string;
  compactMode: boolean;
  animations: boolean;
  notifications: boolean;
  language: Language;
}

export interface StatusConfig {
  label: string;
  color: string;
  bg: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
