import React from "react";
import { cntl } from "@/utils/cntl";
import { Link } from "@/components/atoms/Link";
import { Text } from "@/components/atoms/Text";

type Crumb = {
  label: string;
  href?: string; 
};

type BreadcrumbsProps = {
  items: Crumb[];
  separator?: string;
  className?: string;
};

function Breadcrumbs({ items, separator = "/", className }: BreadcrumbsProps) {
  const wrap = cntl`w-full`;
  const list = cntl`flex items-center gap-2 text-sm`;
  const sep  = cntl`text-gray-400 select-none`;

  return (
    <nav aria-label="Breadcrumb" className={`${wrap} ${className || ""}`}>
      <ol className={list}>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className="flex items-center gap-2 min-w-0">
              {item.href && !isLast ? (
                <Link href={item.href} underline={false} className="text-gray-600 hover:text-gray-900 truncate">
                  {item.label}
                </Link>
              ) : (
                <Text className="font-semibold text-gray-900 truncate">{item.label}</Text>
              )}
              {!isLast && <span className={sep}>{separator}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export { Breadcrumbs };
export type { BreadcrumbsProps, Crumb };
