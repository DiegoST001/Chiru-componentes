import React, { useState } from "react";
import { Image } from "../atoms/Image";
import { RegisterForm } from "../organisms/RegisterForm";
import { AuthService } from "@/features/auth/service/auth.service";
import { useAuth } from "@/contexts/AuthProvider";

export type TemplateRegisterProps = {
  imageUrl: string;
  imageAlt?: string;
  /**
   * Handler externo opcional. Si se proporciona, se usará en lugar
   * de AuthService.signup. Debe devolver { ok: boolean; error?: any } o lanzar excepción.
   */
  onSubmit?: (payload: { userName: string; email: string; password: string; gender: string }) => Promise<{ ok: boolean; error?: any }>;
  /**
   * URL de redirección por defecto tras registro + login.
   */
  redirectUrl?: string;
  /**
   * Callback opcional que se ejecuta tras registro+login exitoso.
   */
  onSuccess?: (res?: any) => void;
};

export function TemplateRegister({
  imageUrl,
  imageAlt = "Register image",
  onSubmit,
  redirectUrl = "/es/home",
  onSuccess,
}: TemplateRegisterProps) {
  const [values, setValues] = useState({
    userName: "",
    email: "",
    password: "",
    gender: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();

  function handleChange(field: keyof typeof values, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);
    try {
      const payload = { ...values };
      if (import.meta.env.DEV) {
        console.log("[TemplateRegister] payload:", { ...payload, password: "***" });
      }

      const submitFn = onSubmit ?? (async (p: typeof payload) => {
        // AuthService.signup puede lanzar; adaptamos a la misma forma { ok }
        const res = await AuthService.signup(p.email, p.password, p.userName, p.gender);
        // Si el service devuelve un objeto con ok/failed, respétalo, si no, asumimos éxito
        if (res && typeof res === "object" && "ok" in res) return res as { ok: boolean; error?: any };
        return { ok: true };
      });

      const registerResult = await submitFn(payload);

      if (!registerResult.ok) {
        throw registerResult.error ?? new Error("Registro fallido");
      }

      // Intentar login automático con las credenciales recién registradas
      try {
        const loginResult = await login(
          { emailOrUsername: payload.email, password: payload.password } as any
        );
        if (loginResult.ok) {
          if (typeof onSuccess === "function") onSuccess(loginResult);
          else window.location.href = redirectUrl;
          return;
        } else {
          // Registro ok pero login falló: notificar y devolver control
          alert("Registro exitoso, pero no se pudo iniciar sesión automáticamente.");
          if (typeof onSuccess === "function") onSuccess(registerResult);
          return;
        }
      } catch (e) {
        // Si el intento de login lanza, notificamos pero no bloqueamos
        console.warn("[TemplateRegister] login after register failed", e);
        alert("Registro exitoso, pero no se pudo iniciar sesión automáticamente.");
        if (typeof onSuccess === "function") onSuccess(registerResult);
        return;
      }
    } catch (err) {
      console.error("[TemplateRegister] error:", err);
      alert(err instanceof Error ? err.message : "Ocurrió un error desconocido.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-screen h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full h-full justify-center items-center">
        <div className="flex-1 h-full flex items-center justify-center p-0">
          <Image
            src={imageUrl}
            alt={imageAlt}
            size="large"
            radius="none"
            fit="cover"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 h-full flex items-center justify-center">
          <RegisterForm
            values={values}
            onChange={handleChange}
            onSubmit={handleSubmit}
            className={submitting ? "opacity-70 pointer-events-none" : ""}
          />
        </div>
      </div>
    </div>
  );
}
