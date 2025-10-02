import React from "react";
import { Text } from "@/components/atoms/Text";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { Check, DotsThreeVertical } from "phosphor-react";
import type { ProductCard } from "./CartProduct";
import { ActionDropdown } from "./ActionDropdown";

type ProductListItemProps = {
  product: ProductCard;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  onAction: (productId: string, action: string) => void;
  className?: string;
};

export function ProductListItem({
  product,
  isMenuOpen,
  onMenuToggle,
  onAction,
  className = "",
}: ProductListItemProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(value);
  };

  return (
    <div
      className={`flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow ${className}`}
    >
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-16 h-16 object-cover rounded-md flex-shrink-0 bg-gray-100"
      />
      <div className="flex-1 min-w-0">
        <Text size="base" weight="bold" className="truncate text-gray-800">
          {product.name}
        </Text>
        <Text size="sm" color="muted" className="truncate">
          {product.description}
        </Text>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="success" size="small">
            <Icon tamano="small">
              <Check />
            </Icon>
            <Text size="xs" className="ml-1">
              Disponible
            </Text>
          </Badge>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-right">
          <Text size="sm" color="muted">
            {product.brand}
          </Text>
          <Text size="lg" weight="bold" color="default">
            {formatCurrency(product.price)}
          </Text>
        </div>

        <div className="relative">
          <Button
            variant="outline"
            size="small"
            onClick={onMenuToggle}
            className={`p-1 transition-colors ${
              isMenuOpen ? "bg-gray-100" : "bg-white hover:bg-gray-50"
            } border border-gray-200`}
          >
            <Icon tamano="small" className="text-gray-800">
              <DotsThreeVertical weight="bold" />
            </Icon>
          </Button>

          <ActionDropdown
            isOpen={isMenuOpen}
            onClose={onMenuToggle}
            onActionSelect={(action) => onAction(product.id, action)}
          />
        </div>
      </div>
    </div>
  );
}
