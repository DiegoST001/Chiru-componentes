import React from "react";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";

type PersonalInfoSectionProps = {
  formData: { userName: string; contactName: string; contactEmail: string; contactPhone: string; };
  isEditing: boolean;
  onInputChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
};

export function PersonalInfoSection({ formData, isEditing, onInputChange, onEdit, onSave, onCancel }: PersonalInfoSectionProps) {
  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Información Personal</h1>
      <div className="space-y-6">
        <FormField label="Nombre de Usuario *" type="text" value={formData.userName} onChange={onInputChange("userName")} disabled={!isEditing} required icon="user"/>
        <FormField label="Nombre de Contacto *" type="text" value={formData.contactName} onChange={onInputChange("contactName")} disabled={!isEditing} required icon="user"/>
        <FormField label="Email de Contacto *" type="email" value={formData.contactEmail} onChange={onInputChange("contactEmail")} disabled={!isEditing} required icon="at"/>
        <FormField label="Teléfono de Contacto *" type="text" value={formData.contactPhone} onChange={onInputChange("contactPhone")} disabled={!isEditing} required icon="phone"/>
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