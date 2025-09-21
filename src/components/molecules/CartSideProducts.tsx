import React from "react";
import { cntl } from "@/utils/cntl";
import { Image } from "@/components/atoms/Image";
import { Text } from "@/components/atoms/Text";
import { Link } from "@/components/atoms/Link";

type SideProduct = {
  imageUrl: string;
  title: string;
  leftLink?: { label: string; href: string };
  rightLink?: { label: string; href: string };
};

type CartSideProductsProps = {
  title: string;
  items: SideProduct[];

  width?: number;        
  cardMinHeight?: number;   
  imageWidth?: number;      
  imageHeight?: number;     
  topPadding?: number;     

  className?: string;
};

function CartSideProducts({
  title,
  items,
  width = 160,
  cardMinHeight = 230,
  imageWidth = 100,
  imageHeight = 140,
  topPadding = 10,
  className,
}: CartSideProductsProps) {
  return (
    <aside className={cntl`flex flex-col gap-2 ${className || ""}`} style={{ width }}>
      <Text className="text-xl font-semibold">{title}</Text>

      {items.map((p, i) => (
        <div
          key={i}
          className={cntl`
            rounded-md border border-gray-200 bg-white shadow-sm
            px-2 pb-2
            flex flex-col items-center
          `}
          style={{ minHeight: cardMinHeight, paddingTop: topPadding }}
        >
          <div
            className="rounded-md bg-gray-200 overflow-hidden"
            style={{ width: imageWidth, height: imageHeight }}
          >
            <Image
              src={p.imageUrl}
              alt={p.title}
              radius="none"
              fit="cover"
              className="w-full h-full"
            />
          </div>

          <Text className="mt-2 text-center">{p.title}</Text>

          <div className="mt-2 w-full flex items-center justify-between text-xs">
            {p.leftLink ? (
              <Link href={p.leftLink.href} underline className="truncate">{p.leftLink.label}</Link>
            ) : (
              <span className="opacity-0">.</span>
            )}
            {p.rightLink ? (
              <Link href={p.rightLink.href} underline className="truncate">{p.rightLink.label}</Link>
            ) : (
              <span className="opacity-0">.</span>
            )}
          </div>
        </div>
      ))}
    </aside>
  );
}

export { CartSideProducts };
export type { CartSideProductsProps, SideProduct };
