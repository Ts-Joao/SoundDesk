"use client";

import { useState } from "react";
import { Modal } from "@/components/modals/Modal";
import { Button } from "@/components/ui/Button";
import { CoverArt } from "@/components/ui/CoverArt";
import { PLAYLIST_COLORS } from "@/lib/utils";
import { useCreatePlaylist } from "@/hooks/useApi";

interface CreatePlaylistModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  accentColor?: string;
}

export function CreatePlaylistModal({ onClose, onSuccess, accentColor = "#6C63FF" }: CreatePlaylistModalProps) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [created, setCreated] = useState(false);
  const [selectedColor, setSelectedColor] = useState(accentColor);
  const createMutation = useCreatePlaylist();

  const handleCreate = async () => {
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync({
        name: name.trim(),
        description: desc.trim() || undefined,
      } as any);
      setCreated(true);
      if (onSuccess) {
        onSuccess();
      }
      setTimeout(onClose, 1000);
    } catch (error) {
      console.error("Failed to create playlist:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
    transition: "border-color 0.15s, box-shadow 0.15s",
  };

  return (
    <Modal title="Nova Playlist" onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.06em",
              display: "block",
              marginBottom: 6,
            }}
          >
            NOME
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Minha playlist incrível..."
            disabled={isSubmitting || created}
            className="sv-input"
            style={inputStyle}
          />
        </div>

        <div>
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.06em",
              display: "block",
              marginBottom: 6,
            }}
          >
            DESCRIÇÃO{" "}
            <span style={{ opacity: 0.5, fontWeight: 400 }}>(opcional)</span>
          </label>
          <input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Curta descrição..."
            disabled={isSubmitting || created}
            className="sv-input"
            style={inputStyle}
          />
        </div>

        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(255,255,255,0.5)",
                letterSpacing: "0.06em",
              }}
            >
              COR (PREVIA)
            </label>
            <CoverArt color={selectedColor} name={name || "Nova Playlist"} size={28} />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {PLAYLIST_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedColor(c)}
                disabled={isSubmitting || created}
                className="sv-color-swatch"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: c,
                  border: selectedColor === c ? "2px solid #fff" : "2px solid transparent",
                  cursor: "pointer",
                  outline: selectedColor === c ? `2px solid ${c}` : "none",
                  outlineOffset: 2,
                  boxSizing: "border-box",
                  transition: "transform 0.15s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 13,
                }}
              >
                {selectedColor === c && "✓"}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
          <Button onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
          <Button
            onClick={handleCreate}
            disabled={!name.trim() || isSubmitting || created}
            variant={created ? "success" : "primary"}
            accentColor={selectedColor}
          >
            {created ? "✓ Criado!" : isSubmitting ? "Criando..." : "Criar Playlist"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
