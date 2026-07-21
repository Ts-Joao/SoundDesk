import type { User } from "@/types/auth";
import { request } from "./api";

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const userService = {
  /** GET /users/me */
  me: (): Promise<User> => request("/users/me"),

  /** PATCH /users/me */
  update: (payload: UpdateProfilePayload): Promise<User> =>
    request("/users/me", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  /** POST /users/me/avatar — multipart */
  uploadAvatar: (file: File): Promise<{ avatar: string }> => {
    const form = new FormData();
    form.append("file", file);
    return request("/users/me/avatar", {
      method: "POST",
      body: form,
      headers: {}, // deixa o browser definir Content-Type com boundary
    });
  },

  /** POST /users/me/change-password */
  changePassword: (payload: Omit<ChangePasswordPayload, "confirmPassword">): Promise<{ message: string }> =>
    request("/users/me/change-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  /** DELETE /users/me */
  deleteAccount: (): Promise<void> =>
    request("/users/me", { method: "DELETE" }),
};
