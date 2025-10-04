import React, { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { Lock } from "phosphor-react";
import { useAuth } from "@/contexts/AuthProvider";

/**
 * Autonomo: no recibe props. Consume useAuth() y llama al servicio interno (placeholder).
 */
export function ChangePasswordSection() {
  const { user } = useAuth?.() ?? { user: undefined };
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const onInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((p) => ({ ...p, [field]: e.target.value }));
  };

  const fakeChangePasswordApi = async (payload: { userId?: number; currentPassword: string; newPassword: string; }) => {
    // Reemplazar por llamada real a API/servicio
    return new Promise<void>((resolve) => setTimeout(resolve, 800));
  };

  const handleSubmit = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    setIsLoading(true);
    try {
      await fakeChangePasswordApi({
        userId: (user as any)?.userId ?? (user as any)?.id,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      alert("Contraseña actualizada");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (e) {
      console.error("change password error", e);
      alert("Error al cambiar la contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-8">
        <Lock size={24} className="text-gray-600" />
        <h1 className="text-2xl font-bold text-gray-900">Cambiar Contraseña</h1>
      </div>

      <div className="space-y-6">
        <FormField
          label="Contraseña Actual *"
          type="password"
          placeholder="Ingresa tu contraseña actual"
          value={formData.currentPassword}
          onChange={onInputChange("currentPassword")}
          required
          icon="lock"
        />
        <FormField
          label="Nueva Contraseña *"
          type="password"
          placeholder="Ingresa tu nueva contraseña"
          value={formData.newPassword}
          onChange={onInputChange("newPassword")}
          required
          icon="lock"
        />
        <FormField
          label="Confirmar Nueva Contraseña *"
          type="password"
          placeholder="Confirma tu nueva contraseña"
          value={formData.confirmPassword}
          onChange={onInputChange("confirmPassword")}
          required
          icon="lock"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Button
          variant="primary"
          size="medium"
          text={isLoading ? "Guardando..." : "Guardar Cambios"}
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-red-600 hover:bg-red-700"
        />
      </div>
    </>
  );
}