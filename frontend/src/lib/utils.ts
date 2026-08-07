import type { StatusConfig, TrackStatus } from "@/types";

export const formatDuration = (seconds: number): string => {
  if (!seconds) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export const formatDate = (iso: string | null | undefined): string => {
  if (!iso) return "--";
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

export const formatRelative = (iso: string | null | undefined): string => {
  if (!iso) return "--";
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Hoje";
  if (days === 1) return "Ontem";
  if (days < 7) return `${days} dias atrás`;
  return formatDate(iso);
};

export const formatBytes = (mb: number): string => {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  return `${mb} MB`;
};

export const getStatusConfig = (status: TrackStatus | string): StatusConfig => {
  const map: Record<string, StatusConfig> = {
    completed:  { label: "Concluído",   color: "#22c55e", bg: "rgba(34,197,94,0.12)"   },
    processing: { label: "Processando", color: "#3b82f6", bg: "rgba(59,130,246,0.12)"  },
    pending:    { label: "Pendente",    color: "#94a3b8", bg: "rgba(148,163,184,0.12)" },
    failed:     { label: "Erro",        color: "#ef4444", bg: "rgba(239,68,68,0.12)"   },
    cancelled:  { label: "Cancelado",   color: "#f59e0b", bg: "rgba(245,158,11,0.12)"  },
  };
  return map[status] ?? map.pending;
};

export const getPlaylistProgress = (playlist: any): number => {
  const total     = playlist.trackCount     ?? playlist.track_count     ?? 0;
  const completed = playlist.completedTracks ?? playlist.completed_tracks ?? 0;
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

export const getInitials = (name: string): string =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

export const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const ACCENT_COLORS = [
  { name: "Violeta",   value: "#6C63FF" },
  { name: "Esmeralda", value: "#43D9AD" },
  { name: "Rosa",      value: "#FF6584" },
  { name: "Âmbar",    value: "#F5A623" },
  { name: "Azul",     value: "#3498DB"  },
  { name: "Vermelho",  value: "#E74C3C" },
];

export const PLAYLIST_COLORS = [
  "#6C63FF", "#FF6584", "#43D9AD",
  "#F5A623", "#E74C3C", "#3498DB",
  "#9B59B6", "#1ABC9C",
];
