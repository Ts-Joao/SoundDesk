"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Spinner } from "@phosphor-icons/react";
import { AuthCard, AuthLink } from "@/components/auth/AuthCard";
import { authService } from "@/services/auth.service";

export function VerifyEmailView({ token }: { token: string }) {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) { setStatus("error"); setMessage("Token inválido ou expirado."); return; }
    authService.verifyEmail(token)
      .then((r) => { setStatus("success"); setMessage(r.message); })
      .catch((e) => { setStatus("error"); setMessage(e.message ?? "Erro na verificação."); });
  }, [token]);

  return (
    <AuthCard
      title={status === "loading" ? "Verificando..." : status === "success" ? "E-mail verificado!" : "Falha na verificação"}
      subtitle="Verificação de e-mail do SoundDesk"
      footer={<AuthLink href="/login">← Ir para o login</AuthLink>}
    >
      <div style={{ textAlign: "center", padding: "16px 0" }}>
        {status === "loading" && (
          <div style={{ color: "#6C63FF", display: "flex", justifyContent: "center" }}>
            <Spinner size={44} weight="bold" style={{ animation: "sv-spin 1s linear infinite" }} />
          </div>
        )}
        {status === "success" && (
          <div style={{ color: "#4ade80", display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <CheckCircle size={44} weight="fill" />
          </div>
        )}
        {status === "error" && (
          <div style={{ color: "#f87171", display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <XCircle size={44} weight="fill" />
          </div>
        )}
        {message && <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 10 }}>{message}</p>}
      </div>
    </AuthCard>
  );
}
