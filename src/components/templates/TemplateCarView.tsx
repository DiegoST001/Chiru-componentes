import React from "react";
import { CarListProducts } from "../organisms/CarLisProducts";
import { CartSummary } from "../organisms/CartSummary";
type Product = {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
};
const initialProducts: Product[] = [
    { id: 1, name: "Product 1", price: 10, imageUrl: "https://via.placeholder.com/150" },
    { id: 2, name: "Product 2", price: 20, imageUrl: "https://via.placeholder.com/150" },
    { id: 3, name: "Product 3", price: 30, imageUrl: "https://via.placeholder.com/150" },
    { id: 4, name: "Product 1", price: 10, imageUrl: "https://via.placeholder.com/150" },
    { id: 5, name: "Product 2", price: 20, imageUrl: "https://via.placeholder.com/150" },
    { id: 6, name: "Product 3", price: 30, imageUrl: "https://via.placeholder.com/150" },
    { id: 7, name: "Product 1", price: 10, imageUrl: "https://via.placeholder.com/150" },
    { id: 8, name: "Product 2", price: 20, imageUrl: "https://via.placeholder.com/150" },
    { id: 9, name: "Product 3", price: 30, imageUrl: "https://via.placeholder.com/150" },
    { id: 10, name: "Product 1", price: 10, imageUrl: "https://via.placeholder.com/150" },
    { id: 11, name: "Product 2", price: 20, imageUrl: "https://via.placeholder.com/150" },
    { id: 12, name: "Product 3", price: 30, imageUrl: "https://via.placeholder.com/150" },
];

function TemplateCarView() {
  return (
    // px-4 sm:px-6 lg:px-8

    <main className="w-full px-4 md:max-w-4/5 mx-auto flex flex-col xl:flex-row gap-8 my-8">
      <CarListProducts products={initialProducts} />
      <CartSummary products={initialProducts} className="w-full  xl:w-1/2 xl:min-w-[350px]" />
    </main>
  );
}

export { TemplateCarView };
