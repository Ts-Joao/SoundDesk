"use client";

import { Modal } from "@/components/modals/Modal";
import { Button } from "@/components/ui/Button";

interface ConfirmDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
  accentColor?: string;
}

export function ConfirmDialog({
  title,
  message,
  onConfirm,
  onCancel,
  danger = false,
  accentColor = "#6C63FF",
}: ConfirmDialogProps) {
  return (
    <Modal title={title} onClose={onCancel} maxWidth={400}>
      <p
        style={{
          color: "rgba(255,255,255,0.6)",
          fontSize: 14,
          margin: "0 0 20px",
          lineHeight: 1.6,
        }}
      >
        {message}
      </p>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Button onClick={onCancel}>Cancelar</Button>
        <Button
          onClick={onConfirm}
          variant={danger ? "danger" : "primary"}
          accentColor={accentColor}
        >
          {danger ? "Excluir" : "Confirmar"}
        </Button>
      </div>
    </Modal>
  );
}
