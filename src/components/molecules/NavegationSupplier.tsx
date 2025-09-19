import React from "react";
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
  Gear
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
    { id: "home", icon: <House />, label: "text", active: false },
    { id: "search", icon: <MagnifyingGlass />, label: "text", active: false },
    { id: "calendar", icon: <Calendar />, label: "text", active: false },
    { id: "files", icon: <FileText />, label: "text", active: true, variant: "danger" },
    { id: "user", icon: <User />, label: "text", active: false },
    { id: "stats", icon: <ChartBar />, label: "text", active: false },
    { id: "settings", icon: <Gear />, label: "text", active: false }
  ],
  onItemClick,
  className 
}: NavegationSupplierProps) {
  
  const containerClasses = cntl`
    flex
    items-center
    justify-center
    gap-1
    px-6
    py-3
    bg-white
    border
    border-gray-200
    rounded-2xl
    shadow-sm
    ${className}
  `;

  const getItemClasses = (item: NavItem) => cntl`
    flex
    flex-col
    items-center
    gap-1
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
    if (onItemClick) {
      onItemClick(itemId);
    }
  };

  return (
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
  );
}

export default NavegationSupplier;