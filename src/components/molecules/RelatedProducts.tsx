import React from "react";
import { cntl } from "@/utils/cntl";
import { Image } from "@/components/atoms/Image";
import { Text } from "@/components/atoms/Text";
import { Paragraph } from "@/components/atoms/Paragraph";

export type RelatedProduct = {
  imageUrl: string;
  title: string;
  price: number;
  currency?: string;        
  description?: string;
};

type RelatedProductsProps = {
  items: RelatedProduct[];
  minColWidth?: number;        
  gap?: number;                
  className?: string;
};

function cardCls() {
  return cntl`bg-white rounded-md shadow-sm overflow-hidden border`;
}

function RelatedProducts({
  items,
  minColWidth = 180,
  gap = 16,
  className,
}: RelatedProductsProps) {
  return (
    <div
      className={cntl`grid ${className || ""}`}
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${minColWidth}px, 1fr))`,
        gap,
      }}
    >
      {items.map((p, i) => (
        <article key={i} className={cardCls()}>
          <div className="relative w-full bg-gray-300" style={{ aspectRatio: "1 / 1" }}>
            <Image
              src={p.imageUrl}
              alt={p.title}
              fit="cover"
              radius="none"
              className="absolute inset-0 w-full h-full"
            />
          </div>

          <div className="p-3">
            <Text className="font-semibold">{p.title}</Text>
            <Text weight="bold" className="mt-1">
              {(p.currency ?? "S/.")} {p.price.toFixed(2)}
            </Text>
            {p.description && (
              <Paragraph variant="muted" size="small" leading="relaxed" className="mt-2">
                {p.description}
              </Paragraph>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

export { RelatedProducts };
export type { RelatedProductsProps };
