import React from "react";
import { Switch } from "../atoms/Switch";
import { Text } from "../atoms/Text";

export type FreeShippingToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function FreeShippingToggle({ checked, onChange }: FreeShippingToggleProps) {
  return (
    <div className="flex items-center gap-3 p-2 rounded">
      <Switch checked={checked} onChange={onChange} />
      <Text size="base" weight="bold" color="default">Shipping</Text>
      <Text size="base" weight="bold" style={{ color: '#22c55e' }}>FREE</Text>
    </div>
  );
}

export { FreeShippingToggle };
