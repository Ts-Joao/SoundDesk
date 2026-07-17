"use client";

import { useState } from "react";
import { Envelope, PaperPlaneTilt, CheckCircle } from "@phosphor-icons/react";
import { AuthCard, AuthInput, AuthLink } from "@/components/auth/AuthCard";
import { authService } from "@/services/auth.service";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email.trim()) { setError("E-mail obrigatório"); return; }
    setLoading(true);
    try {
      await authService.forgotPassword({ email });
      setSent(true);
    } catch (err: any) {
      setError(err.message ?? "Erro ao enviar e-mail");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthCard title="E-mail enviado!" subtitle="Verifique sua caixa de entrada" footer={<AuthLink href="/login">← Voltar ao login</AuthLink>}>
        <div style={{ textAlign: "center", padding: "12px 0" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#4ade80", margin: "0 auto 16px" }}>
            <CheckCircle size={28} weight="fill" />
          </div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.6 }}>
            Enviamos instruções de recuperação para <strong style={{ color: "rgba(255,255,255,0.8)" }}>{email}</strong>
          </p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Recuperar senha" subtitle="Enviaremos um link para redefinir sua senha" footer={<AuthLink href="/login">← Voltar ao login</AuthLink>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <AuthInput label="E-MAIL" type="email" value={email} onChange={(v) => { setEmail(v); setError(""); }} placeholder="seu@email.com" error={error} icon={<Envelope size={15} weight="bold" />} />
        <button onClick={handleSubmit} disabled={loading} className="sv-btn" style={{ width: "100%", padding: "11px 20px", background: "rgba(108,99,255,0.25)", border: "1px solid rgba(108,99,255,0.5)", borderRadius: 9, color: "#a299ff", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.7 : 1 }}>
          <PaperPlaneTilt size={16} weight="bold" />
          {loading ? "Enviando..." : "Enviar link de recuperação"}
        </button>
      </div>
    </AuthCard>
  );
}
