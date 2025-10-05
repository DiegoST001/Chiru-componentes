import React from "react";
import { cntl } from "@/utils/cntl";
import { Text } from "@/components/atoms/Text";
import { Icon } from "@/components/atoms/Icon";
import { CaretRight } from "phosphor-react";

type SidebarProps = {
  title?: string;
  items: SidebarItemData[];
  className?: string;
};

type SidebarItemData = {
  text: string;
  onClick?: () => void;
  isActive?: boolean;
};

function getSidebarStyles() {
  return cntl`
    w-full max-w-xs bg-white border border-gray-200 rounded-lg overflow-hidden
  `;
}

function getTitleStyles() {
  return cntl`
    px-4 py-3 bg-gray-50 border-b border-gray-200
  `;
}

function getItemsContainerStyles() {
  return cntl`
    divide-y divide-gray-100
  `;
}

function getItemStyles(isActive?: boolean) {
  return cntl`
    flex items-center justify-between px-4 py-3 cursor-pointer
    transition-colors duration-150
    hover:bg-gray-50
    ${isActive ? "bg-red-50 border-r-2 border-red-500" : ""}
  `;
}

function getItemTextStyles(isActive?: boolean) {
  return cntl`
    flex-1 text-left
    ${isActive ? "text-red-600 font-medium" : "text-gray-700"}
  `;
}

function Sidebar({
  title,
  items,
  className,
}: SidebarProps) {

  const handleItemClick = (item: SidebarItemData) => {
    item.onClick?.();
  };

  return (
    <div className={cntl`${getSidebarStyles()} ${className || ""}`}>
      {/* Título opcional */}
      {title && (
        <div className={getTitleStyles()}>
          <Text size="base" weight="semibold" color="default">
            {title}
          </Text>
        </div>
      )}

      {/* Lista de elementos */}
      <div className={getItemsContainerStyles()}>
        {items.map((item, index) => (
          <div
            key={index}
            className={getItemStyles(item.isActive)}
            onClick={() => handleItemClick(item)}
          >
            <Text className={getItemTextStyles(item.isActive)}>
              {item.text}
            </Text>
            
            <Icon tamano="small" variant={item.isActive ? "danger" : "default"}>
              <CaretRight weight="bold" />
            </Icon>
          </div>
        ))}
      </div>
    </div>
  );
}

export { Sidebar };
export type { SidebarProps, SidebarItemData };