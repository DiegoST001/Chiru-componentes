import React from "react";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { cntl } from "@/utils/cntl";
import { User, At, Lock, Phone } from "phosphor-react";
import { CategoryDropdown } from "./CategoryDropdown";
import { SearchBar } from "./SearchBar";
import { SocialLoginButton } from "./SocialLoginButton";

type FormFieldProps = {
  label: string;
  type?: "text" | "email" | "password" | "number" | "date";
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode | string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  size?: "small" | "medium" | "large";
  variant?: "default" | "outline";
};

function getFormFieldStyles() {
  return cntl`
    flex flex-col gap-2
  `;
}

function getIconElement(icon: React.ReactNode | string, size: number = 20): React.ReactNode {
  if (typeof icon === 'string') {
    switch (icon) {
      case 'user':
        return <User size={size} />;
      case 'at':
        return <At size={size} />;
      case 'lock':
        return <Lock size={size} />;
      case 'phone':
        return <Phone size={size} />;
      default:
        return null;
    }
  }
  return icon;
}

function FormField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  error,
  disabled,
  required,
  fullWidth = true,
  size = "medium",
  variant = "outline",
}: FormFieldProps) {
  const iconSize = size === "small" ? 16 : size === "large" ? 24 : 20;
  const iconElement = icon ? getIconElement(icon, iconSize) : undefined;
  
  return (
    <div className={getFormFieldStyles()}>
      <Label 
        text={label} 
        size={size === "small" ? "small" : size === "large" ? "large" : "medium"}
        fontWeight="medium"
        variant={error ? "error" : "normal"}
      />
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        icon={iconElement}
        disabled={disabled}
        required={required}
        fullWidth={fullWidth}
        size={size}
        variant={variant}
      />
      {error && (
        <Label 
          text={error} 
          size="small"
          variant="error"
        />
      )}
    </div>
  );
}

export { FormField };


