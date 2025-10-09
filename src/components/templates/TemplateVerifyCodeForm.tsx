import React from "react";
import { VerifyCodeForm } from "@/components/organisms/UserProfile/verifyCode";

export type TemplateVerifyCodeFormProps = {
  // Puedes agregar props si necesitas pasar datos iniciales
};

export function TemplateVerifyCodeForm(props: TemplateVerifyCodeFormProps) {
  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex items-center justify-center w-full h-full p-8">
        <VerifyCodeForm />
      </div>
    </main>
  );
}
