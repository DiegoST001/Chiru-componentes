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

      // En vez de login automático, redirige a verificación
  window.location.assign("/es/docs/dev/ui/templates/auth/verify"); // SPA navigation
      return;
    } catch (err) {
      console.error("[TemplateRegister] error:", err);
      alert(err instanceof Error ? err.message : "Ocurrió un error desconocido.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="w-full h-screen flex max-xl:bg-gray-100">
      {/* Imagen lateral: solo visible en xl o superior */}
      <div className="hidden xl:flex w-1/2 h-full">
        <Image
          src={imageUrl}
          alt={imageAlt}
          size="large"
          radius="none"
          fit="cover"
          className="w-full h-full object-cover"
        />
      </div>
      {/* Formulario: ocupa toda la pantalla en móvil/tablet, la mitad en desktop */}
      <div className="flex items-center justify-center w-full xl:w-1/2 h-full p-8">
        <RegisterForm
          values={values}
          onChange={handleChange}
          onSubmit={handleSubmit}
          className={submitting ? "opacity-70 pointer-events-none" : ""}
          onLogin={() => {
            window.location.assign("/es/docs/dev/ui/templates/auth/login");
          }}
        />
      </div>
    </main>
  );
}
