import React, { useState, useEffect } from "react";
import { SearchBar } from "@/components/molecules/SearchBar";
import { NavIcons } from "@/components/molecules/NavIcons";
import { cntl } from "@/utils/cntl";
import { Image } from "../atoms/Image";
import { List, Storefront, User, ShoppingCartSimple } from "phosphor-react";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { Text } from "@/components/atoms/Text";
import { useAuth } from "@/contexts/AuthProvider";
import { STORAGE_KEYS, clearAuthStorage } from "@/constants/storage";
// import { ShoppingCartService } from "@/services/ShoppingCartService";

// --- rutas centralizadas (usar array para poder modificar fácilmente) ---
type RouteItem = { key: string; path: string };
const ROUTES: RouteItem[] = [
  { key: "home", path: "/{locale}/home" },
  { key: "login", path: "/{locale}/docs/dev/ui/templates/auth/login" },
  { key: "register", path: "/{locale}/docs/dev/ui/templates/auth/register" },
  { key: "profile", path: "/{locale}/docs/dev/ui/templates/auth/user-profile" },
  { key: "openStore", path: "/{locale}/docs/dev/ui/templates/abrir-tienda" },
  { key: "viewCart", path: "/{locale}/docs/dev/ui/templates/carView" },
];

function resolveRoute(key: string, locale?: string) {
  const item = ROUTES.find((r) => r.key === key);
  const loc =
    locale ??
    (typeof window !== "undefined" ? window.location.pathname.split("/")[1] || "es" : "es");
  if (!item) return `/${loc}`;
  return item.path.replace("{locale}", loc);
}

type HeaderProps = {
  className?: string;
};

function getInitials(name?: string) {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function Header({ className }: HeaderProps) {
  const [accountOpen, setAccountOpen] = useState(false);
  const [accountOpenMobile, setAccountOpenMobile] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const userId = user ? Number((user as any).userId ?? (user as any).id) : undefined;

  // Fallback: leer session desde localStorage si el provider aún no inicializó
  const [fallbackName, setFallbackName] = useState<string | null>(null);
  const [fallbackAbbr, setFallbackAbbr] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
      if (raw) {
        const s = JSON.parse(raw);
        const name = s?.contactName ?? s?.userName ?? null;
        const abbr = s?.userAbbreviation ?? (name ? getInitials(String(name)) : null);
        if (name) setFallbackName(String(name));
        if (abbr) setFallbackAbbr(String(abbr));
      }
    } catch {
      /* ignore */
    }
  }, []);

  // derived display values (prefer context user, fallback to localStorage)
  const displayName =
    (user as any)?.contactName ?? (user as any)?.userName ?? fallbackName ?? "";
  const displayAbbr =
    (user as any)?.userAbbreviation ?? fallbackAbbr ?? (displayName ? getInitials(displayName) : "");

  // consider authenticated if context says so or fallback session exists
  const isLogged = Boolean(isAuthenticated) || Boolean(fallbackName);

  const navigateToOpenStore = () => {
    window.location.href = resolveRoute("openStore");
  };

  const navigateToViewCart = () => {
    window.location.href = resolveRoute("viewCart");
  };

  const handleLogout = async () => {
    try {
      if (typeof logout === "function") {
        // soportar logout sincrónico o asíncrono sin lanzar error de TS al chequear truthiness
        await Promise.resolve(logout());
      }
    } catch (e) {
      // opcional: log para debug
      // console.error("[Header] logout error:", e);
    } finally {
      try {
        clearAuthStorage();
      } catch {
        /* ignore */
      }
      if (typeof window !== "undefined") {
        // redirigir al home (usa resolveRoute para respetar locale)
        window.location.href = resolveRoute("home");
      }
    }
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
        <a className="flex items-center min-w-fit" href={resolveRoute("home")}>
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
              aria-label={isLogged ? `Cuenta de ${displayName || "usuario"}` : "Cuenta"}
            >
              {isLogged ? (
                // show initials bubble when authenticated
                <span
                  className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white text-sm font-medium"
                  aria-hidden="true"
                >
                  {displayAbbr || "U"}
                </span>
              ) : (
                <Icon variant="default" tamano="medium">
                  <User />
                </Icon>
              )}

              <span className="block text-center text-xs mt-1 text-gray-700 md:text-base md:mt-2">
                <Text size="xs" color="muted" weight="medium">
                  {isLogged ? (displayName ? displayName.split(" ")[0] : "Cuenta") : "Cuenta"}
                </Text>
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
                {isLogged ? (
                  <>
                    <Button
                      variant="outline"
                      size="small"
                      fullWidth
                      text="Mi cuenta"
                      onClick={() => { window.location.href = resolveRoute("profile"); }}
                    />
                    <Button
                      variant="primary"
                      size="small"
                      fullWidth
                      text="Cerrar sesión"
                      onClick={handleLogout}
                    />
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="small"
                      fullWidth
                      text="Iniciar sesión"
                      onClick={() => { window.location.href = resolveRoute("login"); }}
                    />
                    <Button
                      variant="primary"
                      size="small"
                      fullWidth
                      text="Registrarse"
                      onClick={() => { window.location.href = resolveRoute("register"); }}
                    />
                  </>
                )}
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
                onClick: navigateToViewCart,
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
          <a className="flex-1 flex justify-center min-w-fit" href={resolveRoute("home")}>
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
                aria-label={isLogged ? `Cuenta de ${displayName || "usuario"}` : "Cuenta"}
              >
                {isLogged ? (
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white text-sm font-medium" aria-hidden="true">
                    {displayAbbr || "U"}
                  </span>
                ) : (
                  <Icon variant="default" tamano="medium">
                    <User />
                  </Icon>
                )}
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
                  {isLogged ? (
                    <>
                      <Button
                        variant="outline"
                        size="small"
                        fullWidth
                        text="Mi cuenta"
                        onClick={() => { window.location.href = resolveRoute("profile"); }}
                      />
                      <Button
                        variant="primary"
                        size="small"
                        fullWidth
                        text="Cerrar sesión"
                        onClick={handleLogout}
                      />
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="small"
                        fullWidth
                        text="Iniciar sesión"
                        onClick={() => { window.location.href = resolveRoute("login"); }}
                      />
                      <Button
                        variant="primary"
                        size="small"
                        fullWidth
                        text="Registrarse"
                        onClick={() => { window.location.href = resolveRoute("register"); }}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

            <NavIcons
              items={[
                {
                  icon: <ShoppingCartSimple />,
                  label: "",
                  onClick: navigateToViewCart,
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
