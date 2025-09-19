import React from "react";
import { SearchBar } from "@/components/molecules/SearchBar";
import { NavIcons } from "@/components/molecules/NavIcons";
import { Text } from "@/components/atoms/Text";
import { cntl } from "@/utils/cntl";

type HeaderProps = {
  className?: string;
};

function getHeaderStyles() {
  return cntl`
    flex items-center justify-between gap-6 px-6 py-4
    bg-white border-b border-gray-200
    shadow-sm h-16
  `;
}

function getLogoStyles() {
  return cntl`
    flex items-center
    min-w-fit
  `;
}

function getSearchSectionStyles() {
  return cntl`
    flex-1 mx-6
  `;
}

function getNavSectionStyles() {
  return cntl`
    flex items-center gap-1
    min-w-fit
  `;
}

function Header({ className }: HeaderProps) {
  return (
    <header className={cntl`${getHeaderStyles()} ${className || ""}`}>
      <div className={getLogoStyles()}>
        <Text size="xl" weight="bold" color="danger">
          Chiru
        </Text>
      </div>

      <div className={getSearchSectionStyles()}>
        <SearchBar
          placeholder="Buscar"
          fullWidth
          size="medium"
          dropdownOptions={["Selecciona"]}
          defaultDropdownValue="Selecciona"
        />
      </div>

      <div className={getNavSectionStyles()}>
        <NavIcons
          items={[
            {
              icon: "magnifying-glass",
              label: "text",
              onClick: () => console.log("Search clicked"),
            },
            {
              icon: "user",
              label: "text",
              onClick: () => console.log("User clicked"),
            },
            {
              icon: "envelope",
              label: "text",
              onClick: () => console.log("Mail clicked"),
            },
            {
              icon: "package",
              label: "text",
              onClick: () => console.log("Package clicked"),
            },
          ]}
          orientation="horizontal"
          showLabels={true}
        />
      </div>
    </header>
  );
}

export { Header };