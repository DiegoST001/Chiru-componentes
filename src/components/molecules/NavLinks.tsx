import React from "react";
import { Text } from "@/components/atoms/Text";
import { cntl } from "@/utils/cntl";

export type NavLinkProps = {
  text: string;
  color?: "red" | "black";
  hasDropdown?: boolean;
  dropdownOptions?: string[] | { value: string; label: string }[];
  onClick?: () => void;
  onChange?: (value: string) => void;
};

export type NavLinksProps = {
  links?: NavLinkProps[];
  className?: string;
};

function getNavLinksStyles() {
  return cntl`
    flex items-center gap-6
  `;
}

function getNavLinkStyles(color: NavLinkProps["color"]) {
  const colors = {
    red: "text-red-500",
    black: "text-black",
  };

  return cntl`
    flex items-center gap-1 cursor-pointer transition-colors hover:opacity-80
    ${colors[color || "black"]}
  `;
}

function getSelectStyles(color: NavLinkProps["color"]) {
  const colors = {
    red: "text-red-500",
    black: "text-black",
  };

  return cntl`
    appearance-none bg-transparent border-none outline-none
    text-sm font-medium cursor-pointer
    pr-4
    ${colors[color || "black"]}
  `;
}

function NavLink({ text, color = "black", hasDropdown = false, dropdownOptions = [], onClick, onChange }: NavLinkProps) {
  if (hasDropdown) {
    const processedOptions = dropdownOptions.length > 0 ? dropdownOptions.map((option) => {
      if (typeof option === "string") {
        return { value: option, label: option };
      }
      return option;
    }) : [{ value: text, label: text }];

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e.target.value);
    };

    return (
      <div className={getNavLinkStyles(color)}>
        <select
          onChange={handleChange}
          className={getSelectStyles(color)}
          defaultValue={text}
        >
          {processedOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className={getNavLinkStyles(color)} onClick={onClick}>
      <Text size="sm" weight="medium" color={color === "red" ? "danger" : "default"}>
        {text}
      </Text>
    </div>
  );
}

function NavLinks({ links = [], className }: NavLinksProps) {
  const defaultLinks: NavLinkProps[] = [
    { text: "text", color: "red" },
    { text: "text", color: "black" },
    { text: "text", color: "black" },
  ];

  const navLinks = links.length > 0 ? links : defaultLinks;

  return (
    <div className={cntl`${getNavLinksStyles()} ${className || ""}`}>
      {navLinks.map((link, index) => (
        <NavLink
          key={index}
          text={link.text}
          color={link.color}
          hasDropdown={link.hasDropdown}
          dropdownOptions={link.dropdownOptions}
          onClick={link.onClick}
          onChange={link.onChange}
        />
      ))}
    </div>
  );
}

export { NavLinks };