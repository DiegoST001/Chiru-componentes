import React, { useState, useMemo } from "react";
import { CartSummary } from "../organisms/CartSummary";
import { Process } from "../organisms/Process";
import { CarListProducts } from "../organisms/CarLisProducts";
import { Image } from "../atoms/Image";

type SupplierGroup = {
  supplierId: string;
  supplierName: string;
  items: Product[];
};

type Address = {
  id: string;
  label: string;
  street: string;
  city: string;
  default?: boolean;
};

function TemplatePurchasingProcess() {
  type Product = {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
  };
  const initialProducts: Product[] = [
    {
      id: 1,
      name: "Product 1",
      price: 10,
      imageUrl:
        "https://media.falabella.com/falabellaPE/20073386/w=100px,h=100px,q=70,format=webp",
    },
    {
      id: 2,
      name: "Product 2",
      price: 20,
      imageUrl:
        "https://media.falabella.com/falabellaPE/20073386/w=100px,h=100px,q=70,format=webp",
    },
    {
      id: 3,
      name: "Product 3",
      price: 30,
      imageUrl:
        "https://media.falabella.com/falabellaPE/20073386/w=100px,h=100px,q=70,format=webp",
    },
    {
      id: 4,
      name: "Product 1",
      price: 10,
      imageUrl:
        "https://media.falabella.com/falabellaPE/20073386/w=100px,h=100px,q=70,format=webp",
    },
    {
      id: 5,
      name: "Product 2",
      price: 20,
      imageUrl:
        "https://media.falabella.com/falabellaPE/20073386/w=100px,h=100px,q=70,format=webp",
    },
    {
      id: 6,
      name: "Product 3",
      price: 30,
      imageUrl:
        "https://media.falabella.com/falabellaPE/20073386/w=100px,h=100px,q=70,format=webp",
    },
    {
      id: 7,
      name: "Product 1",
      price: 10,
      imageUrl:
        "https://media.falabella.com/falabellaPE/20815653/w=100px,h=100px,q=70,format=webp",
    },
    {
      id: 8,
      name: "Product 2",
      price: 20,
      imageUrl:
        "https://media.falabella.com/falabellaPE/20815653/w=100px,h=100px,q=70,format=webp",
    },
    {
      id: 9,
      name: "Product 3",
      price: 30,
      imageUrl:
        "https://media.falabella.com/falabellaPE/20815653/w=100px,h=100px,q=70,format=webp",
    },
    {
      id: 10,
      name: "Product 1",
      price: 10,
      imageUrl:
        "https://media.falabella.com/falabellaPE/20073386/w=100px,h=100px,q=70,format=webp",
    },
    {
      id: 11,
      name: "Product 2",
      price: 20,
      imageUrl:
        "https://media.falabella.com/falabellaPE/20073386/w=100px,h=100px,q=70,format=webp",
    },
    {
      id: 12,
      name: "Product 3",
      price: 30,
      imageUrl:
        "https://media.falabella.com/falabellaPE/20073386/w=100px,h=100px,q=70,format=webp",
    },
  ];

  const steps = ["Carro", "Envío", "Pago"];
  const [currentStep, setCurrentStep] = useState<number>(1); // empieza en 1 (Envío)

  // Panel de pago (placeholder, reemplaza con tu componente real)
  function PaymentPanel() {
    return (
      <div className="w-full bg-white rounded-lg border border-gray-100 p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Elije tu metodo de pago</h3>
        <div className="space-y-3">
          <div className="p-4 rounded-md border border-gray-200 flex items-center justify-between">
            <div>
              <div className="font-medium">Tarjeta CMR</div>
              <div className="text-sm text-gray-500">Paga en cuotas</div>
            </div>
            <button className="text-sm bg-indigo-600 text-white px-3 py-1 rounded">
              Seleccionar
            </button>
          </div>
          <div className="p-4 rounded-md border border-gray-200 flex items-center justify-between">
            <div>
              <div className="font-medium">Tarjeta de crédito</div>
              <div className="text-sm text-gray-500">Visa / MasterCard</div>
            </div>
            <button className="text-sm bg-indigo-600 text-white px-3 py-1 rounded">
              Agregar
            </button>
          </div>
          {/* Agrega aquí tu formulario para "Agregar tarjeta" */}
        </div>
      </div>
    );
  }

  // cuando se presiona "Continuar compra" en CartSummary
  const handleContinue = () => {
    // avanzar al paso de pago
    setCurrentStep(2);
  };

  const locale =
    typeof window !== "undefined"
      ? window.location.pathname.split("/")[1] || "es"
      : "es";
  const stepLinks = [
    `/${locale}/docs/dev/ui/templates/carView`,
    undefined,
    undefined,
  ];

  const handleStepClick = (index: number) => {
    const href = stepLinks?.[index];
    if (href && typeof window !== "undefined") {
      window.location.href = href;
      return;
    }
    setCurrentStep(index);
  };

  // mock direcciones del usuario (traer desde servicio real)
  const [addresses] = useState<Address[]>(
    [
      { id: "a1", label: "Casa", street: "Av. Principal 123", city: "Lima", default: true },
      { id: "a2", label: "Oficina", street: "Calle Secundaria 456", city: "Lima" },
    ]
  );

  // estado: address seleccionado por proveedor (supplierId -> addressId)
  const [selectedAddressBySupplier, setSelectedAddressBySupplier] = useState<Record<string, string>>({});

  // Ejemplo: productos con supplier (usa tu payload real desde API)
  const productsWithSupplier: Product[] = initialProducts.map((p, i) => ({
    ...p,
    // mock: alternar proveedor para demo
    supplierId: `s${(i % 3) + 1}`,
    supplierName: `Proveedor ${(i % 3) + 1}`,
  }));

  // agrupar productos por proveedor
  const groups: SupplierGroup[] = useMemo(() => {
    const map = new Map<string, SupplierGroup>();
    for (const it of productsWithSupplier) {
      const sid = (it as any).supplierId as string;
      const sname = (it as any).supplierName as string;
      const g = map.get(sid) ?? { supplierId: sid, supplierName: sname, items: [] };
      g.items.push(it);
      map.set(sid, g);
    }
    return Array.from(map.values());
  }, [productsWithSupplier]);

  // seleccionar dirección por proveedor (se puede guardar en backend / carrito)
  const handleSelectAddress = (supplierId: string, addressId: string) => {
    setSelectedAddressBySupplier((s) => ({ ...s, [supplierId]: addressId }));
    // opcional: llamar servicio para asignar dirección a items de ese proveedor
    // await ShippingService.assignAddressToSupplier(userId, supplierId, addressId)
  };

  // helper: obtener dirección seleccionada (fallback a default)
  const getAddressForSupplier = (supplierId: string) => {
    const addrId = selectedAddressBySupplier[supplierId];
    if (addrId) return addresses.find((a) => a.id === addrId);
    return addresses.find((a) => a.default) ?? addresses[0];
  };

  // Left panel: render por proveedor con selector de dirección
  function LeftPanelBySupplier() {
    return (
      <div className="space-y-6">
        {groups.map((g) => {
          const selectedAddr = getAddressForSupplier(g.supplierId);
          return (
            <section key={g.supplierId} className="bg-white rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">{g.supplierName}</h4>
                <div className="text-sm text-gray-600">Orden {g.supplierId}</div>
              </div>

              <div className="flex items-center gap-4 mb-3">
                <div className="text-sm">
                  <div className="font-semibold">Dirección:</div>
                  <div className="text-gray-600">{selectedAddr ? `${selectedAddr.label} — ${selectedAddr.street}` : "Sin dirección"}</div>
                </div>

                {/* AddressSelector: puedes separar a un componente */}
                <div>
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={selectedAddressBySupplier[g.supplierId] ?? getAddressForSupplier(g.supplierId)?.id}
                    onChange={(e) => handleSelectAddress(g.supplierId, e.target.value)}
                  >
                    {addresses.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.label} — {a.street}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {g.items.map((it) => (
                  <div key={it.id} className="flex items-center gap-4">
                    <img src={it.imageUrl} alt={it.name} className="w-12 h-12 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{it.name}</div>
                      <div className="text-sm text-gray-500">S/ {it.price.toFixed(2)}</div>
                    </div>
                    <div className="text-sm text-gray-600">x1</div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    );
  }

  // usa LeftPanelBySupplier en vez de CarListProducts cuando quieras mostrar por proveedor
  const leftPanel = currentStep === 1 ? <LeftPanelBySupplier /> : <PaymentPanel />;

  return (
    <main className="w-full px-4 mx-auto py-8 flex flex-col gap-8  bg-gray-100">
      <div className="flex items-center justify-end mx-auto w-full max-w-7xl" >
        <Image
          src="/chiru_logo_full.svg"
          alt="Chiru Logo"
          fit="contain"
          className="h-10 lg:h-12 w-auto"
          href="/es/home"
        />
      </div>

      <article className="w-full md:max-w-4/5 mx-auto text-center space-y-8 ">
        <div className="w-full max-w-4xl mx-auto">
          <Process
            steps={steps}
            current={currentStep}
            onStepClick={handleStepClick}
            stepLinks={stepLinks}
          />
        </div>

        <section className="w-full  flex flex-col xl:flex-row gap-8">
          <div className="flex-1">{leftPanel}</div>
          <CartSummary
            products={initialProducts}
            className="w-full xl:max-w-xs"
            onContinue={handleContinue}
          />
        </section>
      </article>
    </main>
  );
}

export { TemplatePurchasingProcess };
