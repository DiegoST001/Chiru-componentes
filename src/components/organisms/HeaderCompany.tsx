import ProfileBtnSupplier from "@/components/molecules/ProfileBtnSupplier";
import NavegationSupplier from "@/components/molecules/NavegationSupplier";
import { Badge } from "@/components/atoms/Badge";
import React from "react";
type HeaderCompanyProps = {};

function HeaderCompany() {
  return (
    <div className="w-full bg-white p-2 md:p-4 lg:p-5 space-y-2 md:space-y-4 rounded-xl border-2 border-gray-200" >
      <div className="flex items-center justify-between border-gray-200">
        <ProfileBtnSupplier
          title="Custom Title"
          imageUrl="https://images.unsplash.com/photo-1511367461989-f85a21fda167?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
          imageAlt="Custom Profile Image"
        />

        <Badge variant="success" >New</Badge>
      </div>

      <NavegationSupplier className="justify-between" />
    </div>
  );
}

export { HeaderCompany };
