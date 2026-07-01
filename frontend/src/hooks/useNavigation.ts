"use client";

import { useState } from "react";
import type { Playlist } from "@/types";

export type PageId =
  | "dashboard"
  | "playlists"
  | "playlist-detail"
  | "library"
  | "queue"
  | "settings";

export function useNavigation() {
  const [currentPage, setCurrentPage] = useState<PageId>("dashboard");
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = (page: PageId, data?: Playlist) => {
    if (page === "playlist-detail" && data) setSelectedPlaylist(data);
    if (page === "playlists") setSelectedPlaylist(null);
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  const pageMeta: Record<PageId, { title: string; subtitle: string }> = {
    dashboard: { title: "Dashboard", subtitle: "Visão geral da sua biblioteca musical" },
    playlists: { title: "Playlists", subtitle: "5 playlists criadas" },
    "playlist-detail": {
      title: selectedPlaylist?.name ?? "",
      subtitle: `${selectedPlaylist?.trackCount ?? 0} músicas`,
    },
    library: { title: "Biblioteca", subtitle: "Todas as músicas baixadas" },
    queue: { title: "Fila de Processamento", subtitle: "Acompanhe o status dos downloads" },
    settings: { title: "Configurações", subtitle: "Preferências do sistema" },
  };

  return {
    currentPage,
    selectedPlaylist,
    mobileMenuOpen,
    setMobileMenuOpen,
    navigate,
    pageMeta,
  };
}
