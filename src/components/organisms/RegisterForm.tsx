import React from "react";
import { FormField } from "@/components/molecules/FormField";
import { Button } from "@/components/atoms/Button";
import { FormDivider } from "@/components/molecules/FormDivider";
import { SocialLoginButton } from "@/components/molecules/SocialLoginButton";
import { cntl } from "@/utils/cntl";
import { Icon } from "../atoms/Icon";
import { Envelope, LockKey, User } from "phosphor-react";

type RegisterFormProps = {
  onLogin?: () => void;
  className?: string;
  // icons?: {
  //   name?: React.ReactNode;
  //   email?: React.ReactNode;
  //   password?: React.ReactNode;
  //   gender?: React.ReactNode;
  // };
  values: {
    userName: string;
    email: string;
    password: string;
    gender: string;
  };
  onChange: (field: keyof RegisterFormProps["values"], value: string) => void;
  onSubmit?: () => void;
};

function getRegisterFormStyles() {
  return cntl`
    max-w-lg w-full mx-auto p-8 bg-white rounded-lg  max-xl:shadow-lg
  `;
}

function getFormStyles() {
  return cntl`
    space-y-6
  `;
}

function getHeaderStyles() {
  return cntl`
    text-center mb-8
  `;
}

function getLogoStyles() {
  return cntl`
    text-3xl font-bold text-red-500 mb-2
  `;
}

function getTitleStyles() {
  return cntl`
    text-2xl font-semibold text-gray-400 uppercase tracking-wide
  `;
}

function getButtonGroupStyles() {
  return cntl`
    space-y-4
  `;
}

export function RegisterForm({
  className,
  values,
  onChange,
  onSubmit,
  onLogin,
  }: RegisterFormProps) {
  function handleChange(field: keyof RegisterFormProps["values"]) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      onChange(field, e.target.value);
    };
  }

  function handleSubmit(e: React.FormEvent) {
    console.log(values);
    e.preventDefault();
    onSubmit?.();
  }

  return (
    <div className={cntl`${getRegisterFormStyles()} ${className || ""}`}>
      <div className={getHeaderStyles()}>
        <div className={getLogoStyles()}>Chiru</div>
        <div className={getTitleStyles()}>Crear cuenta</div>
      </div>

      <form className={getFormStyles()} onSubmit={handleSubmit}>
        <FormField
          label="Nombre"
          type="text"
          placeholder="Tu nombre"
          icon={
            <Icon variant="default" tamano="medium">
              <User weight="fill" />
            </Icon>
          }
          value={values.userName}
          onChange={handleChange("userName")}
          fullWidth
          size="medium"
          variant="outline"
        />
        {/* icon={icons?.email} */}
        <FormField
          label="Email"
          type="email"
          placeholder="abc@gmail.com"
          icon={
            <Icon variant="default" tamano="medium">
              <Envelope weight="fill" />
            </Icon>
          }
          value={values.email}
          onChange={handleChange("email")}
          fullWidth
          size="medium"
          variant="outline"
        />

        <FormField
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          icon={
            <Icon variant="default" tamano="medium">
              <LockKey weight="fill" />
            </Icon>
          }
          value={values.password}
          onChange={handleChange("password")}
          fullWidth
          size="medium"
          variant="outline"
        />

        <FormField
          label="Género"
          type="text"
          placeholder="Masculino/Femenino"
          value={values.gender}
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
          text="Registrar"
        />
      </form>

      <FormDivider text="o" spacing="medium" />

      <div className={getButtonGroupStyles()}>
        <Button
          variant="primary"
          size="large"
          fullWidth
          text="Iniciar sesión"
          onClick={onLogin}
        />
        <SocialLoginButton provider="google" fullWidth size="large" />
      </div>
    </div>
  );
}
