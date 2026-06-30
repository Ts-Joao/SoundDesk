"use client";

import {
  CheckCircle,
  Spinner,
  Clock,
  XCircle,
} from "@phosphor-icons/react";
import { getStatusConfig } from "@/lib/utils";
import type { TrackStatus } from "@/types";

const STATUS_ICON: Record<string, React.ReactNode> = {
  completed:  <CheckCircle size={12} weight="fill" />,
  processing: <Spinner size={12} weight="bold" style={{ animation: "sv-spin 1s linear infinite" }} />,
  pending:    <Clock size={12} weight="bold" />,
  failed:     <XCircle size={12} weight="fill" />,
};

interface BadgeProps {
  status: TrackStatus | string;
}

export function Badge({ status }: BadgeProps) {
  const cfg = getStatusConfig(status);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 8px",
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.02em",
        color: cfg.color,
        background: cfg.bg,
        whiteSpace: "nowrap",
      }}
    >
      {STATUS_ICON[status]}
      {cfg.label}
    </span>
  );
}
