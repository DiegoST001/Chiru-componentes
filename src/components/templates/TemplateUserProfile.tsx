import React from "react";
import { UserProfile } from "@/components/organisms/UserProfile";
import { cntl } from "@/utils/cntl";

function TemplateUserProfile() {
  return (
    <div className={cntl`min-h-screen flex flex-col`}>
      <main className="flex-1">
        <UserProfile />
      </main>
    </div>
  );
}

export { TemplateUserProfile };