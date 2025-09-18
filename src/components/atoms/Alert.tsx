import React from "react";

type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string;
  variant?: "success" | "error" | "warning" | "info";
  size?: "small" | "medium" | "large";
  bordered?: boolean;
  shadow?: boolean;
};

function getAlertStyles(
  variant?: AlertProps["variant"],
  size?: AlertProps["size"],
  bordered?: boolean,
  shadow?: boolean
) {
  const base = "p-4 rounded mb-3";
  const variants: Record<string, string> = {
    success: "bg-green-100 text-green-900 border-green-400",
    error: "bg-red-100 text-red-900 border-red-400",
    warning: "bg-yellow-100 text-yellow-900 border-yellow-400",
    info: "bg-blue-100 text-blue-900 border-blue-400",
  };
  const sizes: Record<string, string> = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };
  return [
    base,
    variants[variant || "info"],
    sizes[size || "medium"],
    bordered ? "border" : "",
    shadow ? "shadow" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function Alert({
  title,
  variant = "info",
  size = "medium",
  bordered = true,
  shadow = true,
  className,
  children,
  ...props
}: AlertProps) {
  const styles = [getAlertStyles(variant, size, bordered, shadow), className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles} {...props}>
      {title && <strong className="block mb-1">{title}</strong>}
      <div>{children}</div>
    </div>
  );
}