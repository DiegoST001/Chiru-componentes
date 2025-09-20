import React from "react";
import { Text } from "../atoms/Text";

type FooterParagraphInlineProps = {
  title: string;
  items: { label: string; href: string }[];
};

export function FooterParagraphInline({ title, items }: FooterParagraphInlineProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Título */}
      <Text size="base" weight="bold" color="default">
        {title}
      </Text>

      {/* Párrafo con enlaces separados por comas */}
      <p className="text-sm text-gray-800">
        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            <a href={item.href} className="hover:underline">
              {item.label}
            </a>
            {idx < items.length - 1 && ", "}
          </React.Fragment>
        ))}
      </p>
    </div>
  );
}
