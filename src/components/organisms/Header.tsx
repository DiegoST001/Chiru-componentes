// src/components/organisms/Header.tsx
import React, { useEffect, useState, Suspense } from "react";
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

// Carga diferida de resultados (evita cargar los templates si no se usan)
const ProductResults = React.lazy(() => import("@/components/templates/ProductSearchTemplate"));
const ServiceResults = React.lazy(() => import("@/components/templates/ServiceSearchTemplate"));

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

function getLocaleFromPath() {
  if (typeof window === "undefined") return "es";
  const seg = window.location.pathname.split("/").filter(Boolean);
  return seg[0] || "es";
}

type HeaderProps = { className?: string; showSearch?: boolean };

function getInitials(name?: string) {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function Header({ className, showSearch = true }: HeaderProps) {
  const [accountOpen, setAccountOpen] = useState(false);
  const [accountOpenMobile, setAccountOpenMobile] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  // Fallback (si el provider aún no inicializó)
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

  const displayName =
    (user as any)?.contactName ?? (user as any)?.userName ?? fallbackName ?? "";
  const displayAbbr =
    (user as any)?.userAbbreviation ?? fallbackAbbr ?? (displayName ? getInitials(displayName) : "");
  const isLogged = Boolean(isAuthenticated) || Boolean(fallbackName);

  const navigateToOpenStore = () => (window.location.href = resolveRoute("openStore"));
  const navigateToViewCart = () => (window.location.href = resolveRoute("viewCart"));

  const handleLogout = async () => {
    try {
      if (typeof logout === "function") await Promise.resolve(logout());
    } catch {
      /* ignore */
    } finally {
      try {
        clearAuthStorage();
      } catch {
        /* ignore */
      }
      if (typeof window !== "undefined") window.location.href = resolveRoute("home");
    }
  };

  // 🔎 Estado del buscador
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState<"Productos" | "Servicios">("Productos");
  const locale = getLocaleFromPath();

  // Activo cuando hay texto (para ocultar carruseles/banners con body.search-active)
  const inlineActive = showSearch && searchValue.trim().length > 0;

  useEffect(() => {
    if (typeof document === "undefined") return;
    const b = document.body;
    if (inlineActive) b.classList.add("search-active");
    else b.classList.remove("search-active");
    return () => b.classList.remove("search-active");
  }, [inlineActive]);

  return (
    <>
      <header
        className={cntl`
          bg-white border-b border-gray-200 shadow-sm w-full
          px-4 py-3 md:px-6 md:py-4
          ${className || ""}
        `}
      >
        {/* Desktop */}
        <div className={`hidden md:flex items-center w-full gap-6 ${showSearch ? "" : "justify-between"}`}>
          <a className="flex items-center min-w-fit" href={resolveRoute("home")}>
            <Image
              src="/chiru_logo_full.svg"
              alt="Chiru Logo"
              fit="contain"
              className="h-10 lg:h-12 w-auto"
            />
          </a>

          {showSearch && (
            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-3xl">
                <SearchBar
                  placeholder="Buscar"
                  fullWidth
                  size="medium"
                  dropdownOptions={["Productos", "Servicios"]}
                  defaultDropdownValue="Productos"
                  onChange={(v) => setSearchValue(v)}
                  onDropdownSelect={(opt) =>
                    setSearchType(opt?.toLowerCase() === "servicios" ? "Servicios" : "Productos")
                  }
                  onSearch={(v) => setSearchValue(v)}
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-6 min-w-fit">
            {/* Cuenta */}
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
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white text-sm font-medium">
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
                        onClick={() => {
                          window.location.href = resolveRoute("profile");
                        }}
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
                        onClick={() => {
                          window.location.href = resolveRoute("login");
                        }}
                      />
                      <Button
                        variant="primary"
                        size="small"
                        fullWidth
                        text="Registrarse"
                        onClick={() => {
                          window.location.href = resolveRoute("register");
                        }}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Iconos */}
            <NavIcons
              items={[
                { icon: <Storefront />, label: "Abre tu tienda", onClick: navigateToOpenStore },
                { icon: <ShoppingCartSimple />, label: "Carrito", onClick: navigateToViewCart },
              ]}
              orientation="horizontal"
              showLabels={true}
            />
          </div>
        </div>

        {/* Mobile */}
        <div className="flex flex-col md:hidden w-full gap-2">
          <div className="flex items-center justify-between w-full mb-2">
            {/* Menú */}
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

            {/* Logo */}
            <a className="flex-1 flex justify-center min-w-fit" href={resolveRoute("home")}>
              <Image src="/chiru_logo_full.svg" alt="Chiru Logo" fit="contain" className="h-10 w-auto" />
            </a>

            {/* Iconos derecha */}
            <div className="flex items-center gap-1 min-w-fit">
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
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white text-sm font-medium">
                      {displayAbbr || "U"}
                    </span>
                  ) : (
                    <Icon variant="default" tamano="medium">
                      <User />
                    </Icon>
                  )}
                </button>
              </div>

              <NavIcons
                items={[{ icon: <ShoppingCartSimple />, label: "", onClick: navigateToViewCart }]}
                orientation="horizontal"
                showLabels={false}
              />
            </div>
          </div>

          {/* Buscador mobile */}
          {showSearch && (
            <div className="w-full">
              <SearchBar
                placeholder="Buscar"
                fullWidth
                size="medium"
                dropdownOptions={["Productos", "Servicios"]}
                defaultDropdownValue="Productos"
                onChange={(v) => setSearchValue(v)}
                onDropdownSelect={(opt) =>
                  setSearchType(opt?.toLowerCase() === "servicios" ? "Servicios" : "Productos")
                }
                onSearch={(v) => setSearchValue(v)}
              />
            </div>
          )}
        </div>
      </header>

      {/* 🔽 Resultados INLINE (el mismo template, según tipo), bajo el header */}
      {inlineActive && (
        <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-6 text-gray-500">Cargando…</div>}>
          {searchType === "Productos" ? (
            <ProductResults
              locale={locale}
              controlledQuery={searchValue}
              mode="inline"
              manageUrl={false}
              showRefineInput={false}
            />
          ) : (
            <ServiceResults
              locale={locale}
              controlledQuery={searchValue}
              mode="inline"
              manageUrl={false}
              showRefineInput={false}
            />
          )}
        </Suspense>
      )}
    </>
  );
}

export { Header };
