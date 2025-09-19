import React from "react";
import { Text } from "@/components/atoms/Text";
import { cntl } from "@/utils/cntl";

type RightNavLinkProps = {
  text: string;
  hasDropdown?: boolean;
  dropdownOptions?: string[] | { value: string; label: string }[];
  onClick?: () => void;
  onChange?: (value: string) => void;
};

type RightNavLinksProps = {
  links?: RightNavLinkProps[];
  className?: string;
};

function getRightNavLinksStyles() {
  return cntl`
    flex items-center gap-6
  `;
}

function getRightNavLinkStyles() {
  return cntl`
    flex items-center gap-1 cursor-pointer transition-colors hover:opacity-80
    text-black
  `;
}

function getSelectStyles() {
  return cntl`
    appearance-none bg-transparent border-none outline-none
    text-sm font-medium cursor-pointer text-black
    pr-4
  `;
}

function RightNavLink({ text, hasDropdown = false, dropdownOptions = [], onClick, onChange }: RightNavLinkProps) {
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
      <div className={getRightNavLinkStyles()}>
        <select
          onChange={handleChange}
          className={getSelectStyles()}
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
    <div className={getRightNavLinkStyles()} onClick={onClick}>
      <Text size="sm" weight="medium">
        {text}
      </Text>
    </div>
  );
}

function RightNavLinks({ links = [], className }: RightNavLinksProps) {
  const defaultLinks: RightNavLinkProps[] = [
    { text: "text" },
    { text: "text" },
    { 
      text: "text", 
      hasDropdown: true,
      dropdownOptions: ["text", "option1", "option2"]
    },
  ];

  const navLinks = links.length > 0 ? links : defaultLinks;

  return (
    <div className={cntl`${getRightNavLinksStyles()} ${className || ""}`}>
      {navLinks.map((link, index) => (
        <RightNavLink
          key={index}
          text={link.text}
          hasDropdown={link.hasDropdown}
          dropdownOptions={link.dropdownOptions}
          onClick={link.onClick}
          onChange={link.onChange}
        />
      ))}
    </div>
  );
}

export { RightNavLinks };