import React from "react";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { UserProfile } from "@/components/organisms/UserProfile";
import { cntl } from "@/utils/cntl";

type UserData = {
  // ... (tu tipo UserData)
  email: string;
  password: string | null;
  isActive: string;
  isAdmin: string;
  role: string;
  userName: string;
  createdAt: string;
  userInformation: {
    userName: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
  };
};

type TemplateUserProfileProps = {
  userData?: UserData;
  className?: string;
  initialSection?: number; // <--- CAMBIO 1: Añadimos la prop aquí también
};

function TemplateUserProfile({ userData, className, initialSection }: TemplateUserProfileProps) {
  return (
    <div className={cntl`
      min-h-screen flex flex-col
      ${className || ""}
    `}>
      <main className="flex-1">
        {/* <--- CAMBIO 2: Pasamos la prop al componente hijo */}
        <UserProfile userData={userData} initialSection={initialSection} />
      </main>
    </div>
  );
}

export { TemplateUserProfile };