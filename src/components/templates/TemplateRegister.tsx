import React, { useState } from "react";
import { Image } from "../atoms/Image";
import { RegisterForm } from "../organisms/RegisterForm";
import { AuthService } from "@/features/auth/service/auth.service";

export type TemplateRegisterProps = {
  imageUrl: string;
  imageAlt?: string;
};

export function TemplateRegister({ imageUrl, imageAlt = "Register image" }: TemplateRegisterProps) {
  const [values, setValues] = useState({
    userName: "",
    email: "",
    password: "",
    gender: "",
  });

  function handleChange(field: keyof typeof values, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    console.log("[TemplateRegister] submit payload:", values);
    try {
      const res = await AuthService.signup(values.email, values.password, values.userName, values.gender);
      console.log("[TemplateRegister] respuesta:", res);
      alert("Registro exitoso");
    } catch (err) {
      console.error("[TemplateRegister] error:", err);
      alert(err instanceof Error ? err.message : "Ocurrió un error desconocido.");
    }
  }

  return (
    <div className="min-h-screen w-screen h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full h-full justify-center items-center">
        <div className="flex-1 h-full flex items-center justify-center p-0">
          <Image src={imageUrl} alt={imageAlt} size="large" radius="none" fit="cover" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 h-full flex items-center justify-center">
          <RegisterForm
            values={values}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
