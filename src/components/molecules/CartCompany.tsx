import React from "react";
import { Avatar } from "../atoms/Avatar";
import { Tag } from "../atoms/Tag";
import { Text } from "../atoms/Text";
import { cntl } from "@/utils/cntl";
import type { SponsoredSupplier } from "@/features/sponsorship/model/sponsorship.model";

interface LegacyCartCompanyProps {
  size?: "small" | "medium" | "large";
  variant?: "default" | "primary" | "secondary";
  id: string;
  avatarUrl: string;
  name: string;
  tagLabel: string;
  rightText: string;
  className?: string; // <-- permite pasar clases
  noBorder?: boolean; // <-- permite quitar border
  noShadow?: boolean; // <-- permite quitar shadow
}

type CartCompanyProps = (
  | {
      supplier: SponsoredSupplier;
      size?: "small" | "medium" | "large";
      variant?: "default" | "primary" | "secondary";
      tagLabelOverride?: string;
      showPrice?: boolean;
      className?: string; // <-- permite pasar clases
      noBorder?: boolean;
      noShadow?: boolean;
    }
  | (LegacyCartCompanyProps & { supplier?: never })
);

function getCartCompanyStyles(
  size?: CartCompanyProps["size"],
  variant?: CartCompanyProps["variant"],
  className?: string,
  noBorder?: boolean,
  noShadow?: boolean
) {
  const base = `
    flex items-center justify-between gap-4
    rounded-md ${noShadow ? "" : "shadow-sm"} ${noBorder ? "" : "border"} w-full
  `;

  const sizeStyles = {
    small: "text-sm p-2 min-w-[220px]",
    medium: "text-base p-4 min-w-[280px]",
    large: "text-lg p-6 min-w-[340px]",
  };

  const variantStyles = {
    default: "border-gray-200",
    primary: "border-blue-200",
    secondary: "border-gray-300",
  };

  // Si se pidió noBorder, no añadimos clases de borde
  const variantSafe = noBorder
    ? { default: "", primary: "", secondary: "" }
    : variantStyles;

  return cntl`
    ${base}
    ${sizeStyles[size || "medium"]}
    ${variantSafe[variant || "default"]}
    ${className || ""}
  `;
}

function getAvatarSize(size: CartCompanyProps["size"]) {
  if (size === "small") return "sm";
  if (size === "large") return "xl";
  return "lg";
}

function getTagSize(size: CartCompanyProps["size"]) {
  return size === "small" ? "small" : "medium";
}

function CartCompany(props: CartCompanyProps) {
  // Determine if using supplier model or legacy props
  const usingSupplier = (props as any).supplier;
  const size = (props as any).size || "medium";
  const variant = (props as any).variant || "default";
  const className = (props as any).className as string | undefined;
  const noBorder = (props as any).noBorder as boolean | undefined;
  const noShadow = (props as any).noShadow as boolean | undefined;

  let id: string;
  let avatarUrl: string;
  let name: string;
  let tagLabel: string;
  let rightText: string;

  if (usingSupplier) {
    const { supplier, tagLabelOverride, showPrice = true } = props as {
      supplier: SponsoredSupplier;
      tagLabelOverride?: string;
      showPrice?: boolean;
    };
    // Mantener id interno (sponsorship) pero también exponer supplierId real vía data attributes.
    id = supplier.id; // sponsorship id (backend entity id)
    const realSupplierId = (supplier as any).supplierId || supplier.id;
    avatarUrl = supplier.supplierLogo || "";
    name = supplier.supplierName;
    tagLabel = tagLabelOverride || "Tecnología"; // default category placeholder
    const priceRaw: any = (supplier as any).sponsorPrice;
    const priceNum = typeof priceRaw === "number" ? priceRaw : parseFloat(priceRaw || "0");
    rightText = showPrice ? `S/ ${priceNum.toFixed(2)}` : "";

    return (
      <div
        className={getCartCompanyStyles(size, variant, className, noBorder, noShadow)}
        data-id={id}
        data-supplier-id={realSupplierId}
        data-sponsorship-id={id}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar src={avatarUrl || ""} alt={name || "Company"} size={getAvatarSize(size)} shape="circle" />
          <div className="flex flex-col gap-1 min-w-0 truncate">
            <Text size="base" weight="medium" className="truncate">
              {name}
            </Text>
            <Tag
              text={tagLabel || ""}
              size={getTagSize(size)}
              variant="primary"
              textColor="white"
              weight="normal"
              rounded="md"
            />
          </div>
        </div>
        {/* Eliminado rightText visual (comentado originalmente). Si se necesita mostrar el precio, descomentar: */}
        {/* {rightText && (
          <Text size="base" weight="normal" color="default" className="whitespace-nowrap">
            {rightText}
          </Text>
        )} */}
      </div>
    );
  } else {
    const legacy = props as LegacyCartCompanyProps;
    id = legacy.id;
    avatarUrl = legacy.avatarUrl;
    name = legacy.name;
    tagLabel = legacy.tagLabel;
    rightText = legacy.rightText;
  }
  return (
    <div
      className={getCartCompanyStyles(size, variant, className, noBorder, noShadow)}
      data-id={id}
      data-supplier-id={id}
      data-sponsorship-id={id}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar src={avatarUrl || ""} alt={name || "Company"} size={getAvatarSize(size)} shape="circle" />
        <div className="flex flex-col gap-1 min-w-0 truncate">
          <Text size="base" weight="medium" className="truncate">
            {name}
          </Text>
          <Tag
            text={tagLabel || ""}
            size={getTagSize(size)}
            variant="primary"
            textColor="white"
            weight="normal"
            rounded="md"
          />
        </div>
      </div>
    </div>
  );
}

export { CartCompany };
export type { CartCompanyProps };