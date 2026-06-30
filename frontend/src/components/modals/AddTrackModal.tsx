"use client";

import { useState } from "react";
import { Modal } from "@/components/modals/Modal";
import { Button } from "@/components/ui/Button";
import { useAddTracks } from "@/hooks/useApi";

interface AddTrackModalProps {
  playlistName: string;
  playlistId: string;
  onClose: () => void;
  onSuccess?: () => void;
  accentColor?: string;
}

export function AddTrackModal({
  playlistName,
  playlistId,
  onClose,
  onSuccess,
  accentColor = "#6C63FF",
}: AddTrackModalProps) {
  const [urls, setUrls] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [added, setAdded] = useState(false);
  const addTracksMutation = useAddTracks();

  const urlList = urls
    .trim()
    .split("\n")
    .map((u) => u.trim())
    .filter((u) => u.length > 0);

  const urlCount = urlList.length;

  const handleAdd = async () => {
    if (!urlCount) return;
    setIsSubmitting(true);
    try {
      await addTracksMutation.mutateAsync({
        playlistId,
        urls: urlList,
      });
      setAdded(true);
      if (onSuccess) {
        onSuccess();
      }
      setTimeout(onClose, 1200);
    } catch (error) {
      console.error("Failed to add tracks:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title="Adicionar Músicas" onClose={onClose}>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: "0 0 14px" }}>
        Playlist:{" "}
        <strong style={{ color: "rgba(255,255,255,0.75)" }}>{playlistName}</strong>
      </p>

      <label
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "rgba(255,255,255,0.5)",
          letterSpacing: "0.06em",
          display: "block",
          marginBottom: 8,
        }}
      >
        URLs (uma por linha)
      </label>

      <textarea
        value={urls}
        onChange={(e) => setUrls(e.target.value)}
        placeholder={"https://youtube.com/watch?v=...\nhttps://youtu.be/...\nhttps://soundcloud.com/..."}
        disabled={isSubmitting || added}
        className="sv-input sv-textarea"
        style={{
          width: "100%",
          height: 140,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 10,
          padding: "10px 12px",
          color: "#fff",
          fontSize: 13,
          fontFamily: "monospace",
          resize: "none",
          boxSizing: "border-box",
          outline: "none",
          transition: "border-color 0.15s, box-shadow 0.15s",
        }}
      />

      {urlCount > 0 && (
        <p style={{ fontSize: 12, color: accentColor, margin: "6px 0 0", fontWeight: 600 }}>
          {urlCount} URL{urlCount > 1 ? "s" : ""} detectada{urlCount > 1 ? "s" : ""}
        </p>
      )}

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
        <Button onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
        <Button
          onClick={handleAdd}
          disabled={!urlCount || isSubmitting || added}
          variant={added ? "success" : "primary"}
          accentColor={accentColor}
        >
          {added ? "✓ Adicionado!" : isSubmitting ? "Enviando..." : `Adicionar${urlCount > 0 ? ` ${urlCount}` : ""}`}
        </Button>
      </div>
    </Modal>
  );
}
