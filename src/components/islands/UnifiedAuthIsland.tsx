import React from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthProvider";
import { Header } from "@/components/organisms/Header";
import { TemplateLogin } from "@/components/templates/TemplateLogin";
import { TemplateRegister } from "@/components/templates/TemplateRegister";
import { TemplateVerifyCodeForm } from "@/components/templates/TemplateVerifyCodeForm";

export type UnifiedAuthIslandProps = {
  mode?: "auto" | "login" | "app" | "register" | "verify";
  imageUrl?: string;
  imageAlt?: string;
};

function UnifiedAuthContent({ mode = "auto", imageUrl, imageAlt }: UnifiedAuthIslandProps) {
  const { isAuthenticated } = useAuth();

  const showApp = mode === "app" || (mode === "auto" && Boolean(isAuthenticated));
  const showLogin = mode === "login" || (mode === "auto" && !isAuthenticated);
  const showRegister = mode === "register";
  const showVerify = mode === "verify";

  if (showVerify) return <TemplateVerifyCodeForm />;
  if (showRegister) return <TemplateRegister imageUrl={imageUrl ?? ""} imageAlt={imageAlt} />;
  if (showLogin) return <TemplateLogin imageUrl={imageUrl ?? ""} imageAlt={imageAlt} />;
  if (showApp) return <Header />;

  return null;
}

export function UnifiedAuthIsland(props: UnifiedAuthIslandProps) {
  // AuthProvider aquí dentro para asegurar única instancia y compartir estado en la misma isla
  return (
    <AuthProvider>
      <UnifiedAuthContent {...props} />
    </AuthProvider>
  );
}