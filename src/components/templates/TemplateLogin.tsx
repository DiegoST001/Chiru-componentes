import React, { useEffect, useState } from "react";
import { Image } from "../atoms/Image";
import { LoginForm } from "../organisms/LoginForm";
import { useAuth } from "@/contexts/AuthProvider";
import type { LoginRequest } from "@/features/auth/model/auth.model";

export type TemplateLoginProps = {
  imageUrl: string;
  imageAlt?: string;
  /**
   * Handler externo opcional. Si se proporciona, se usará en lugar
   * de useAuth().login. Debe devolver { ok: boolean; error?: any }.
   */
  onSubmit?: (credentials: LoginRequest, clientIp?: string) => Promise<{ ok: boolean; error?: any }>;
  /**
   * URL de redirección por defecto tras login si no se provee onSuccess.
   */
  redirectUrl?: string;
  /**
   * Callback opcional que se ejecuta tras un login exitoso.
   */
  onSuccess?: (res: any) => void;
};

export function TemplateLogin({
  imageUrl,
  imageAlt = "Login image",
  onSubmit,
  redirectUrl = "/es/home",
  onSuccess,
}: TemplateLoginProps) {
  const [clientIp, setClientIp] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const { login: authLogin } = useAuth();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        if (mounted && data?.ip) setClientIp(String(data.ip));
      } catch {
        // sin IP: el backend puede resolverla o ignorar la cabecera
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit(data: { email: string; password: string }) {
    if (submitting) return;
    setSubmitting(true);
    try {
      const credentials = {
        emailOrUsername: data.email,
        password: data.password,
      } as LoginRequest;

      if (import.meta.env.DEV) {
        console.log(
          "[TemplateLogin] payload:",
          { ...credentials, password: "***" },
          "ip:",
          clientIp || "(none)"
        );
      }

      const submitFn = onSubmit ?? authLogin;
      const result = await submitFn(credentials, clientIp);

      if (result.ok) {
        // Preferir callback de éxito si se proporciona
        if (typeof onSuccess === "function") {
          onSuccess(result);
        } else {
          // Comportamiento por defecto: redirigir
          window.location.assign(redirectUrl);
        }
      } else {
        throw result.error ?? new Error("Login failed");
      }
    } catch (err) {
      console.error("[TemplateLogin] error:", err);
      alert(err instanceof Error ? err.message : "Ocurrió un error desconocido.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
<main className="w-full h-screen flex max-xl:bg-gray-100">
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
  <div className="flex items-center justify-center w-full xl:w-1/2 h-full p-8">
    <LoginForm
      onSubmit={handleSubmit}
      className={submitting ? "opacity-70 pointer-events-none" : ""}
      onSignIn={() => {
  window.location.assign("/es/docs/dev/ui/templates/auth/register");
      }}
      // ...otros props
    />
  </div>
</main>
  );
}
