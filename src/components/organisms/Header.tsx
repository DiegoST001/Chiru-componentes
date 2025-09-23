import React from "react";
import { SearchBar } from "@/components/molecules/SearchBar";
import { NavIcons } from "@/components/molecules/NavIcons";
import { cntl } from "@/utils/cntl";
import { Image } from "../atoms/Image";
import { List } from "phosphor-react";

type HeaderProps = {
  className?: string;
};

function Header({ className }: HeaderProps) {
  return (
    <header
      className={cntl`
        bg-white border-b border-gray-200 shadow-sm w-full
        px-4 py-3 md:px-6 md:py-4
        ${className || ""}
      `}
    >
      {/* Desktop layout */}
      <div className="hidden md:flex items-center w-full gap-6">
        {/* Logo a la izquierda */}
        <a className="flex items-center min-w-fit" href="/es/docs/dev/ui/templates/Home">
          <Image
            src="/chiru_logo_full.svg"
            alt="Chiru Logo"
            fit="contain"
            className="h-10 lg:h-12 w-auto"
          />
        </a>
        {/* Barra de búsqueda centrada y ocupando todo el espacio */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-3xl">
            <SearchBar
              placeholder="Buscar"
              fullWidth
              size="medium"
              dropdownOptions={["Productos", "Servicios"]}
              defaultDropdownValue="Selecciona"
            />
          </div>
        </div>
        {/* Iconos a la derecha */}
        <div className="flex items-center gap-6 min-w-fit">
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
      {/* Mobile layout */}
      <div className="flex flex-col md:hidden w-full gap-2">
        <div className="flex items-center justify-between w-full mb-2">
          {/* Menú sandwich */}
          <a
            className="h-10 w-10 rounded-full p-1 bg-gray-200 flex items-center justify-center"
            href="/"
          >
            <List size={20} className="text-gray-600" />
          </a>
          {/* Logo centrado */}
          <a className="flex-1 flex justify-center min-w-fit" href="/es/docs/dev/ui/templates/Home">
            <Image
              src="/chiru_logo_full.svg"
              alt="Chiru Logo"
              fit="contain"
              className="h-10 w-auto"
            />
          </a>
          {/* Iconos a la derecha */}
          <div className="flex items-center gap-1 min-w-fit">
            <NavIcons
              items={[
                {
                  icon: "user",
                  label: "",
                  onClick: () => console.log("User clicked"),
                },
                {
                  icon: "envelope",
                  label: "",
                  onClick: () => console.log("Mail clicked"),
                },
                {
                  icon: "ShoppingCartSimple",
                  label: "",
                  onClick: () => console.log("ShoppingCartSimple clicked"),
                },
              ]}
              orientation="horizontal"
              showLabels={false}
            />
          </div>
        </div>
        {/* Buscador debajo, ocupa casi todo el ancho */}
        <div className="w-full">
          <SearchBar
            placeholder="Buscar"
            fullWidth
            size="medium"
            dropdownOptions={["Productos", "Servicios"]}
            defaultDropdownValue="Selecciona"
          />
        </div>
      </div>
    </header>
  );
}

export { Header };
