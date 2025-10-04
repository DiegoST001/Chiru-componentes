import React, { useEffect, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { useAuth } from "@/contexts/AuthProvider";
import { STORAGE_KEYS } from "@/constants/storage";

type PersonalInfoSectionProps = {
  formData?: { userName: string; contactName: string; contactEmail: string; contactPhone: string };
  isEditing: boolean;
  onInputChange?: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
};

export function PersonalInfoSection({
  formData,
  isEditing,
  onInputChange,
  onEdit,
  onSave,
  onCancel,
}: PersonalInfoSectionProps) {
  const { user: authUser, isAuthenticated } = useAuth?.() ?? { user: undefined, isAuthenticated: false };
  const [local, setLocal] = useState({
    userName: formData?.userName ?? "",
    contactName: formData?.contactName ?? "",
    contactEmail: formData?.contactEmail ?? "",
    contactPhone: formData?.contactPhone ?? "",
  });

  useEffect(() => {
    // If parent provided formData use it; otherwise try auth context -> localStorage
    if (formData && Object.values(formData).some(Boolean)) {
      setLocal({
        userName: formData.userName ?? "",
        contactName: formData.contactName ?? "",
        contactEmail: formData.contactEmail ?? "",
        contactPhone: formData.contactPhone ?? "",
      });
      return;
    }

    // Prefer auth context
    if (isAuthenticated && authUser) {
      const info = {
        userName: (authUser as any)?.userName ?? (authUser as any)?.userInformation?.userName ?? "",
        contactName: (authUser as any)?.contactName ?? (authUser as any)?.userInformation?.contactName ?? "",
        contactEmail: (authUser as any)?.contactEmail ?? (authUser as any)?.userInformation?.contactEmail ?? (authUser as any)?.email ?? "",
        contactPhone: (authUser as any)?.contactPhone ?? (authUser as any)?.userInformation?.contactPhone ?? "",
      };
      setLocal(info);
      return;
    }

    // Fallback to localStorage
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
        if (raw) {
          const s = JSON.parse(raw);
          const info = {
            userName: s?.userName ?? s?.userInformation?.userName ?? s?.contactName ?? "",
            contactName: s?.contactName ?? s?.userInformation?.contactName ?? "",
            contactEmail: s?.contactEmail ?? s?.userInformation?.contactEmail ?? s?.email ?? "",
            contactPhone: s?.contactPhone ?? s?.userInformation?.contactPhone ?? "",
          };
          setLocal(info);
        }
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, isAuthenticated, authUser]);

  const handleLocalChange = (field: keyof typeof local) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocal((p) => ({ ...p, [field]: value }));
    if (onInputChange) {
      onInputChange(field)(e);
    }
  };

  // values: prefer parent formData when present to keep controlled flow
  const value = {
    userName: formData?.userName ?? local.userName,
    contactName: formData?.contactName ?? local.contactName,
    contactEmail: formData?.contactEmail ?? local.contactEmail,
    contactPhone: formData?.contactPhone ?? local.contactPhone,
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Información Personal</h1>
      <div className="space-y-6">
        <FormField label="Nombre de Usuario *" type="text" value={value.userName} onChange={handleLocalChange("userName")} disabled={!isEditing} required icon="user"/>
        <FormField label="Nombre de Contacto *" type="text" value={value.contactName} onChange={handleLocalChange("contactName")} disabled={!isEditing} required icon="user"/>
        <FormField label="Email de Contacto *" type="email" value={value.contactEmail} onChange={handleLocalChange("contactEmail")} disabled={!isEditing} required icon="at"/>
        <FormField label="Teléfono de Contacto *" type="text" value={value.contactPhone} onChange={handleLocalChange("contactPhone")} disabled={!isEditing} required icon="phone"/>
      </div>
      <div className="flex gap-4 mt-8">
        {!isEditing ? (
          <Button variant="primary" size="medium" text="Editar" onClick={onEdit} className="bg-red-600 hover:bg-red-700"/>
        ) : (
          <>
            <Button variant="primary" size="medium" text="Guardar Cambios" onClick={onSave} className="bg-red-600 hover:bg-red-700"/>
            <Button variant="outline" size="medium" text="Cancelar" onClick={onCancel}/>
          </>
        )}
      </div>
    </>
  );
}