import React from "react";
import { Avatar } from "@/components/atoms/Avatar";
import { cntl } from "@/utils/cntl";
import { CaretRight } from "phosphor-react";
import type { UserData } from "../UserProfile";

type UserProfileSidebarProps = {
  userData?: UserData;
  activeSection: number;
  onSectionChange: (index: number) => void;
};

const navigationItems = [ "Información personal", "Cambiar contraseña", "Direcciones", "Pedidos", "Facturas", "Configuración" ];

export function UserProfileSidebar({ userData, activeSection, onSectionChange }: UserProfileSidebarProps) {
  return (
    <div className="w-full lg:w-64 bg-white shadow-sm p-6 flex-shrink-0">
      <div className="flex items-center gap-3 mb-6">
        <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" alt={userData?.userInformation?.userName || "Usuario"} size="md" />
        <span className="text-sm font-medium text-gray-700">{userData?.userInformation?.userName || "Usuario"}</span>
      </div>

      <nav className="space-y-2">
        {navigationItems.map((item, index) => (
          <button key={index} onClick={() => onSectionChange(index)} className={cntl`w-full flex items-center justify-between p-3 rounded-lg text-left text-sm font-medium transition-colors ${index === activeSection ? "bg-red-50 text-red-600 border border-red-200" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
            <span>{item}</span>
            <CaretRight size={16} className="text-gray-400" />
          </button>
        ))}
      </nav>
    </div>
  );
}