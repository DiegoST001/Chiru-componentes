import React from "react";
import { Button } from "../atoms/Button";
import { Icon } from "../atoms/Icon";
import { ShoppingCart, ChatCircle, Flag } from "phosphor-react";

export type ProductActionsProps = {
  onBuy?: () => void;
  onContact?: () => void;
  onReport?: () => void;
  disabledBuy?: boolean;
  disabledContact?: boolean;
};

function ProductActions({
  onBuy,
  onContact,
  onReport,
  disabledBuy = false,
  disabledContact = false,
}: ProductActionsProps) {
  return (
    <div className="flex items-center gap-1 md:gap-4 w-full ">
      <Button
        variant="primary"
        size="medium"
        text="Comprar"
        icon={<ShoppingCart />}
        positionIcon="left"
        onClick={onBuy}
        disabled={disabledBuy}
      />
      <Button
        variant="secondary"
        size="medium"
        text="Contactar"
        icon={<ChatCircle />}
        positionIcon="left"
        onClick={onContact}
        disabled={disabledContact}
      />
      <button
        type="button"
        className="ml-2 p-2 rounded-full hover:bg-gray-100"
        onClick={onReport}
        aria-label="Reportar producto"
      >
        <Icon tamano="medium" variant="danger">
          <Flag weight="fill" />
        </Icon>
      </button>
    </div>
  );
}

export { ProductActions };