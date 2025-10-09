import React, { useState } from "react";
import { FormField } from "@/components/molecules/FormField";
import { Button } from "@/components/atoms/Button";
import { FormDivider } from "@/components/molecules/FormDivider";
import { SocialLoginButton } from "@/components/molecules/SocialLoginButton";
import { Icon } from "@/components/atoms/Icon";
import { Text } from "@/components/atoms/Text";
import { Link } from "@/components/atoms/Link";
import { Envelope, Lock } from "phosphor-react";
import { cntl } from "@/utils/cntl";

type LoginFormProps = {
  onSubmit?: (data: LoginFormData) => void;
  onGoogleLogin?: () => void;
  onSignIn?: () => void;
  onForgotPassword?: () => void;
  className?: string;
};

import { AuthService } from "@/features/auth/service/auth.service";

type LoginFormData = {
  email: string;
  password: string;
};

function getLoginFormStyles() {
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

function getForgotPasswordStyles() {
  return cntl`
    text-right text-sm
  `;
}

function getButtonGroupStyles() {
  return cntl`
    space-y-4
  `;
}

function LoginForm({
  onSubmit,
  onGoogleLogin,
  onSignIn,
  onForgotPassword,
  className,
}: LoginFormProps) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [loading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const handleInputChange = (field: keyof LoginFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit?.(formData);
    }
  };


  return (
    <div className={cntl`${getLoginFormStyles()} ${className || ""}`}>
      <div className={getHeaderStyles()}>
        <div className={getLogoStyles()}>Chiru</div>
        <div className={getTitleStyles()}>Login</div>
      </div>

      <form onSubmit={handleSubmit} className={getFormStyles()}>
        <FormField
          label="Email:"
          type="email"
          placeholder="abc@gmail.com"
          value={formData.email}
          onChange={handleInputChange("email")}
          icon={
            <Icon variant="default" tamano="medium">
              <Envelope />
            </Icon>
          }
          error={errors.email}
          fullWidth
          size="medium"
          variant="outline"
        />

        <div className="space-y-2">
          <FormField
            label="Contraseña:"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleInputChange("password")}
            icon={
              <Icon variant="default" tamano="medium">
                <Lock />
              </Icon>
            }
            error={errors.password}
            fullWidth
            size="medium"
            variant="outline"
          />
          <div className={getForgotPasswordStyles()}>
            <Link 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                onForgotPassword?.();
              }}
              size="small"
              color="primary"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="danger"
          size="large"
          fullWidth
          text={loading ? "Ingresando..." : "Ingresar"}
          disabled={loading}
        />
      </form>


      <FormDivider text="o" spacing="medium" />

      <div className={getButtonGroupStyles()}>
        <Button
          variant="primary"
          size="large"
          fullWidth
          text="Registrarse"
          onClick={onSignIn}
        />
        <SocialLoginButton
          provider="google"
          onClick={onGoogleLogin}
          fullWidth
          size="large"
        />
      </div>
    </div>
  );
}

export { LoginForm };

