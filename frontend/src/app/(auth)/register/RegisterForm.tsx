"use client";

import { useState } from "react";
import { User, Envelope, Lock, UserPlus } from "@phosphor-icons/react";
import { AuthCard, AuthInput, AuthLink } from "@/components/auth/AuthCard";
import { useToast } from "@/contexts/ToastContext";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();
  const toast = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Nome obrigatório";
    if (!email.trim()) e.email = "E-mail obrigatório";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "E-mail inválido";
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
      await authService.register({ name, email, password });
      toast.success("Conta criada!", "Verifique o seu e-mail para ativar a sua conta antes de entrar.");
      setName("");
      setEmail("");
      setPassword("");
      setConfirm("");
      router.push("/login");
    } catch (err: any) {
      toast.error("Erro ao criar conta", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Criar conta"
      subtitle="Comece a gerenciar sua biblioteca musical"
      footer={
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
          Já tem conta? <AuthLink href="/login">Entrar</AuthLink>
        </p>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <AuthInput label="SEU NOME" value={name} onChange={setName} placeholder="João Silva" autoComplete="name" error={errors.name} icon={<User size={15} weight="bold" />} />
        <AuthInput label="E-MAIL" type="email" value={email} onChange={setEmail} placeholder="seu@email.com" autoComplete="email" error={errors.email} icon={<Envelope size={15} weight="bold" />} />
        <AuthInput label="SENHA" type="password" value={password} onChange={setPassword} placeholder="Mínimo 8 caracteres" autoComplete="new-password" error={errors.password} icon={<Lock size={15} weight="bold" />} />
        <AuthInput label="CONFIRMAR SENHA" type="password" value={confirm} onChange={setConfirm} placeholder="Repita a senha" autoComplete="new-password" error={errors.confirm} icon={<Lock size={15} weight="bold" />} />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="sv-btn"
          style={{ width: "100%", padding: "11px 20px", background: "rgba(108,99,255,0.25)", border: "1px solid rgba(108,99,255,0.5)", borderRadius: 9, color: "#a299ff", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4, opacity: loading ? 0.7 : 1 }}
        >
          <UserPlus size={16} weight="bold" />
          {loading ? "Criando conta..." : "Criar conta"}
        </button>
      </div>
    </AuthCard>
  );
}
