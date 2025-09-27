import React from "react";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { Lock } from "phosphor-react";

type ChangePasswordSectionProps = {
  formData: { currentPassword: string; newPassword: string; confirmPassword: string; };
  isLoading: boolean;
  onInputChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
};

export function ChangePasswordSection({ formData, isLoading, onInputChange, onSubmit }: ChangePasswordSectionProps) {
  return (
    <>
      <div className="flex items-center gap-3 mb-8">
        <Lock size={24} className="text-gray-600" />
        <h1 className="text-2xl font-bold text-gray-900">Cambiar Contraseña</h1>
      </div>
      <div className="space-y-6">
        <FormField label="Contraseña Actual *" type="password" placeholder="Ingresa tu contraseña actual" value={formData.currentPassword} onChange={onInputChange("currentPassword")} required icon="lock"/>
        <FormField label="Nueva Contraseña *" type="password" placeholder="Ingresa tu nueva contraseña" value={formData.newPassword} onChange={onInputChange("newPassword")} required icon="lock"/>
        <FormField label="Confirmar Nueva Contraseña *" type="password" placeholder="Confirma tu nueva contraseña" value={formData.confirmPassword} onChange={onInputChange("confirmPassword")} required icon="lock"/>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Button variant="primary" size="medium" text={isLoading ? "Guardando..." : "Guardar Cambios"} onClick={onSubmit} disabled={isLoading} className="bg-red-600 hover:bg-red-700"/>
      </div>
    </>
  );
}