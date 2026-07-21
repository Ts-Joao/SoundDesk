"use client";

import { useState } from "react";
import { Envelope, Lock, SignIn, Eye, EyeSlash } from "@phosphor-icons/react";
import { AuthCard, AuthInput, AuthLink } from "@/components/auth/AuthCard";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { authService } from "@/services/auth.service";

export function LoginForm() {
  const { login } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = "E-mail obrigatório";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "E-mail inválido";
    if (!password) e.password = "Senha obrigatória";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const tokens = await authService.login({ email, password });
      await login(tokens);
    } catch (err: any) {
      toast.error("Falha no login", err.message ?? "Credenciais inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Bem-vindo de volta"
      subtitle="Entre na sua conta para continuar"
      footer={
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
          Não tem conta?{" "}
          <AuthLink href="/register">Criar conta gratuita</AuthLink>
        </p>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <AuthInput
          label="E-MAIL"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="seu@email.com"
          autoComplete="email"
          error={errors.email}
          icon={<Envelope size={15} weight="bold" />}
        />

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.55)", letterSpacing: "0.04em" }}>
              SENHA
            </label>
            <AuthLink href="/forgot-password">Esqueceu a senha?</AuthLink>
          </div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", display: "flex", pointerEvents: "none" }}>
              <Lock size={15} weight="bold" />
            </span>
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="••••••••"
              autoComplete="current-password"
              className="sv-input"
              style={{
                width: "100%",
                padding: "10px 40px 10px 38px",
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${errors.password ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: 9,
                color: "#fff",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <button
              onClick={() => setShowPass(!showPass)}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", display: "flex" }}
            >
              {showPass ? <EyeSlash size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && <p style={{ fontSize: 11, color: "#f87171", margin: "5px 0 0" }}>{errors.password}</p>}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="sv-btn"
          style={{
            width: "100%",
            padding: "11px 20px",
            background: loading ? "rgba(108,99,255,0.15)" : "rgba(108,99,255,0.25)",
            border: "1px solid rgba(108,99,255,0.5)",
            borderRadius: 9,
            color: "#a299ff",
            fontSize: 14,
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginTop: 4,
            opacity: loading ? 0.7 : 1,
          }}
        >
          <SignIn size={16} weight="bold" />
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </div>
    </AuthCard>
  );
}
