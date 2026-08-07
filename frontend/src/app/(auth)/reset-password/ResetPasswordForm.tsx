"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, CheckCircle } from "@phosphor-icons/react";
import { AuthCard, AuthInput, AuthLink } from "@/components/auth/AuthCard";
import { authService } from "@/services/auth.service";
import { useToast } from "@/contexts/ToastContext";

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const toast = useToast();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!password) e.password = "Senha obrigatória";
    else if (password.length < 8) e.password = "Mínimo 8 caracteres";
    if (password !== confirm) e.confirm = "As senhas não coincidem";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await authService.resetPassword({ token, password });
      setDone(true);
      toast.success("Senha redefinida!", "Você já pode entrar com a nova senha.");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      toast.error("Erro", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <AuthCard title="Senha redefinida!" subtitle="Redirecionando para o login..." footer={<AuthLink href="/login">Entrar agora</AuthLink>}>
        <div style={{ textAlign: "center", padding: "12px 0" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#4ade80", margin: "0 auto" }}>
            <CheckCircle size={28} weight="fill" />
          </div>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Nova senha" subtitle="Defina uma senha forte para sua conta" footer={<AuthLink href="/login">← Voltar ao login</AuthLink>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <AuthInput label="NOVA SENHA" type="password" value={password} onChange={setPassword} placeholder="Mínimo 8 caracteres" error={errors.password} icon={<Lock size={15} weight="bold" />} />
        <AuthInput label="CONFIRMAR SENHA" type="password" value={confirm} onChange={setConfirm} placeholder="Repita a senha" error={errors.confirm} icon={<Lock size={15} weight="bold" />} />
        <button onClick={handleSubmit} disabled={loading} className="sv-btn" style={{ width: "100%", padding: "11px 20px", background: "rgba(108,99,255,0.25)", border: "1px solid rgba(108,99,255,0.5)", borderRadius: 9, color: "#a299ff", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.7 : 1 }}>
          <Lock size={16} weight="bold" />
          {loading ? "Salvando..." : "Redefinir senha"}
        </button>
      </div>
    </AuthCard>
  );
}
