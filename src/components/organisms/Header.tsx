import React from "react";
import { SearchBar } from "@/components/molecules/SearchBar";
import { NavIcons } from "@/components/molecules/NavIcons";
import { Text } from "@/components/atoms/Text";
import { cntl } from "@/utils/cntl";
import { Image } from "../atoms/Image";
import { List } from "phosphor-react";

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
    <header
      className={cntl`
        bg-white border-b border-gray-200 shadow-sm w-full
        flex flex-col md:flex-row items-center md:justify-between gap-0
        px-4 py-3 md:px-6 md:py-4
        ${className || ""}
      `}
    >
      {/* Top row: menú, logo, iconos */}
      <div className="w-full flex items-center justify-between md:w-auto md:flex-row md:items-center">
        {/* Menú sandwich (solo móvil) */}
        <a
          className="h-10 w-10 rounded-full order-1 md:order-none md:hidden p-1 bg-gray-200 flex items-center justify-center"
          href="/"
        >
          <List size={20} className="text-gray-600" />
        </a>
        {/* Logo centrado en mobile, alineado en desktop */}
        <a className="flex-1 flex justify-center md:justify-start min-w-fit order-2 md:order-none" href="/es/docs/dev/ui/templates/Home">
          <Image
            src="/chiru_logo_full.svg"
            alt="Chiru Logo"
            fit="contain"
            className="h-10 lg:h-12 w-auto"
          />
        </a>
        {/* Nav icons a la derecha */}
        <div className="flex items-center gap-1 min-w-fit order-3 md:order-none">
          <NavIcons
            items={[
              {
                icon: "user",
                label: "Cuenta",
                onClick: () => console.log("User clicked"),
              },
              {
                icon: "envelope",
                label: "Abre tu tienda",
                onClick: () => console.log("Mail clicked"),
              },
              {
                icon: "ShoppingCartSimple",
                label: "Carrito",
                onClick: () => console.log("ShoppingCartSimple clicked"),
              },
            ]}
            orientation="horizontal"
            showLabels={true}
          />
        </div>
      </div>
      {/* Search bar debajo en mobile, inline en desktop */}
      <div className="w-full mt-3 md:mt-0 md:w-auto md:flex-1">
        <SearchBar
          placeholder="Buscar"
          fullWidth
          size="medium"
          dropdownOptions={["Productos", "Servicios"]}
          defaultDropdownValue="Selecciona"
        />
      </div>
    </header>
  );
}

export { Header };
