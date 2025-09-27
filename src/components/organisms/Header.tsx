import React, { useState } from "react";
import { SearchBar } from "@/components/molecules/SearchBar";
import { NavIcons } from "@/components/molecules/NavIcons";
import { cntl } from "@/utils/cntl";
import { Image } from "../atoms/Image";
import { List, Storefront, User, ShoppingCartSimple } from "phosphor-react";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { Text } from "@/components/atoms/Text";

type HeaderProps = {
  className?: string;
};

function Header({ className }: HeaderProps) {
  const [accountOpen, setAccountOpen] = useState(false);
  const [accountOpenMobile, setAccountOpenMobile] = useState(false);

  
  const navigateToOpenStore = () => {
    const locale =
      (typeof window !== "undefined" && window.location.pathname.split("/")[1]) || "es";
    window.location.href = `/${locale}/docs/dev/ui/templates/abrir-tienda`;
  };

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
        <a className="flex items-center min-w-fit" href="/es/home">
          <Image
            src="/chiru_logo_full.svg"
            alt="Chiru Logo"
            fit="contain"
            className="h-10 lg:h-12 w-auto"
          />
        </a>

        {/* Barra de búsqueda centrada */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-3xl">
            <SearchBar
              placeholder="Buscar"
              fullWidth
              size="medium"
              dropdownOptions={["Productos", "Servicios"]}
              defaultDropdownValue="Todos"
            />
          </div>
        </div>

        {/* Iconos a la derecha */}
        <div className="flex items-center gap-6 min-w-fit">
          {/* Cuenta (mismo tamaño/estilo que NavIcons) */}
          <div
            className="relative group"
            onMouseLeave={() => setAccountOpen(false)}
            onMouseEnter={() => setAccountOpen(true)}
          >
            <button
              type="button"
              onClick={() => setAccountOpen((v) => !v)}
              className={cntl`
                flex flex-col items-center justify-center
                h-10 w-10 rounded-full p-1 bg-gray-200
                md:bg-transparent md:p-2 md:rounded-md md:h-auto md:w-auto md:cursor-pointer
                transition-colors
                md:text-gray-600 hover:text-gray-900 hover:bg-gray-50 md:hover:bg-gray-100
                md:flex md:flex-col md:items-center md:justify-center
              `}
              aria-haspopup="menu"
              aria-expanded={accountOpen}
            >
              <Icon variant="default" tamano="medium">
                <User />
              </Icon>
              <span className="block text-center text-xs mt-1 text-gray-700 md:text-base md:mt-2">
                <Text size="xs" color="muted" weight="medium">Cuenta</Text>
              </span>
            </button>

            {/* Panel dropdown (sin borde, compacto, también para móvil más abajo) */}
            <div
              className={cntl`
                absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg
                transition-all duration-150 z-40
                ${accountOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-1"}
              `}
              role="menu"
            >
              <div className="p-2 grid gap-2">
                <Button
                  variant="outline"
                  size="small"
                  fullWidth
                  text="Iniciar sesión"
                  onClick={() => { window.location.href = "/es/auth/login"; }}
                />
                <Button
                  variant="primary"
                  size="small"
                  fullWidth
                  text="Registrarse"
                  onClick={() => { window.location.href = "/es/auth/register"; }}
                />
              </div>
            </div>
          </div>

          {/* Resto de iconos */}
          <NavIcons
            items={[
              {
                icon: <Storefront />,
                label: "Abre tu tienda",
                onClick: navigateToOpenStore, 
              },
              {
                icon: <ShoppingCartSimple />,
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
          <button
            className="h-10 w-10 rounded-full p-1 bg-gray-200 flex items-center justify-center"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("open-categories"));
              }
            }}
            aria-label="Abrir menú"
            type="button"
          >
            <List size={20} className="text-gray-600" />
          </button>

          {/* Logo centrado */}
          <a className="flex-1 flex justify-center min-w-fit" href="/es/docs/dev/ui/templates/Home">
            <Image
              src="/chiru_logo_full.svg"
              alt="Chiru Logo"
              fit="contain"
              className="h-10 w-auto"
            />
          </a>

          {/* Iconos a la derecha (cuenta + otros) */}
          <div className="flex items-center gap-1 min-w-fit">
            {/* Cuenta (mobile, mismo tamaño que otros) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountOpenMobile((v) => !v)}
                className="h-10 w-10 rounded-full p-1 bg-gray-200 flex items-center justify-center"
                aria-haspopup="menu"
                aria-expanded={accountOpenMobile}
              >
                <Icon variant="default" tamano="medium">
                  <User />
                </Icon>
              </button>

              {/* Panel dropdown mobile */}
              <div
                className={cntl`
                  absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg
                  transition-all duration-150 z-40
                  ${accountOpenMobile ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-1"}
                `}
                role="menu"
              >
                <div className="p-2 grid gap-2">
                  <Button
                    variant="outline"
                    size="small"
                    fullWidth
                    text="Iniciar sesión"
                    onClick={() => { window.location.href = "/es/auth/login"; }}
                  />
                  <Button
                    variant="primary"
                    size="small"
                    fullWidth
                    text="Registrarse"
                    onClick={() => { window.location.href = "/es/auth/register"; }}
                  />
                </div>
              </div>
            </div>

            <NavIcons
              items={[
                {
                  icon: <Storefront />,
                  label: "",
                  onClick: navigateToOpenStore, // ← ahora apunta a /{locale}/docs/dev/ui/templates/abrir-tienda
                },
                {
                  icon: <ShoppingCartSimple />,
                  label: "",
                  onClick: () => console.log("ShoppingCartSimple clicked"),
                },
              ]}
              orientation="horizontal"
              showLabels={false}
            />
          </div>
        </div>

        {/* Buscador debajo */}
        <div className="w-full">
          <SearchBar
            placeholder="Buscar"
            fullWidth
            size="medium"
            dropdownOptions={["Productos", "Servicios"]}
            defaultDropdownValue="Todos"
          />
        </div>
      </div>
    </header>
  );
}

export { Header };
