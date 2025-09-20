import React, { useState } from "react";
import { Icon } from "../atoms/Icon";
import { Text } from "../atoms/Text";
import { cntl } from "@/utils/cntl";
import {
  House,
  MagnifyingGlass,
  Calendar,
  FileText,
  User,
  ChartBar,
  Gear,
  List, // ícono de hamburguesa
  X // ícono de cerrar
} from "phosphor-react";

interface NavItem {
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
}

function NavegationSupplier({
  items = [
    { id: "home", icon: <House />, label: "Inicio", active: false },
    { id: "search", icon: <MagnifyingGlass />, label: "Buscar", active: false },
    { id: "calendar", icon: <Calendar />, label: "Calendario", active: false },
    { id: "files", icon: <FileText />, label: "Archivos", active: true, variant: "danger" },
    { id: "user", icon: <User />, label: "Perfil", active: false },
    { id: "stats", icon: <ChartBar />, label: "Estadísticas", active: false },
    { id: "settings", icon: <Gear />, label: "Ajustes", active: false }
  ],
  onItemClick,
  className
}: NavegationSupplierProps) {
  const [isOpen, setIsOpen] = useState(false);

  const containerClasses = cntl`
    hidden sm:flex   
    items-center
    justify-space-around
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

  const getItemClasses = (item: NavItem) => cntl`
    flex
    flex-col
    items-center
    gap-0.5
    px-4
    py-2
    rounded-lg
    cursor-pointer
    transition-all
    duration-200
    hover:bg-gray-50
    ${item.active && item.variant === "danger"
      ? "bg-red-50 text-red-600"
      : item.active
      ? "bg-blue-50 text-blue-600"
      : "text-gray-600 hover:text-gray-800"
    }
  `;

  const handleItemClick = (itemId: string) => {
    if (onItemClick) onItemClick(itemId);
    setIsOpen(false); // cerrar menú en mobile al seleccionar
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
        {items.map((item) => (
          <button
            key={item.id}
            className={getItemClasses(item)}
            onClick={() => handleItemClick(item.id)}
            type="button"
          >
            <Icon
              tamano="medium"
              variant={
                item.active && item.variant === "danger"
                  ? "danger"
                  : item.active
                  ? "primary"
                  : "default"
              }
            >
              {item.icon}
            </Icon>
            <Text
              size="xs"
              weight="medium"
              color={
                item.active && item.variant === "danger"
                  ? "danger"
                  : item.active
                  ? "primary"
                  : "default"
              }
            >
              {item.label}
            </Text>
          </button>
        ))}
      </nav>

      {/* Menú flotante en mobile */}
      {isOpen && (
        <div className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start">
          <div className="bg-white rounded-lg shadow-lg mt-16 w-10/12 flex flex-col p-4 gap-2">
            {items.map((item) => (
              <button
                key={item.id}
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
                onClick={() => handleItemClick(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default NavegationSupplier;
