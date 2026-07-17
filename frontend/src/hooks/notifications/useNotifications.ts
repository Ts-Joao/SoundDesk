"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services/notification.service";

const QK = {
  notifications: ["notifications"] as const,
};

export function useNotifications() {
  return useQuery({
    queryKey: QK.notifications,
    queryFn: notificationService.list,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationService.markAllRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.notifications }),
  });
}

export function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationService.markRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.notifications }),
  });
}

export function useDeleteNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationService.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.notifications }),
  });
}
