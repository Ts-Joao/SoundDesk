import type { Notification } from "@/types/notifications";
import { request } from "./api";

export const notificationService = {
  /** GET /notifications */
  list: (): Promise<Notification[]> => request("/notifications"),

  /** PATCH /notifications/:id/read */
  markRead: (id: string): Promise<void> =>
    request(`/notifications/${id}/read`, { method: "PATCH" }),

  /** PATCH /notifications/read-all */
  markAllRead: (): Promise<void> =>
    request("/notifications/read-all", { method: "PATCH" }),

  /** DELETE /notifications/:id */
  delete: (id: string): Promise<void> =>
    request(`/notifications/${id}`, { method: "DELETE" }),
};
