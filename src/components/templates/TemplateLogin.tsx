import React, { useEffect, useState } from "react";
import { Image } from "../atoms/Image";
import { LoginForm } from "../organisms/LoginForm";
import { AuthService } from "@/features/auth/service/auth.service";
import { STORAGE_KEYS } from "@/constants/storage";
import type { LoginRequest } from "@/features/auth/model/auth.model";

export type TemplateLoginProps = {
  imageUrl: string;
  imageAlt?: string;
};

export function TemplateLogin({ imageUrl, imageAlt = "Login image" }: TemplateLoginProps) {
  const [clientIp, setClientIp] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

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
    return () => { mounted = false; };
  }, []);

  async function handleSubmit(data: { email: string; password: string }) {
    if (submitting) return;
    setSubmitting(true);
    try {
      const credentials = {
        emailOrUsername: data.email,
        password: data.password,
      } as unknown as LoginRequest;

      if (import.meta.env.DEV) {
        console.log("[TemplateLogin] payload:", { ...credentials, password: "***" }, "ip:", clientIp || "(none)");
      }

      const res = await AuthService.login(credentials, clientIp);

      const accessToken = (res as any)?.accessToken ?? (res as any)?.token;
      const refreshToken = (res as any)?.refreshToken;
      if (typeof window !== "undefined" && accessToken) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, String(accessToken));
        if (refreshToken && (STORAGE_KEYS as any).REFRESH_TOKEN) {
          localStorage.setItem((STORAGE_KEYS as any).REFRESH_TOKEN, String(refreshToken));
        }
      }

      alert((res as any)?.message || "Inicio de sesión exitoso");
      // opcional: redirección
      window.location.href = "/es";
    } catch (err) {
      console.error("[TemplateLogin] error:", err);
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
        <div className="flex-1 h-full flex items-center justify-center p-8">
          <LoginForm
            onSubmit={handleSubmit}
            className={submitting ? "opacity-70 pointer-events-none" : ""}
          />
        </div>
      </div>
    </div>
  );
}
