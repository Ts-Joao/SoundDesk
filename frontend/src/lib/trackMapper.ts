// ============================================================
// Track Mapper — funções de transformação de dados do backend
// Extraído de useApi.ts; hooks não devem conter lógica de mapeamento
// ============================================================

import type { Track, QueueJob, TrackStatus } from "@/types";
import type { ApiTrack, ApiDownloadJob } from "@/types/api";
import { getPlaylistColor } from "@/lib/playlistColor";

/**
 * Converte o status do backend (UPPERCASE) para o status do frontend (lowercase).
 * Centraliza o mapeamento em um único lugar.
 */
export function mapBackendStatus(status: string): TrackStatus {
  const statusMap: Record<string, TrackStatus> = {
    PENDING:    "pending",
    PROCESSING: "processing",
    COMPLETED:  "completed",
    READY:      "completed",
    FAILED:     "failed",
    RETRYING:   "processing",
    CANCELED:   "failed",
  };
  return statusMap[status.toUpperCase()] ?? "pending";
}

/** Opções para mapeamento de ApiTrack → Track */
export interface MapTrackOptions {
  /** ID da playlist à qual a track pertence (quando conhecido) */
  playlistId?: string;
  /** Nome da playlist (quando conhecido) */
  playlistName?: string;
  /** Cor da playlist (quando já calculada) */
  coverColor?: string;
}

/**
 * Converte um ApiTrack (shape do backend) em um Track (tipo de domínio do frontend).
 */
export function mapApiTrack(raw: ApiTrack, opts: MapTrackOptions = {}): Track {
  const playlistId = opts.playlistId ?? "all";
  const coverColor =
    opts.coverColor ??
    (playlistId !== "all" ? getPlaylistColor(playlistId) : "#6C63FF");

  return {
    id:           raw.id,
    playlistId,
    playlistName: opts.playlistName ?? "Sem Playlist",
    name:         raw.title,
    artist:       raw.artist,
    duration:     raw.duration,
    url:          raw.source_url,
    status:       mapBackendStatus(raw.status),
    addedAt:      new Date().toISOString(),
    downloadedAt: null,
    fileSize:     raw.file_path ? "6.5 MB" : null,
    coverColor,
  };
}

/**
 * Converte um ApiDownloadJob (shape do backend) em um QueueJob (tipo do frontend).
 * O backend não retorna track_name/playlist_name, então usamos fallbacks.
 */
export function mapApiDownloadJob(job: ApiDownloadJob): QueueJob {
  const status = mapBackendStatus(job.status);
  return {
    id:          job.id,
    trackName:   "Música Desconhecida",
    playlistName: "Sem Playlist",
    status,
    progress:
      job.status === "COMPLETED" ? 100 :
      job.status === "PROCESSING" ? 45 : 0,
    startedAt:   job.started_at ?? undefined,
    completedAt: job.finished_at ?? undefined,
    error:       job.error_message ?? undefined,
  };
}
