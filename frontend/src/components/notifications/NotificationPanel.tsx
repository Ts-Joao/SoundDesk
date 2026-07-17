"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  CheckCircle, XCircle, Archive, Lock,
  ShareNetwork, UserCircle, Bell, Check,
} from "@phosphor-icons/react";
import { useNotifications, useMarkAllRead } from "@/hooks/notifications/useNotifications";
import { formatRelative } from "@/lib/utils";
import type { Notification, NotificationType } from "@/types/notifications";

const TYPE_CONFIG: Record<NotificationType, { icon: React.ReactNode; color: string }> = {
  download_completed:  { icon: <CheckCircle  size={16} weight="fill" />, color: "#4ade80" },
  download_failed:     { icon: <XCircle      size={16} weight="fill" />, color: "#f87171" },
  export_completed:    { icon: <Archive      size={16} weight="fill" />, color: "#60a5fa" },
  export_failed:       { icon: <XCircle      size={16} weight="fill" />, color: "#f87171" },
  password_changed:    { icon: <Lock         size={16} weight="fill" />, color: "#fbbf24" },
  playlist_shared:     { icon: <ShareNetwork size={16} weight="fill" />, color: "#a78bfa" },
  account_created:     { icon: <UserCircle   size={16} weight="fill" />, color: "#4ade80" },
  system:              { icon: <Bell         size={16} weight="fill" />, color: "#94a3b8" },
};

// Mock notifications para o painel funcionar sem backend
const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "download_completed", title: "Download concluído", message: "Iron Man - Black Sabbath foi baixado com sucesso.", read: false, createdAt: new Date(Date.now() - 120000).toISOString(), href: "/downloads" },
  { id: "n2", type: "export_completed",   title: "Exportação concluída", message: "Playlist 'Lofi Hip Hop Chill' exportada em ZIP.", read: false, createdAt: new Date(Date.now() - 600000).toISOString(), href: "/exports" },
  { id: "n3", type: "download_failed",    title: "Falha no download", message: "Não foi possível baixar 'Nostalgia Haze'.", read: false, createdAt: new Date(Date.now() - 3600000).toISOString(), href: "/downloads" },
  { id: "n4", type: "playlist_shared",    title: "Playlist compartilhada", message: "Sua playlist 'Synthwave Retrowave' foi compartilhada.", read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "n5", type: "password_changed",   title: "Senha alterada", message: "Sua senha foi alterada com sucesso.", read: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
];

interface NotificationPanelProps {
  onClose: () => void;
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const markAllRead = useMarkAllRead();

  // Fechar ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    setTimeout(() => document.addEventListener("mousedown", handler), 50);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const notifications = MOCK_NOTIFICATIONS;
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      ref={panelRef}
      className="sv-fade-in"
      style={{
        position: "absolute",
        top: "calc(100% + 10px)",
        right: 0,
        width: 360,
        maxHeight: 480,
        background: "#1A1B2E",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 14,
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        zIndex: 200,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Notificações</span>
          {unreadCount > 0 && (
            <span style={{ padding: "1px 6px", borderRadius: 99, background: "rgba(239,68,68,0.2)", color: "#f87171", fontSize: 11, fontWeight: 700 }}>
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllRead.mutate()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: "none",
              border: "none",
              color: "#6C63FF",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              padding: "3px 8px",
              borderRadius: 6,
              fontFamily: "inherit",
            }}
          >
            <Check size={13} weight="bold" />
            Marcar todas como lidas
          </button>
        )}
      </div>

      {/* List */}
      <div style={{ overflowY: "auto", flex: 1 }}>
        {notifications.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center" }}>
            <Bell size={32} weight="duotone" style={{ color: "rgba(255,255,255,0.15)", marginBottom: 10 }} />
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>Nenhuma notificação</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const cfg = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.system;
            const item = (
              <div
                className="sv-row"
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "12px 16px",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  background: notif.read ? "transparent" : "rgba(108,99,255,0.04)",
                  transition: "background 0.15s",
                  cursor: notif.href ? "pointer" : "default",
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: `${cfg.color}15`,
                    border: `1px solid ${cfg.color}25`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: cfg.color,
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  {cfg.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: notif.read ? 500 : 700, color: notif.read ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.9)", lineHeight: 1.3 }}>
                      {notif.title}
                    </span>
                    {!notif.read && (
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6C63FF", flexShrink: 0, marginTop: 4 }} />
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "3px 0 4px", lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any }}>
                    {notif.message}
                  </p>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
                    {formatRelative(notif.createdAt)}
                  </span>
                </div>
              </div>
            );

            return notif.href ? (
              <Link key={notif.id} href={notif.href} onClick={onClose} style={{ display: "block", textDecoration: "none" }}>
                {item}
              </Link>
            ) : (
              <div key={notif.id}>{item}</div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <Link
          href="/notifications"
          onClick={onClose}
          style={{ display: "block", textAlign: "center", fontSize: 13, color: "#6C63FF", fontWeight: 600, textDecoration: "none" }}
        >
          Ver todas as notificações
        </Link>
      </div>
    </div>
  );
}
