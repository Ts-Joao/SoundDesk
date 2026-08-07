// ============================================================
// DASHBOARD TYPES
// ============================================================

export interface DashboardStats {
  totalPlaylists: number;
  totalTracks: number;
  completedDownloads: number;
  processingDownloads: number;
  failedDownloads: number;
  pendingDownloads: number;
  totalExports: number;
  storageUsedMb: number;
  storageCapacityMb: number;
}

export interface DownloadDataPoint {
  date: string;       // "2025-06-01"
  completed: number;
  failed: number;
}

export interface StorageDataPoint {
  name: string;
  value: number;      // MB
  fill: string;
}
