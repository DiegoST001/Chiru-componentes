import React, { useState, useEffect } from "react";
import { cntl } from "@/utils/cntl";
import { UserProfileSidebar } from "./UserProfile/UserProfileSidebar";
import { PersonalInfoSection } from "./UserProfile/PersonalInfoSection";
import { ChangePasswordSection } from "./UserProfile/ChangePasswordSection";
import { MyOrdersSection } from "./UserProfile/MyOrdersSection";

export type UserData = {
  email: string;
  userName: string;
  userId?: number;
  userInformation: {
    userName: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
  };
};

type UserProfileProps = {
  userData?: UserData; 
  className?: string;
  initialSection?: number;
};

function parseSectionFromLocation(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("section");
    if (q) {
      const n = Number(q);
      if (!Number.isNaN(n) && n >= 0) return Math.max(0, Math.floor(n));
    }
    const hash = window.location.hash.replace(/^#/, "");
    const m = hash.match(/section(?:=|-)(\d+)/);
    if (m && m[1]) {
      const n = Number(m[1]);
      if (!Number.isNaN(n) && n >= 0) return Math.max(0, Math.floor(n));
    }
  } catch {
    /* ignore */
  }
  return null;
}

function UserProfile({ userData, className, initialSection }: UserProfileProps) {
  // Sólo mantiene UI state (sección activa / modo edición).
  // Los datos (email, nombre, teléfono, órdenes, etc.) serán consumidos por los organismos.
  const [activeSection, setActiveSection] = useState<number>(initialSection ?? 0);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (initialSection == null) {
      const fromUrl = parseSectionFromLocation();
      if (fromUrl != null) setActiveSection(fromUrl);
    } else {
      setActiveSection(initialSection);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSection]);

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => setIsEditing(false);
  const handleCancel = () => setIsEditing(false);

  return (
    <div className={cntl`flex flex-col lg:flex-row gap-6 min-h-screen bg-gray-50 ${className || ""}`}>
      <UserProfileSidebar
        userData={userData}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <div className="flex-1 bg-white shadow-sm p-6">
        <div className="max-w-2xl">
          {activeSection === 0 && (
            <PersonalInfoSection
              isEditing={isEditing}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}

          {activeSection === 1 && (
            // ChangePasswordSection debe consumir su propio estado/servicio internamente
            <ChangePasswordSection />
          )}

          {activeSection === 2 && (
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Direcciones</h1>
              <p className="text-gray-600">Esta sección estará disponible próximamente.</p>
            </div>
          )}

          {activeSection === 3 && (
            // MyOrdersSection puede leer userId desde contexto/localStorage/servicio
            <MyOrdersSection />
          )}

          {activeSection === 4 && (
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Facturas</h1>
              <p className="text-gray-600">Esta sección estará disponible próximamente.</p>
            </div>
          )}

          {activeSection === 5 && (
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Configuración</h1>
              <p className="text-gray-600">Esta sección estará disponible próximamente.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { UserProfile };