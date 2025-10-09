import React from "react";
import { Avatar } from "@/components/atoms/Avatar";
import { cntl } from "@/utils/cntl";
import { CaretRight } from "phosphor-react";
import type { UserData } from "../UserProfile";
import { useAuth } from "@/contexts/AuthProvider";
import { STORAGE_KEYS } from "@/constants/storage";

type UserProfileSidebarProps = {
  userData?: UserData;
  activeSection: number;
  onSectionChange: (index: number) => void;
};

const navigationItems = [
  "Información personal",
  "Cambiar contraseña",
  "Direcciones",
  "Pedidos",
  "Facturas",
  "Configuración",
];

function getInitials(name?: string) {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function UserProfileSidebar({ userData, activeSection, onSectionChange }: UserProfileSidebarProps) {
  // Prefer prop -> auth context -> localStorage
  const { user: authUser } = useAuth?.() ?? { user: undefined };

  let effective: any = userData ?? authUser;

  if (!effective) {
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
        if (raw) {
          effective = JSON.parse(raw);
        }
      }
    } catch {
      /* ignore */
    }
  }

  const displayName =
    effective?.userInformation?.userName ??
    effective?.userName ??
    effective?.contactName ??
    effective?.email ??
    "Usuario";

  const initials =
    effective?.userAbbreviation ??
    effective?.userInitials ??
    getInitials(String(displayName));

  const avatarUrl = effective?.avatarUrl ?? effective?.photoUrl ?? "";

  return (
    <div className="w-full lg:w-64 bg-white shadow-sm p-6 flex-shrink-0">
      <div className="flex items-center gap-3 mb-6">
        {avatarUrl ? (
          <Avatar src={avatarUrl} alt={displayName} size="md" />
        ) : (
          <div
            aria-hidden="true"
            className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-indigo-600 text-white text-sm font-medium"
            title={displayName}
          >
            {initials || "U"}
          </div>
        )}
        <span className="text-sm font-medium text-gray-700">{displayName}</span>
      </div>

      <nav className="space-y-2">
        {navigationItems.map((item, index) => (
          <button
            key={index}
            onClick={() => onSectionChange(index)}
            className={cntl`
              w-full flex items-center justify-between p-3 rounded-lg text-left text-sm font-medium transition-colors
              ${index === activeSection ? "bg-red-50 text-red-600 border border-red-200" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}
            `}
          >
            <span>{item}</span>
            <CaretRight size={16} className="text-gray-400" />
          </button>
        ))}
      </nav>
    </div>
  );
}