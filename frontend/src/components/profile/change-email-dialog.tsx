"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Envelope, Lock, Spinner, Check } from "@phosphor-icons/react";

import { Modal } from "@/components/modals/Modal";
import { Button } from "@/components/ui/Button";
import { changeEmailService } from "@/services/auth.service";

// ─── Schema de validação ────────────────────────────────────────────────────

const schema = z.object({
  new_email: z
    .string()
    .min(1, "E-mail obrigatório")
    .email("Digite um e-mail válido"),
  password: z
    .string()
    .min(1, "Senha obrigatória"),
});

type FormData = z.infer<typeof schema>;

// ─── Props ──────────────────────────────────────────────────────────────────

interface ChangeEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentEmail: string;
}

// ─── Componente ─────────────────────────────────────────────────────────────

export function ChangeEmailDialog({
  open,
  onOpenChange,
  currentEmail,
}: ChangeEmailDialogProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { new_email: "", password: "" },
  });

  if (!open && !showSuccess) return null;

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onOpenChange(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      await changeEmailService.changeEmail({
        new_email: data.new_email,
        password: data.password,
      });

      onOpenChange(false);
      reset();
      setShowSuccess(true);
    } catch (err: any) {
      let message = "Não foi possível alterar o e-mail.";
      try {
        const parsed = JSON.parse(err.message);
        message = parsed?.detail ?? parsed?.message ?? message;
      } catch {
        message = err.message ?? message;
      }
      toast.error("Erro ao alterar e-mail", { description: message });
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "9px 12px 9px 34px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    color: "#fff",
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  return (
    <>
      {/* Modal Formulário */}
      {open && (
        <Modal title="Alterar e-mail" onClose={handleClose} maxWidth={440}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "0 0 16px", lineHeight: 1.5 }}>
            Informe o novo endereço e sua senha atual para confirmar. Um link de verificação será enviado para o novo e-mail.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* E-mail atual */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>
                E-MAIL ATUAL
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, color: "rgba(255,255,255,0.35)", fontSize: 14, userSelect: "none" }}>
                <Envelope size={14} style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentEmail}</span>
              </div>
            </div>

            {/* Novo E-mail */}
            <div>
              <label htmlFor="new_email" style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>
                NOVO E-MAIL
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", display: "flex" }}>
                  <Envelope size={14} />
                </span>
                <input
                  id="new_email"
                  type="email"
                  placeholder="novo@email.com"
                  autoComplete="email"
                  disabled={isSubmitting}
                  className="sv-input"
                  style={inputStyle}
                  {...register("new_email")}
                />
              </div>
              {errors.new_email && (
                <p style={{ fontSize: 12, color: "#f87171", marginTop: 4 }}>{errors.new_email.message}</p>
              )}
            </div>

            {/* Senha Atual */}
            <div>
              <label htmlFor="password" style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em", display: "block", marginBottom: 6 }}>
                SENHA ATUAL
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", display: "flex" }}>
                  <Lock size={14} />
                </span>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  className="sv-input"
                  style={inputStyle}
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p style={{ fontSize: 12, color: "#f87171", marginTop: 4 }}>{errors.password.message}</p>
              )}
            </div>

            {/* Botões */}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
              <Button type="button" onClick={handleClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" accentColor="#6C63FF" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner size={14} className="sv-spin" />
                    Enviando...
                  </>
                ) : (
                  "Continuar"
                )}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Sucesso */}
      {showSuccess && (
        <Modal title="Tudo certo!" onClose={() => setShowSuccess(false)} maxWidth={400}>
          <div style={{ display: "flex", gap: 14, marginBottom: 18 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981", flexShrink: 0 }}>
              <Envelope size={22} weight="duotone" />
            </div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, margin: 0, lineHeight: 1.6 }}>
              Enviamos um e-mail de confirmação para o novo endereço informado. A alteração somente será concluída após você clicar no link enviado.
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="primary" accentColor="#10b981" onClick={() => setShowSuccess(false)}>
              Entendi
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
