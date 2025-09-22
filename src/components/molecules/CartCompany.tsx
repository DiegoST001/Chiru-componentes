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
}

type CartCompanyProps = (
  | { supplier: SponsoredSupplier; size?: "small" | "medium" | "large"; variant?: "default" | "primary" | "secondary"; tagLabelOverride?: string; showPrice?: boolean; }
  | (LegacyCartCompanyProps & { supplier?: never })
);

function getCartCompanyStyles(size?: CartCompanyProps["size"], variant?: CartCompanyProps["variant"]) {
  const base = `
    flex items-center justify-between gap-4
    rounded-md shadow-sm border w-full
  `;

  const sizeStyles = {
    small: "text-sm p-2 min-w-[220px]",
    medium: "text-base p-4 min-w-[280px]",
    large: "text-lg p-6 min-w-[340px]",
  };

  const variantStyles = {
    default: "bg-white border-gray-200",
    primary: "bg-blue-50 border-blue-200",
    secondary: "bg-gray-50 border-gray-300",
  };

  return cntl`
    ${base}
    ${sizeStyles[size || "medium"]}
    ${variantStyles[variant || "default"]}
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

  let id: string;
  let avatarUrl: string;
  let name: string;
  let tagLabel: string;
  let rightText: string;

  if (usingSupplier) {
    const { supplier, tagLabelOverride, showPrice = true } = props as { supplier: SponsoredSupplier; tagLabelOverride?: string; showPrice?: boolean };
    id = supplier.id;
    avatarUrl = supplier.supplierLogo || "";
    name = supplier.supplierName;
    tagLabel = tagLabelOverride || "Tecnología"; // default category placeholder
    const priceRaw: any = (supplier as any).sponsorPrice;
    const priceNum = typeof priceRaw === 'number' ? priceRaw : parseFloat(priceRaw || '0');
    rightText = showPrice ? `S/ ${priceNum.toFixed(2)}` : '';
  } else {
    const legacy = props as LegacyCartCompanyProps;
    id = legacy.id;
    avatarUrl = legacy.avatarUrl;
    name = legacy.name;
    tagLabel = legacy.tagLabel;
    rightText = legacy.rightText;
  }

  return (
    <div className={getCartCompanyStyles(size, variant)} data-id={id}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar
          src={avatarUrl || ""}
          alt={name || "Company"}
          size={getAvatarSize(size)}
          shape="circle"
        />
        <div className="flex flex-col gap-1 min-w-0 truncate">
          <Text size="base" weight="medium" className="truncate">
            {name}
          </Text>
          <Tag
            text={tagLabel || ""}
            size={getTagSize(size)}
            variant="primary"
            textColor="white"
            weight="bold"
            rounded="md"
          />
        </div>
      </div>
      {/* {rightText && (
        <Text size="base" weight="normal" color="default" className="whitespace-nowrap">
          {rightText}
        </Text>
      )} */}
    </div>
  );
}

export { CartCompany };
export type { CartCompanyProps };