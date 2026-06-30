"use client";

import { useState } from "react";
import { Trash, Check, Plus, Warning } from "@phosphor-icons/react";
import { Modal } from "@/components/modals/Modal";
import { Button } from "@/components/ui/Button";
import { CoverArt } from "@/components/ui/index";
import { PLAYLIST_COLORS, hexToRgba } from "@/lib/utils";
import { useCreatePlaylist } from "@/hooks/playlists/useCreatePlaylist";
import { useAddTracks } from "@/hooks/useAddTracks";

// ============================================================
// ConfirmDialog
// ============================================================
interface ConfirmDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
  accentColor?: string;
}

export function ConfirmDialog({ title, message, onConfirm, onCancel, danger = false, accentColor = "#6C63FF" }: ConfirmDialogProps) {
  return (
    <Modal title={title} onClose={onCancel} maxWidth={400}>
      <div style={{ display: "flex", gap: 14, marginBottom: 18 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: danger ? "rgba(239,68,68,0.12)" : hexToRgba(accentColor, 0.12), border: `1px solid ${danger ? "rgba(239,68,68,0.25)" : hexToRgba(accentColor, 0.25)}`, display: "flex", alignItems: "center", justifyContent: "center", color: danger ? "#ef4444" : accentColor, flexShrink: 0 }}>
          <Warning size={20} weight="duotone" />
        </div>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, margin: 0, lineHeight: 1.6, paddingTop: 8 }}>{message}</p>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Button onClick={onCancel}>Cancelar</Button>
        <Button onClick={onConfirm} variant={danger ? "danger" : "primary"} accentColor={accentColor} icon={danger ? <Trash size={14} weight="bold" /> : undefined}>
          {danger ? "Excluir" : "Confirmar"}
        </Button>
      </div>
    </Modal>
  );
}

// ============================================================
// AddTrackModal
// ============================================================
interface AddTrackModalProps {
  playlistName: string;
  playlistId: string;
  onClose: () => void;
  onSuccess?: () => void;
  accentColor?: string;
}

export function AddTrackModal({ playlistName, playlistId, onClose, onSuccess, accentColor = "#6C63FF" }: AddTrackModalProps) {
  const [urls, setUrls] = useState("");
  const [added, setAdded] = useState(false);

  const addTracks = useAddTracks();

  const urlList = urls.trim()
    ? urls.trim().split("\n").filter((u) => u.trim())
    : [];
  const urlCount = urlList.length;

  const handleAdd = async () => {
    if (!urlCount) return;
    await addTracks.mutateAsync({ playlistId, urls: urlList });
    setAdded(true);
    onSuccess?.();
    setTimeout(onClose, 1000);
  };

  return (
    <Modal title="Adicionar Músicas" onClose={onClose}>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: "0 0 14px" }}>
        Playlist: <strong style={{ color: "rgba(255,255,255,0.75)" }}>{playlistName}</strong>
      </p>
      <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em", display: "block", marginBottom: 8 }}>
        URLs (uma por linha)
      </label>
      <textarea
        value={urls}
        onChange={(e) => setUrls(e.target.value)}
        placeholder={"https://youtube.com/watch?v=...\nhttps://youtu.be/...\nhttps://soundcloud.com/..."}
        className="sv-input sv-textarea"
        style={{ width: "100%", height: 140, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 12px", color: "#fff", fontSize: 13, fontFamily: "monospace", resize: "none", boxSizing: "border-box", outline: "none", transition: "border-color 0.15s, box-shadow 0.15s" }}
      />
      {urlCount > 0 && (
        <p style={{ fontSize: 12, color: accentColor, margin: "6px 0 0", fontWeight: 600 }}>
          {urlCount} URL{urlCount > 1 ? "s" : ""} detectada{urlCount > 1 ? "s" : ""}
        </p>
      )}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleAdd}
          disabled={!urlCount || added || addTracks.isPending}
          variant={added ? "success" : "primary"}
          accentColor={accentColor}
          icon={added ? <Check size={14} weight="bold" /> : <Plus size={14} weight="bold" />}
        >
          {added ? "Adicionado!" : addTracks.isPending ? "Adicionando..." : `Adicionar${urlCount > 0 ? ` ${urlCount}` : ""}`}
        </Button>
      </div>
    </Modal>
  );
}

// ============================================================
// CreatePlaylistModal
// ============================================================
interface CreatePlaylistModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  accentColor?: string;
}

export function CreatePlaylistModal({ onClose, onSuccess, accentColor = "#6C63FF" }: CreatePlaylistModalProps) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [created, setCreated] = useState(false);
  const [selectedColor, setSelectedColor] = useState(accentColor);

  const createPlaylist = useCreatePlaylist();

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "9px 12px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    color: "#fff",
    fontSize: 14,
    boxSizing: "border-box",
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.15s, box-shadow 0.15s",
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createPlaylist.mutateAsync({ name, description: desc || undefined });
    setCreated(true);
    onSuccess?.();
    setTimeout(onClose, 900);
  };

  return (
    <Modal title="Nova Playlist" onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>NOME</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Minha playlist..." className="sv-input" style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>
            DESCRIÇÃO <span style={{ opacity: 0.5, fontWeight: 400 }}>(opcional)</span>
          </label>
          <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Curta descrição..." className="sv-input" style={inputStyle} />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em" }}>COR</label>
            <CoverArt color={selectedColor} name={name || "Nova"} size={28} />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {PLAYLIST_COLORS.map((c) => (
              <button key={c} onClick={() => setSelectedColor(c)} className="sv-color-swatch" style={{ width: 28, height: 28, borderRadius: "50%", background: c, border: selectedColor === c ? "2px solid #fff" : "2px solid transparent", cursor: "pointer", outline: selectedColor === c ? `2px solid ${c}` : "none", outlineOffset: 2, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, transition: "transform 0.15s" }}>
                {selectedColor === c && <Check size={13} weight="bold" />}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            onClick={handleCreate}
            disabled={!name.trim() || created || createPlaylist.isPending}
            variant={created ? "success" : "primary"}
            accentColor={selectedColor}
            icon={created ? <Check size={14} weight="bold" /> : <Plus size={14} weight="bold" />}
          >
            {created ? "Criado!" : createPlaylist.isPending ? "Criando..." : "Criar Playlist"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
