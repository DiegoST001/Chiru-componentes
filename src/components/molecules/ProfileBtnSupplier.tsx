import React from "react";
import { Button } from "../atoms/Button";
import { Image } from "../atoms/Image";
import { Text } from "../atoms/Text";
import { cntl } from "@/utils/cntl";

interface ProfileBtnSupplierProps {
  title?: string;
  imageUrl?: string;
  imageAlt?: string;
  onClick?: () => void;
  className?: string;
}

function ProfileBtnSupplier({
  title = "Text-Title",
  imageUrl = "https://via.placeholder.com/112x112/e2e8f0/64748b?text=Profile",
  imageAlt = "Profile image",
  onClick,
  className,
}: ProfileBtnSupplierProps) {
  const buttonClasses = cntl`
    flex
    items-center
    px-4
    py-3
    border
    gap-2
    md:gap-3
    lg:gap-4
    border-gray-300
    rounded-xl
    bg-white
    hover:bg-gray-50


    transition-colors
    duration-200
    ${className}
  `;
  //    focus:outline-none
    // focus:ring-2
    //   focus:ring-blue-500
    // focus:border-blue-500

  return (
    <button type="button" className={buttonClasses} onClick={onClick}>
      {/* Texto del título */}
      <Text size="xs" weight="medium" color="default" >
        {title}
      </Text>

      {/* Imagen de perfil 112x112 */}
      <img
        src={imageUrl}
        alt={imageAlt}
        className="w-11 h-11 md:w-14 md:h-14 object-cover rounded-full "
      />
    </button>
  );
}

export default ProfileBtnSupplier;
