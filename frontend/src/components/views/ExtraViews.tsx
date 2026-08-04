"use client";

import Link from "next/link";
import {
  Archive, ShareNetwork, Heart, Bell,
  DownloadSimple, Trash, Check,
} from "@phosphor-icons/react";
import { EmptyState } from "@/components/ui/index";
import { Badge } from "@/components/ui/Badge";
import { useMarkRead, useDeleteNotification } from "@/hooks/notifications/useNotifications";
import { formatRelative } from "@/lib/utils";
import type { Notification, NotificationType } from "@/types/notifications";
import {
  CheckCircle, XCircle, Lock, UserCircle,
} from "@phosphor-icons/react";

// ============================================================
// EXPORTS VIEW
// ============================================================
import { useExportJobs } from "@/hooks/exports/useExportJobs";
import { usePlaylists } from "@/hooks/playlists/usePlaylists";
import { exportsService } from "@/services/export.service";
import { useState } from "react";

// ============================================================
// EXPORTS VIEW
// ============================================================
export function ExportsView() {
  const { data: jobs, isLoading } = useExportJobs();
  const { data: playlists } = usePlaylists();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (id: string, name: string) => {
    setDownloadingId(id);
    try {
      const blob = await exportsService.getZip(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingId(null);
    }
  };

  const getPlaylistName = (playlistId: string) => {
    return playlists?.find(p => p.id === playlistId)?.name ?? "Playlist Removida/Desconhecida";
  };

  if (isLoading) {
    return <div style={{ padding: 24, color: "rgba(255,255,255,0.5)" }}>Carregando exportações...</div>;
  }

  const exportJobs = jobs ?? [];

  return (
    <div style={{ padding: 24 }} className="sv-fade-in">
      {exportJobs.length === 0 ? (
        <EmptyState
          icon={<Archive size={28} weight="duotone" />}
          title="Nenhuma exportação"
          description="Exporte uma playlist para receber um arquivo ZIP com todas as músicas."
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {exportJobs.map((exp) => {
            const pName = getPlaylistName(exp.playlist_id);
            return (
              <div key={exp.id} style={{ background: "#1A1B2E", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                <div style={{ width: 38, height: 38, borderRadius: 9, background: "rgba(96,165,250,0.12)", border: "1px solid rgba(96,165,250,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#60a5fa", flexShrink: 0 }}>
                  <Archive size={18} weight="duotone" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>{pName}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
                    {formatRelative(exp.started_at ?? exp.finished_at ?? new Date().toISOString())}
                  </div>
                </div>
                <Badge status={exp.status.toLowerCase() as any} />
                {exp.status.toLowerCase() === "completed" && (
                  <button
                    onClick={() => handleDownload(exp.id, pName)}
                    disabled={downloadingId === exp.id}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 7, color: "#4ade80", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                  >
                    <DownloadSimple size={13} weight="bold" /> {downloadingId === exp.id ? "Baixando..." : "Baixar ZIP"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================
// SHARED VIEW
// ============================================================
export function SharedView() {
  return (
    <div style={{ padding: 24 }} className="sv-fade-in">
      <EmptyState
        icon={<ShareNetwork size={28} weight="duotone" />}
        title="Nenhuma playlist compartilhada"
        description="Quando alguém compartilhar uma playlist com você, ela aparecerá aqui."
      />
    </div>
  );
}

// ============================================================
// FAVORITES VIEW
// ============================================================
export function FavoritesView() {
  return (
    <div style={{ padding: 24 }} className="sv-fade-in">
      <EmptyState
        icon={<Heart size={28} weight="duotone" />}
        title="Nenhum favorito ainda"
        description="Marque músicas e playlists como favoritas para acessá-las rapidamente."
      />
    </div>
  );
}

// ============================================================
// NOTIFICATIONS VIEW
// ============================================================
const TYPE_CONFIG: Record<NotificationType, { icon: React.ReactNode; color: string }> = {
  download_completed:  { icon: <CheckCircle  size={18} weight="fill" />, color: "#4ade80" },
  download_failed:     { icon: <XCircle      size={18} weight="fill" />, color: "#f87171" },
  export_completed:    { icon: <Archive      size={18} weight="fill" />, color: "#60a5fa" },
  export_failed:       { icon: <XCircle      size={18} weight="fill" />, color: "#f87171" },
  password_changed:    { icon: <Lock         size={18} weight="fill" />, color: "#fbbf24" },
  playlist_shared:     { icon: <ShareNetwork size={18} weight="fill" />, color: "#a78bfa" },
  account_created:     { icon: <UserCircle   size={18} weight="fill" />, color: "#4ade80" },
  system:              { icon: <Bell         size={18} weight="fill" />, color: "#94a3b8" },
};

const MOCK_NOTIFS: Notification[] = [
  { id: "n1", type: "download_completed", title: "Download concluído",  message: "Iron Man - Black Sabbath foi baixado com sucesso.", read: false, createdAt: new Date(Date.now()-120000).toISOString(), href: "/downloads" },
  { id: "n2", type: "export_completed",   title: "Exportação concluída", message: "Playlist 'Lofi Hip Hop Chill' exportada em ZIP.", read: false, createdAt: new Date(Date.now()-600000).toISOString(), href: "/exports" },
  { id: "n3", type: "download_failed",    title: "Falha no download",   message: "Não foi possível baixar 'Nostalgia Haze'.", read: false, createdAt: new Date(Date.now()-3600000).toISOString(), href: "/downloads" },
  { id: "n4", type: "playlist_shared",   title: "Playlist compartilhada", message: "Sua playlist 'Synthwave Retrowave' foi compartilhada.", read: true, createdAt: new Date(Date.now()-86400000).toISOString() },
  { id: "n5", type: "password_changed",  title: "Senha alterada",       message: "Sua senha foi alterada com sucesso.", read: true, createdAt: new Date(Date.now()-172800000).toISOString() },
];

export function NotificationsView() {
  const markRead = useMarkRead();
  const deleteNotif = useDeleteNotification();
  const notifications = MOCK_NOTIFS;

  return (
    <div style={{ padding: 24 }} className="sv-fade-in">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: 0 }}>Notificações</h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", margin: "4px 0 0" }}>
            {notifications.filter((n) => !n.read).length} não lidas
          </p>
        </div>
      </div>

      {notifications.length === 0 ? (
        <EmptyState icon={<Bell size={28} weight="duotone" />} title="Nenhuma notificação" description="Você será notificado sobre downloads, exportações e atualizações." />
      ) : (
        <div style={{ background: "#1A1B2E", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
          {notifications.map((notif) => {
            const cfg = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.system;
            return (
              <div
                key={notif.id}
                className="sv-row"
                style={{
                  display: "flex",
                  gap: 14,
                  padding: "16px 18px",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  background: notif.read ? "transparent" : "rgba(108,99,255,0.04)",
                  transition: "background 0.15s",
                }}
              >
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: `${cfg.color}15`, border: `1px solid ${cfg.color}25`, display: "flex", alignItems: "center", justifyContent: "center", color: cfg.color, flexShrink: 0, marginTop: 2 }}>
                  {cfg.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 14, fontWeight: notif.read ? 500 : 700, color: notif.read ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.9)" }}>
                      {notif.title}
                    </span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", flexShrink: 0, marginTop: 2 }}>
                      {formatRelative(notif.createdAt)}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.5 }}>{notif.message}</p>
                </div>
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  {!notif.read && (
                    <button className="sv-icon-btn" onClick={() => markRead.mutate(notif.id)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", padding: 6, display: "flex" }}>
                      <Check size={14} weight="bold" />
                    </button>
                  )}
                  <button className="sv-icon-btn" onClick={() => deleteNotif.mutate(notif.id)} style={{ background: "none", border: "none", color: "rgba(239,68,68,0.4)", cursor: "pointer", padding: 6, display: "flex" }}>
                    <Trash size={14} weight="bold" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
