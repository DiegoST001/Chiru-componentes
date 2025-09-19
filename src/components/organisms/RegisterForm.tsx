import React from "react";
import { FormField } from "@/components/molecules/FormField";
import { Button } from "@/components/atoms/Button";
import { FormDivider } from "@/components/molecules/FormDivider";
import { SocialLoginButton } from "@/components/molecules/SocialLoginButton";
import { cntl } from "@/utils/cntl";

type RegisterFormProps = {
  className?: string;
  icons?: {
    name?: React.ReactNode;
    phone?: React.ReactNode;
    email?: React.ReactNode;
    password?: React.ReactNode;
  };
};

function getRegisterFormStyles() {
  return cntl`
    w-full max-w-md mx-auto p-8 bg-white rounded-lg border-2 border-red-500 shadow-lg
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

function RegisterForm({ className, icons }: RegisterFormProps) {
  return (
    <div className={cntl`${getRegisterFormStyles()} ${className || ""}`}>
      <div className={getHeaderStyles()}>
        <div className={getLogoStyles()}>Chiru</div>
        <div className={getTitleStyles()}>Register</div>
      </div>

      <form className={getFormStyles()}>
        <FormField
          label="Text-Title"
          type="text"
          placeholder="abc@gmail.com"
          icon={icons?.name}
          fullWidth
          size="medium"
          variant="outline"
        />

        <FormField
          label="Text-Title"
          type="password"
          placeholder="••••••"
          icon={icons?.phone}
          fullWidth
          size="medium"
          variant="outline"
        />

        <FormField
          label="Text-Title"
          type="email"
          placeholder="abc@gmail.com"
          icon={icons?.email}
          fullWidth
          size="medium"
          variant="outline"
        />

        <FormField
          label="Text-Title"
          type="password"
          placeholder="••••••"
          icon={icons?.password}
          fullWidth
          size="medium"
          variant="outline"
        />

        <Button
          type="submit"
          variant="danger"
          size="large"
          fullWidth
          text="Button"
        />
      </form>

      <FormDivider text="text" spacing="medium" />

      <div className={getButtonGroupStyles()}>
        <Button variant="primary" size="large" fullWidth text="Sign in" />

        <SocialLoginButton provider="google" fullWidth size="large" />
      </div>
    </div>
  );
}

export { RegisterForm };