import React from "react";
import { cntl } from "@/utils/cntl";
import { Image } from "@/components/atoms/Image";
import { Text } from "@/components/atoms/Text";
import { Paragraph } from "@/components/atoms/Paragraph";
import { Button } from "@/components/atoms/Button";

export type OrderPreview = {
  imageUrl: string;
  title: string;
  subtitle: string;
  price: number;
  currency?: string; 
};

export type OrderRow = {
  selectLabel?: string;       
  selectValue: string;
  selectOptions: string[];
  preview: OrderPreview;
};

export type FilterItem =
  | { type: "input"; value: string; placeholder?: string }
  | { type: "select"; value: string; options: string[]; placeholder?: string };

type OrdersListProps = {
  filters: [FilterItem, FilterItem, FilterItem];
  onFilterChange?: (index: number, value: string) => void;
  onTopActionClick?: () => void; 

  items: OrderRow[];
  onSelectChange?: (index: number, value: string) => void;
  onRowButtonClick?: (index: number) => void;

  onFooterSecondary?: () => void;
  onFooterPrimary?: () => void;

  className?: string;
};

const cls = {
  wrap: (extra?: string) => cntl`space-y-6 ${extra || ""}`,
  card: cntl`rounded-xl border bg-white shadow-sm`,
  header: cntl`flex items-center justify-between p-4`,
  controls: cntl`px-4 pb-4`,
  divider: cntl`border-t`,
  preview: cntl`p-4`,
};

function FiltersBar({
  filters,
  onFilterChange,
  onTopActionClick,
}: {
  filters: OrdersListProps["filters"];
  onFilterChange?: OrdersListProps["onFilterChange"];
  onTopActionClick?: OrdersListProps["onTopActionClick"];
}) {
  return (
    <div className="grid grid-cols-12 gap-4">
      {filters.map((f, i) => (
        <div key={i} className="col-span-3">
          {f.type === "input" ? (
            <input
              className="w-full rounded-md border px-3 py-2"
              value={f.value}
              placeholder={f.placeholder || "Text-Title"}
              onChange={(e) => onFilterChange?.(i, e.target.value)}
            />
          ) : (
            <select
              className="w-full rounded-md border px-3 py-2 bg-white"
              value={f.value}
              onChange={(e) => onFilterChange?.(i, e.target.value)}
            >
              {f.options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          )}
        </div>
      ))}

      <div className="col-span-3 flex justify-end">
        <Button variant="primary" size="medium" text="text" onClick={onTopActionClick} />
      </div>
    </div>
  );
}

function OrdersList({
  filters,
  onFilterChange,
  onTopActionClick,
  items,
  onSelectChange,
  onRowButtonClick,
  onFooterSecondary,
  onFooterPrimary,
  className,
}: OrdersListProps) {
  return (
    <section className={cls.wrap(className)}>
      <FiltersBar
        filters={filters}
        onFilterChange={onFilterChange}
        onTopActionClick={onTopActionClick}
      />

      {items.map((item, idx) => {
        const priceText = `${item.preview.currency ?? "S/."} ${item.preview.price.toFixed(2)}`;

        return (
          <article key={idx} className={cls.card}>
            <header className={cls.header}>
              <div className="flex items-center gap-2">
                <Text className="font-semibold">#{idx}</Text>
                <Paragraph variant="muted" size="small">text</Paragraph>
              </div>
              <div className="flex items-center gap-2">
                <Paragraph variant="muted" size="small">text</Paragraph>
              </div>
            </header>

            <div className={cls.controls}>
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-700">{item.selectLabel ?? "text"}:</label>

                <select
                  className="appearance-none text-sm border rounded-md px-3 py-2 bg-white"
                  value={item.selectValue}
                  onChange={(e) => onSelectChange?.(idx, e.target.value)}
                >
                  {item.selectOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>

                <Button
                  variant="primary"
                  size="small"
                  text="text"
                  onClick={() => onRowButtonClick?.(idx)}
                />
              </div>

              <div className="mt-3">
                <Paragraph variant="muted" size="small">text:</Paragraph>
              </div>
            </div>

            <div className={cls.divider} />
            <div className={cls.preview}>
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="w-[100px] h-[100px] rounded-md bg-gray-100 overflow-hidden">
                    <Image
                      src={item.preview.imageUrl}
                      alt={item.preview.title}
                      radius="none"
                      fit="cover"
                      className="w-full h-full"
                    />
                  </div>

                  <div className="min-w-0">
                    <Text className="font-semibold">{item.preview.title}</Text>
                    <Paragraph variant="muted" size="small" className="mt-0.5">
                      {item.preview.subtitle}
                    </Paragraph>
                    <Text weight="bold" className="mt-1">
                      {priceText}
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </article>
        );
      })}

      <div className="flex items-center justify-end gap-3">
        <Button variant="secondary" size="small" text="text" onClick={onFooterSecondary} />
        <Button variant="danger" size="small" text="text" onClick={onFooterPrimary} />
      </div>
    </section>
  );
}

export { OrdersList };
export type { OrdersListProps };
