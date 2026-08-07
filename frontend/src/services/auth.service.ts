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
  register: (payload: Omit<RegisterPayload, "confirmPassword">): Promise<User> =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        username: payload.name,
        display_name: payload.name,
        email: payload.email,
        password_hash: payload.password,
      }),
    }),

  /** POST /auth/refresh → novos tokens */
  refresh: (refreshToken: string): Promise<AuthTokens> =>
    request("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    }),

  /** POST /auth/logout */
  logout: (): Promise<void> =>
    request("/auth/logout", { method: "POST" }),

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

  /** POST /auth/verify-email */
  verifyEmail: (token: string): Promise<{ message: string }> =>
    request(`/auth/verify-email?token=${encodeURIComponent(token)}`, {
      method: "POST",
      body: JSON.stringify({ token }),
    }),

  /** POST /auth/resend-verification */
  resendVerification: (): Promise<{ message: string }> =>
    request("/auth/resend-verification", { method: "POST" }),
};


// ─── Change Email ───────────────────────────────────────────────────────────
export interface ChangeEmailPayload {
  new_email: string;
  password: string;
}

export const changeEmailService = {
  /** PATCH /auth/change-email */
  changeEmail: (payload: ChangeEmailPayload): Promise<{ message: string }> =>
    request("/auth/change-email", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
};
