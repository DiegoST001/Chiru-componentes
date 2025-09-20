import React from "react";
import { Image } from "@/components/atoms/Image";
import { Heading } from "@/components/atoms/Heading";

type BrandCartProps = {
  name: string;
  logoUrl: string;
  websiteUrl: string;
  color?: string;
  showName?: boolean; // 👈 Nueva prop opcional
};

function BrandCart({ name, logoUrl, websiteUrl, color, showName = true }: BrandCartProps) {
  return (
    <a
      href={websiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center min-w-[150px] max-w[500] hover:scale-105 transition-transform cursor-pointer border-1 border-gray-200 shadow rounded-lg p-2"
    >
      <Image
        src={logoUrl}
        alt={name}
        size="small"
        fit="contain"
        radius="md"
        className="p-2"
        wrapperStyle={{
          backgroundColor: color ?? "white",
        }}
      />

      {/* 👇 Solo renderiza el nombre si showName es true */}
      {showName && (
        <Heading level={6} className="text-center mt-2">
          {name}
        </Heading>
      )}
    </a>
  );
}

export { BrandCart };
export type { BrandCartProps };
