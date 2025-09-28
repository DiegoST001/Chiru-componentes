import React, { useState } from "react";
import { Heading } from "../atoms/Heading";
import { ProductCart, type ProductCartItem } from "../molecules/ProductCart";


type Product = {
    id: number;
    name: string;
    price: number;
    brand?: string;
    imageUrl?: string;
};


function CarListProducts({ products }: { products: Product[] }) {
    // mantener estado local simple para cantidad/selección (puedes conectar a store)
    const [items, setItems] = useState<ProductCartItem[]>(
        products.map((p) => ({ ...p, quantity: 1 }))
    );
    const [selected, setSelected] = useState<Record<string, boolean>>({});

    const handleSelect = (id: ProductCartItem["id"], value: boolean) => {
        setSelected((s) => ({ ...s, [String(id)]: value }));
    };

    const handleQty = (id: ProductCartItem["id"], qty: number) => {
        setItems((it) => it.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
    };

    const handleRemove = (id: ProductCartItem["id"]) => {
        setItems((it) => it.filter((i) => i.id !== id));
    };

    return (
        <div className="w-full">
            <Heading level={2} className="text-2xl font-bold mb-4">
                Carro ({items.length} productos)
            </Heading>

            <div className="space-y-2 md:space-y-4">
                {items.map((p) => (
                    <ProductCart
                        key={p.id}
                        product={p}
                        selected={!!selected[String(p.id)]}
                        onSelect={handleSelect}
                        onQuantityChange={handleQty}
                        onRemove={handleRemove}
                    />
                ))}
            </div>
        </div>
    );
}

export { CarListProducts };