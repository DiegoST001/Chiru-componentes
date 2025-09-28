import React, { useState, useEffect } from "react";
import { Icon } from "../atoms/Icon";
import { Text } from "../atoms/Text";
import { cntl } from "@/utils/cntl";
import {
  House,
  MagnifyingGlass,
  Package,
  Calendar,
  FileText,
  User,
  ChartBar,
  Gear,
  List, // ícono de hamburguesa
  X, // ícono de cerrar
  Wrench // nuevo ícono para servicios
} from "phosphor-react";

export interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  variant?: "default" | "danger";
}

interface NavegationSupplierProps {
  items?: NavItem[];
  onItemClick?: (itemId: string) => void;
  className?: string;
  /** id del item que debe estar activo inicialmente (uncontrolled). Default: 'home' */
  defaultActiveId?: string;
  /** Modo controlado: si se pasa activeId se ignora el estado interno */
  activeId?: string;
  /** Callback adicional cuando cambia el activo */
  onActiveChange?: (itemId: string) => void;
}

function NavegationSupplier({
  items = [
  { id: "home", icon: <House />, label: "Inicio", active: false },
  { id: "products", icon: <Package />, label: "Productos", active: false },
  { id: "services", icon: <Wrench />, label: "Servicios", active: false },
    { id: "calendar", icon: <Calendar />, label: "Calendario", active: false },
    { id: "files", icon: <FileText />, label: "Archivos", active: true, variant: "danger" },
    { id: "user", icon: <User />, label: "Perfil", active: false },
    { id: "stats", icon: <ChartBar />, label: "Estadísticas", active: false },
    { id: "settings", icon: <Gear />, label: "Ajustes", active: false }
  ],
  onItemClick,
  className,
  defaultActiveId = 'home',
  activeId: controlledActiveId,
  onActiveChange
}: NavegationSupplierProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalActive, setInternalActive] = useState<string>(defaultActiveId);

  // Sync if defaultActiveId changes (rare)
  useEffect(() => {
    if (!controlledActiveId) {
      setInternalActive(defaultActiveId);
    }
  }, [defaultActiveId, controlledActiveId]);

  const activeId = controlledActiveId || internalActive;

  const containerClasses = cntl`
    hidden sm:flex   
  items-center
  justify-start
    gap-0.5
    md:gap-1
    lg:gap-2
    px-6
    py-3
    bg-white
    border
    border-gray-200
    rounded-2xl
    ${className}
  `;

  const getItemClasses = (item: NavItem) => {
    const isActive = activeId === item.id;
    const danger = isActive && item.variant === 'danger';
    return cntl`
      relative
      flex flex-col items-center gap-0.5
      px-4 py-2 rounded-lg cursor-pointer
      transition-all duration-200
      ${danger ? 'bg-red-50 text-red-600' : isActive ? 'bg-red-50 text-red-600 shadow-inner' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'}
      ${isActive ? 'ring-1 ring-offset-1 ring-red-300/60' : ''}
    `;
  };

  const handleItemClick = (itemId: string) => {
    if (!controlledActiveId) setInternalActive(itemId);
    onActiveChange?.(itemId);
    onItemClick?.(itemId);
    setIsOpen(false); // cerrar menú en mobile
  };

  return (
    <>
      {/* Botón hamburguesa visible SOLO en pantallas < sm */}
      <button
        className="sm:hidden p-2 rounded-lg bg-white border border-gray-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <List size={24} />}
      </button>

      {/* Navegación normal en desktop */}
      <nav className={containerClasses}>
        {items.map((item) => {
          const isActive = activeId === item.id;
          const danger = isActive && item.variant === 'danger';
          return (
            <button
              key={item.id}
              className={getItemClasses(item)}
              onClick={() => handleItemClick(item.id)}
              type="button"
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                tamano="medium"
                variant={danger ? 'danger' : isActive ? 'danger' : 'default'}
              >
                {item.icon}
              </Icon>
              <Text
                size="xs"
                weight="medium"
                color={danger ? 'danger' : isActive ? 'danger' : 'default'}
              >
                {item.label}
              </Text>
              {isActive && <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-current" />}
            </button>
          );
        })}
      </nav>

      {/* Menú flotante en mobile */}
      {isOpen && (
        <div className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start">
          <div className="bg-white rounded-lg shadow-lg mt-16 w-10/12 flex flex-col p-4 gap-2">
            {items.map((item) => {
              const isActive = activeId === item.id;
              return (
                <button
                  key={item.id}
                  className={`flex items-center gap-2 p-2 rounded hover:bg-gray-100 text-sm w-full justify-start ${isActive ? 'bg-red-50 text-red-600 font-medium' : 'text-gray-700'}`}
                  onClick={() => handleItemClick(item.id)}
                >
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default NavegationSupplier;
export type { NavegationSupplierProps };
