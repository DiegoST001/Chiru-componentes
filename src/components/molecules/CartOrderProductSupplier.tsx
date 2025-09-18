import React from "react";
import { Icon } from "../atoms/Icon";
import { User, CalendarBlank } from "phosphor-react";
import { Text } from "../atoms/Text";
import { Button } from "../atoms/Button";
import { Select } from "../atoms/Select";
import { Image } from "../atoms/Image";
import { Label } from "../atoms/Label";
import { HelperText } from "../atoms/HelperText";

type ProductInfo = {
  imageUrl: string;
  title: string;
  subtitle: string;
  price: string;
};

type CartOrderProductSupplierProps = {
  id: string | number;
  selectLabel?: string;
  selectOptions?: { value: string; label: string }[];
  buttonText?: string;
  productInfo: ProductInfo;
};

export function CartOrderProductSupplier({
  id,
  selectLabel = "text:",
  selectOptions = [{ value: "texto", label: "texto" }],
  buttonText = "text",
  productInfo,
}: CartOrderProductSupplierProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6 w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon tamano="small" variant="default">
            <CalendarBlank />
          </Icon>
          <Text size="md" weight="bold">#{id}</Text>
          <Text size="sm" color="muted">text</Text>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Text size="sm" weight="bold" className="mr-2">{selectLabel}</Text>
        <Select options={selectOptions} size="sm" />
        <Button size="small" variant="primary" text={buttonText} />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Icon tamano="small" variant="default">
          <User />
        </Icon>
        <Text size="sm" color="muted">text:</Text>
      </div>

      <div className="relative flex bg-gray-50 rounded-lg p-3 items-center gap-3 min-h-[120px]">
        <Image
          src={productInfo.imageUrl}
          alt="ProductImage"
          width={100}
          height={100}
          className="rounded-md object-cover bg-gray-200"
        />
        <div className="flex flex-col min-w-0">
          <Text size="md" weight="semibold">{productInfo.title}</Text>
          <HelperText>{productInfo.subtitle}</HelperText>
          <Text size="md" weight="bold" color="primary">{productInfo.price}</Text>
        </div>
        </div>
      </div>
  );
}