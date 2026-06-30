// ============================================================
// Playlist Color — gera cor estável baseada no ID da playlist
// Extraído de useApi.ts para reutilização fora dos hooks
// ============================================================

import { PLAYLIST_COLORS } from "@/lib/utils";

/**
 * Gera uma cor determinística para uma playlist com base no seu ID.
 * A mesma playlist sempre retorna a mesma cor (hash estável).
 */
export function getPlaylistColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PLAYLIST_COLORS[Math.abs(hash) % PLAYLIST_COLORS.length];
}
