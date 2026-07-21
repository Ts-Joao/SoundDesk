import type {
  LoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  AuthTokens,
  User,
} from "@/types/auth";
import { request } from "./api";

export const authService = {
  /** POST /auth/login → tokens */
  login: (payload: LoginPayload): Promise<AuthTokens> =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  /** POST /auth/register → user */
  register: (payload: Omit<RegisterPayload, "confirmPassword">): Promise<User> => {
    const username = payload.name.toLowerCase().replace(/[^a-z0-9]/g, "") || "user";
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        username,
        display_name: payload.name,
        email: payload.email,
        password_hash: payload.password,
      }),
    });
  },

  /** POST /auth/refresh → novos tokens */
  refresh: (refreshToken: string): Promise<AuthTokens> =>
    request("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    }),

  /** POST /auth/logout */
  logout: (): Promise<void> =>
    request("/auth/logout", { method: "POST" }),

  /** GET /auth/me → user atual */
  me: (): Promise<User> =>
    request("/auth/me"),

  /** POST /auth/forgot-password */
  forgotPassword: (payload: ForgotPasswordPayload): Promise<{ message: string }> =>
    request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  /** POST /auth/reset-password */
  resetPassword: (payload: Omit<ResetPasswordPayload, "confirmPassword">): Promise<{ message: string }> =>
    request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  /** GET /auth/verify-email */
  verifyEmail: (token: string): Promise<{ message: string }> =>
    request<any>(`/auth/verify-email?token=${encodeURIComponent(token)}`).then(() => ({
      message: "E-mail verificado com sucesso!",
    })),

  /** POST /auth/resend-verification */
  resendVerification: (): Promise<{ message: string }> =>
    request("/auth/resend-verification", { method: "POST" }),
};
