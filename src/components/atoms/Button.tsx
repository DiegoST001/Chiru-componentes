import React from "react";
import { cntl } from "@/utils/cntl";

interface ButtonProps {
  /**
   * The button content
   */
  children: React.ReactNode;
  /**
   * What background color to use
   */
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  /**
   * How large should the button be?
   */
  size?: "small" | "medium" | "large";
  /**
   * Is the button disabled?
   */
  disabled?: boolean;
  /**
   * Is the button in a loading state?
   */
  loading?: boolean;
  /**
   * Button type
   */
  type?: "button" | "submit" | "reset";
  /**
   * Optional click handler
   */
  onClick?: () => void;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Full width button
   */
  fullWidth?: boolean;
}

const getButtonStyles = (
  variant: ButtonProps["variant"],
  size: ButtonProps["size"],
  fullWidth?: boolean,
  disabled?: boolean,
  loading?: boolean,
) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    primary: cntl`bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-700`,
    secondary: cntl`bg-gray-600 text-white hover:bg-gray-700 focus-visible:ring-gray-500`,
    outline: cntl`border border-gray-300 bg-transparent text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-500`,
    ghost: cntl`text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-500`,
    danger: cntl`bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500`,
  };

  const sizes = {
    small: "h-8 px-3 text-sm",
    medium: "h-10 px-4 text-base",
    large: "h-12 px-6 text-lg",
  };

  return cntl`
    ${baseStyles}
    ${variants[variant || "primary"]}
    ${sizes[size || "medium"]}
    ${fullWidth ? "w-full" : ""}
    ${disabled || loading ? "cursor-not-allowed" : "cursor-pointer"}
  `;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  type = "button",
  onClick,
  className = "",
  fullWidth = false,
  ...props
}) => {
  const buttonStyles = getButtonStyles(
    variant,
    size,
    fullWidth,
    disabled,
    loading,
  );

  return (
    <button
      type={type}
      className={cntl`${buttonStyles} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
