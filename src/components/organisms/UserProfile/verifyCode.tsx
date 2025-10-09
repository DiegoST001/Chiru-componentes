
import React, { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { FormDivider } from "@/components/molecules/FormDivider";
import { cntl } from "@/utils/cntl";
import { AuthService } from "@/features/auth/service/auth.service";
import { Icon } from "@/components/atoms/Icon";
import { Envelope, LockKey, User } from "phosphor-react";

function getFormStyles() {
  return cntl`
    max-w-lg w-full mx-auto p-8 bg-white rounded-lg max-xl:shadow-lg space-y-6
  `;
}

export function VerifyCodeForm() {
  const [form, setForm] = useState({
    email: "",
    code: "",
    password: "",
    userName: "",
    gender: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleChange(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const res = await AuthService.verifyCode(
        form.email,
        form.code,
        form.password,
        form.userName,
        form.gender
      );
      setSuccess("Cuenta verificada correctamente. Redirigiendo a inicio de sesión...");
      setTimeout(() => {
  window.location.assign("/es/docs/dev/ui/templates/auth/login");
      }, 1500);
    } catch (err: any) {
      setError(err?.message || "Error al verificar el código");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={getFormStyles()}>
      <div className="text-center mb-8">
        <div className="text-3xl font-bold text-red-500 mb-2">Chiru</div>
        <div className="text-2xl font-semibold text-gray-600 uppercase tracking-wide">Verificar cuenta</div>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <FormField
          label="Email"
          type="email"
          placeholder="abc@gmail.com"
          icon={<Icon variant="default" tamano="medium"><Envelope weight="fill" /></Icon>}
          value={form.email}
          onChange={handleChange("email")}
          fullWidth
          size="medium"
          variant="outline"
        />
        <FormField
          label="Código de verificación"
          type="text"
          placeholder="123456"
          value={form.code}
          onChange={handleChange("code")}
          fullWidth
          size="medium"
          variant="outline"
        />
        <FormField
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          icon={<Icon variant="default" tamano="medium"><LockKey weight="fill" /></Icon>}
          value={form.password}
          onChange={handleChange("password")}
          fullWidth
          size="medium"
          variant="outline"
        />
        <FormField
          label="Nombre de usuario"
          type="text"
          placeholder="Tu nombre"
          icon={<Icon variant="default" tamano="medium"><User weight="fill" /></Icon>}
          value={form.userName}
          onChange={handleChange("userName")}
          fullWidth
          size="medium"
          variant="outline"
        />
        <FormField
          label="Género"
          type="text"
          placeholder="Masculino/Femenino"
          value={form.gender}
          onChange={handleChange("gender")}
          fullWidth
          size="medium"
          variant="outline"
        />
        <Button
          type="submit"
          variant="danger"
          size="large"
          fullWidth
          text={loading ? "Verificando..." : "Verificar cuenta"}
          disabled={loading}
        />
      </form>
      {error && <div className="text-red-500 text-sm mt-2 text-center">{error}</div>}
      {success && <div className="text-green-600 text-sm mt-2 text-center">{success}</div>}
      <FormDivider text="o" spacing="medium" />
      <div className="space-y-4">
        <Button
          variant="primary"
          size="large"
          fullWidth
          text="Ir a iniciar sesión"
          onClick={() => window.location.assign("/es/docs/dev/ui/templates/auth/login")}
        />
      </div>
    </div>
  );
}