// ============================================================
// NOTIFICATION TYPES
// ============================================================

export type NotificationType =
  | "download_completed"
  | "download_failed"
  | "export_completed"
  | "export_failed"
  | "password_changed"
  | "playlist_shared"
  | "account_created"
  | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  href?: string;
  meta?: Record<string, string>;
}
