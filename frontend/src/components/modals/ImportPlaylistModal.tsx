"use client";

import { useState } from "react";
import { Check, DownloadSimple } from "@phosphor-icons/react";
import { Modal } from "./Modal";
import { Button } from "@/components/ui/Button";
import { useImportPlaylist } from "@/hooks/playlists/useImportPlaylist";

interface ImportPlaylistModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  accentColor?: string;
}

export function ImportPlaylistModal({ onClose, onSuccess, accentColor = "#6C63FF" }: ImportPlaylistModalProps) {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [imported, setImported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const importPlaylist = useImportPlaylist();

  const handleImport = async () => {
    if (!playlistUrl.trim()) return;
    setError(null);
    try {
      await importPlaylist.mutateAsync(playlistUrl.trim());
      setImported(true);
      onSuccess?.();
      setTimeout(onClose, 900);
    } catch (reason) {
      setError(reason instanceof Error ? "Não foi possível importar esta playlist. Verifique o link e tente novamente." : "Não foi possível importar esta playlist.");
    }
  };

  return (
    <Modal title="Importar Playlist" onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.5 }}>
          Cole o link de uma playlist pública do YouTube ou Spotify. As músicas serão adicionadas e colocadas na fila de download.
        </p>
        <div>
          <label style={{ display: "block", marginBottom: 6, color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>LINK DA PLAYLIST</label>
          <input
            autoFocus
            value={playlistUrl}
            onChange={(event) => setPlaylistUrl(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && handleImport()}
            disabled={importPlaylist.isPending || imported}
            placeholder="https://www.youtube.com/playlist?..."
            className="sv-input"
            style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#fff", fontSize: 14, outline: "none" }}
          />
        </div>
        {error && <p style={{ margin: 0, color: "#f87171", fontSize: 12 }}>{error}</p>}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <Button onClick={onClose} disabled={importPlaylist.isPending}>Cancelar</Button>
          <Button
            onClick={handleImport}
            disabled={!playlistUrl.trim() || importPlaylist.isPending || imported}
            variant={imported ? "success" : "primary"}
            accentColor={accentColor}
            icon={imported ? <Check size={14} weight="bold" /> : <DownloadSimple size={14} weight="bold" />}
          >
            {imported ? "Importada!" : importPlaylist.isPending ? "Importando..." : "Importar Playlist"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
