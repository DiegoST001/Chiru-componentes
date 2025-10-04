import React from "react";
import { Button } from "../atoms/Button";
import { Heading } from "../atoms/Heading";

type Product = {
  id: number;
  name: string;
  price: number;
};

type CartSummaryProps = {
  products?: Product[];
  discountsCount?: number;
  discountsTotal?: number;
  cmrSaved?: number;
  cmrTotal?: number;
  className?: string;
  onContinue?: () => void; // <-- nueva prop
};

function formatCurrency(value: number) {
  return `S/ ${value.toFixed(2)}`;
}

function CartSummary({
  products = [],
  discountsCount = 0,
  discountsTotal = 0,
  cmrSaved = 0,
  cmrTotal,
  className,
  onContinue,
}: CartSummaryProps) {
  const safeProducts = products || [];
  const totalItems = safeProducts.length;
  const subtotal = safeProducts.reduce(
    (sum, product) => sum + (product?.price ?? 0),
    0,
  );
  const total = subtotal - (discountsTotal ?? 0);
  const finalWithCmr = cmrTotal ?? total - (cmrSaved ?? 0);
  const navigateToOpenStore = () => {
    const locale =
      (typeof window !== "undefined" &&
        window.location.pathname.split("/")[1]) ||
      "es";
    window.location.href = `/${locale}/docs/dev/ui/templates/abrir-tienda`;
  };

  return (
    <aside className={className}>
            <Heading level={2} className="text-2xl font-bold mb-4">
                Resumen de la orden
            </Heading>
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden w-full">
        
        <div className="p-6">
          {/* <Heading level={2} className="text-xl font-semibold mb-4">
            Resumen de la orden
          </Heading> */}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Productos <span className="text-gray-500">({totalItems})</span>
              </div>
              <div className="text-sm text-gray-800 font-semibold">
                {formatCurrency(subtotal)}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span>Descuentos</span>
                <span className="text-gray-500">({discountsCount})</span>
              </div>
              <div className="text-sm text-green-600 font-medium">
                - {formatCurrency(discountsTotal)}
              </div>
            </div>

            <div className="border-t border-dashed border-gray-200 mt-3 pt-3" />

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">Total:</div>
              <div className="text-sm text-gray-800 font-semibold">
                {formatCurrency(total)}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button
              variant="danger"
              fullWidth
              onClick={() => {
                if (onContinue) return onContinue();
                // fallback (legacy)
                window.location.href =
                  "/es/docs/dev/ui/templates/PurchasingProcess";
              }}
            >
              Continuar compra
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export { CartSummary };
