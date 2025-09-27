import React, { useState } from "react";
import { cntl } from "@/utils/cntl";

import { UserProfileSidebar } from "./UserProfile/UserProfileSidebar";
import { PersonalInfoSection } from "./UserProfile/PersonalInfoSection";
import { ChangePasswordSection } from "./UserProfile/ChangePasswordSection";

export type UserData = {
  email: string;
  userName: string;
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

function UserProfile({ userData, className, initialSection }: UserProfileProps) {
  const [activeSection, setActiveSection] = useState(initialSection || 0);
  const [isEditing, setIsEditing] = useState(false);
  const [infoFormData, setInfoFormData] = useState({
    userName: userData?.userInformation?.userName || "",
    contactName: userData?.userInformation?.contactName || "",
    contactEmail: userData?.userInformation?.contactEmail || "",
    contactPhone: userData?.userInformation?.contactPhone || "",
  });
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInfoInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setInfoFormData(prev => ({ ...prev, [field]: e.target.value }));
  };
  const handleSave = () => { console.log("Guardando datos...", infoFormData); setIsEditing(false); };
  const handleCancel = () => { setInfoFormData({ userName: userData?.userInformation?.userName || "", contactName: userData?.userInformation?.contactName || "", contactEmail: userData?.userInformation?.contactEmail || "", contactPhone: userData?.userInformation?.contactPhone || "", }); setIsEditing(false); };
  
  const handlePasswordInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordFormData(prev => ({ ...prev, [field]: e.target.value }));
  };
  const handlePasswordSubmit = async () => { if (passwordFormData.newPassword !== passwordFormData.confirmPassword) { alert("Las contraseñas no coinciden"); return; } setIsLoading(true); console.log("Cambiando contraseña..."); setTimeout(() => { setIsLoading(false); alert("Contraseña actualizada"); setPasswordFormData({ currentPassword: "", newPassword: "", confirmPassword: "" }); }, 1000); };

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
              formData={infoFormData}
              isEditing={isEditing}
              onInputChange={handleInfoInputChange}
              onEdit={() => setIsEditing(true)}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}

          {activeSection === 1 && (
             <ChangePasswordSection
               formData={passwordFormData}
               isLoading={isLoading}
               onInputChange={handlePasswordInputChange}
               onSubmit={handlePasswordSubmit}
             />
          )}

          {activeSection === 2 && <div className="text-center py-12"><h1 className="text-2xl font-bold text-gray-900 mb-4">Direcciones</h1><p className="text-gray-600">Esta sección estará disponible próximamente.</p></div>}
          {activeSection === 3 && <div className="text-center py-12"><h1 className="text-2xl font-bold text-gray-900 mb-4">Pedidos</h1><p className="text-gray-600">Esta sección estará disponible próximamente.</p></div>}
          {activeSection === 4 && <div className="text-center py-12"><h1 className="text-2xl font-bold text-gray-900 mb-4">Facturas</h1><p className="text-gray-600">Esta sección estará disponible próximamente.</p></div>}
          {activeSection === 5 && <div className="text-center py-12"><h1 className="text-2xl font-bold text-gray-900 mb-4">Configuración</h1><p className="text-gray-600">Esta sección estará disponible próximamente.</p></div>}
        </div>
      </div>
    </div>
  );
}

export { UserProfile };