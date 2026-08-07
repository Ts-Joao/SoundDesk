"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService, type UpdateProfilePayload, type ChangePasswordPayload } from "@/services/user.service";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

export function useUpdateProfile() {
  const { updateUser } = useAuth();
  const toast = useToast();
  return useMutation({
    mutationFn: (data: UpdateProfilePayload) => userService.update(data),
    onSuccess: (user) => {
      updateUser(user);
      toast.success("Perfil atualizado!");
    },
    onError: (err: Error) => toast.error("Erro ao atualizar perfil", err.message),
  });
}

export function useUploadAvatar() {
  const { updateUser } = useAuth();
  const toast = useToast();
  return useMutation({
    mutationFn: (file: File) => userService.uploadAvatar(file),
    onSuccess: async () => {
      const user = await userService.me();
      updateUser(user);
      toast.success("Avatar atualizado!");
    },
    onError: (err: Error) => toast.error("Erro ao enviar avatar", err.message),
  });
}

export function useChangePassword() {
  const toast = useToast();
  return useMutation({
    mutationFn: (data: Omit<ChangePasswordPayload, "confirmPassword">) =>
      userService.changePassword(data),
    onSuccess: () => toast.success("Senha alterada com sucesso!"),
    onError: (err: Error) => toast.error("Erro ao alterar senha", err.message),
  });
}

export function useDeleteAccount() {
  const { logout } = useAuth();
  const toast = useToast();
  return useMutation({
    mutationFn: userService.deleteAccount,
    onSuccess: async () => {
      toast.success("Conta excluída");
      await logout();
    },
    onError: (err: Error) => toast.error("Erro ao excluir conta", err.message),
  });
}
