import React from "react";
import { Icon } from "@/components/atoms/Icon";
import { Text } from "@/components/atoms/Text";
import { HeaderCompany } from "./HeaderCompany";
import NavegationSupplier from "../molecules/NavegationSupplier";
import { Image } from "../atoms/Image";
import { Heading } from "../atoms/Heading";
import { Badge } from "../atoms/Badge";
import { CheckCircle } from "phosphor-react";

function HeaderCompanyProfile() {
  return (
    <div className="w-full bg-white space-y-2 md:space-y-4 ">
      <div className="flex flex-col md:flex-row items-center justify-start gap-4 md:gap-6 lg:gap-8 w-full bg-gray-900 p-2 md:p-4 lg:p-6 rounded-2xl">
        <Image
          radius="full"
          src="/chiru_logo_full.svg"
          fit="contain"
          className="w-20 h-20 md:w-32 md:h-32 lg:w-40 lg:h-40 p-0.5 md:p-2"
        />

        <div className="flex flex-col justify-start gap-2 md:gap-3 px-4">
          <Heading
            color="white"
            className="text-white text-2xl md:text-4xl font-semibold"
          >
            Chiru
          </Heading>
          <Text size="lg" weight="normal" className="text-white">
            Tipo de negocio | Proveedor de servicios
          </Text>
          <Text size="lg" className="text-white font-light">
            Av. Tecnologica 150, Col. Valle Oriente, Monterrey, N.L.
          </Text>
        </div>
        <CheckCircle
          size={48}
          weight="fill"
          className="ml-auto text-green-400"
        />
      </div>
      <NavegationSupplier className="justify-between" />
    </div>
  );
}
export { HeaderCompanyProfile };
