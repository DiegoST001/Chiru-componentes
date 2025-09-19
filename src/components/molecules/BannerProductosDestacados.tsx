import React from "react";
import { Heading } from "../atoms/Heading";
import { CartProduct } from "./CartProduct";
import { cntl } from "@/utils/cntl";

interface ProductoData {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  discount?: number;
  brand?: string;
}

interface BannerProductosDestacadosProps {
  title?: string;
  productos?: ProductoData[];
  columns?: 2 | 3 | 4 | 5;
  cardSize?: "small" | "medium" | "large";
  showTitle?: boolean;
  className?: string;
}

/**
 * BannerProductosDestacados - Grid de productos destacados
 * 
 * Componente molécula que muestra una lista/grid de productos destacados.
 * Cada producto usa el componente CartProduct para mantener consistencia.
 * Ideal para secciones de productos recomendados, ofertas especiales o catálogo.
 */
function BannerProductosDestacados({
  title = "Productos Destacados",
  productos = [
    {
      id: "prod1",
      name: "Smartphone Galaxy Pro",
      price: 899.99,
      description: "Smartphone de última generación con cámara profesional y pantalla AMOLED de 6.7 pulgadas.",
      imageUrl: "https://promart.vteximg.com.br/arquivos/ids/8819728-1000-1000/160569.jpg?v=638826698074400000",
      discount: 15,
      brand: "Samsung"
    },
    {
      id: "prod2", 
      name: "Laptop Gaming Elite",
      price: 1299.99,
      description: "Laptop gaming con procesador Intel i7, 16GB RAM y tarjeta gráfica RTX 4060.",
      imageUrl: "https://promart.vteximg.com.br/arquivos/ids/8819728-1000-1000/160569.jpg?v=638826698074400000",
      discount: 20,
      brand: "ASUS"
    },
    {
      id: "prod3",
      name: "Auriculares Premium",
      price: 199.99,
      description: "Auriculares inalámbricos con cancelación de ruido activa y batería de 30 horas.",
      imageUrl: "https://promart.vteximg.com.br/arquivos/ids/8819728-1000-1000/160569.jpg?v=638826698074400000",
      discount: 25,
      brand: "Sony"
    },
    {
      id: "prod4",
      name: "Smart TV 55' OLED",
      price: 799.99,
      description: "Smart TV OLED 4K con HDR10+ y sistema operativo Android TV integrado.",
      imageUrl: "https://promart.vteximg.com.br/arquivos/ids/8819728-1000-1000/160569.jpg?v=638826698074400000",
      discount: 30,
      brand: "LG"
    },
    {
      id: "prod5",
      name: "Tablet Pro 12.9",
      price: 599.99,
      description: "Tablet profesional con pantalla Liquid Retina de 12.9 pulgadas y chip M2.",
      imageUrl: "https://promart.vteximg.com.br/arquivos/ids/8819728-1000-1000/160569.jpg?v=638826698074400000",
      discount: 10,
      brand: "Apple"
    },
    {
      id: "prod6",
      name: "Reloj Inteligente",
      price: 299.99,
      description: "Reloj inteligente con GPS, monitor de salud y resistencia al agua hasta 50m.",
      imageUrl: "https://promart.vteximg.com.br/arquivos/ids/8819728-1000-1000/160569.jpg?v=638826698074400000",
      discount: 15,
      brand: "Garmin"
    },
    {
      id: "prod7",
      name: "Cámara Mirrorless",
      price: 1099.99,
      description: "Cámara mirrorless de 24.3MP con lente intercambiable y grabación 4K.",
      imageUrl: "https://promart.vteximg.com.br/arquivos/ids/8819728-1000-1000/160569.jpg?v=638826698074400000",
      discount: 18,
      brand: "Canon"
    },
    {
      id: "prod8",
      name: "Consola Gaming",
      price: 499.99,
      description: "Consola de videojuegos de nueva generación con SSD ultrarrápido y gráficos 4K.",
      imageUrl: "https://promart.vteximg.com.br/arquivos/ids/8819728-1000-1000/160569.jpg?v=638826698074400000",
      discount: 12,
      brand: "PlayStation"
    }
  ],
  columns = 4,
  cardSize = "medium",
  showTitle = true,
  className
}: BannerProductosDestacadosProps) {

  const containerClasses = cntl`
    w-full
    ${className || ""}
  `;

  const gridClasses = cntl`
    grid gap-4 w-full
    ${columns === 2 ? "grid-cols-1 sm:grid-cols-2" : ""}
    ${columns === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : ""}
    ${columns === 4 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : ""}
    ${columns === 5 ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : ""}
  `;

  return (
    <div className={containerClasses}>
      {/* Título */}
      {showTitle && title && (
        <div className="mb-8">
          <Heading level={2} className="text-center">
            {title}
          </Heading>
        </div>
      )}

      {/* Grid de productos */}
      <div className={gridClasses}>
        {productos.map((producto) => (
          <div key={producto.id} className="w-full">
            <CartProduct
              size={cardSize}
              product={{
                id: producto.id,
                name: producto.name,
                price: producto.price,
                description: producto.description,
                imageUrl: producto.imageUrl,
                discount: producto.discount,
                brand: producto.brand
              }}
              className="h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export { BannerProductosDestacados };
export type { BannerProductosDestacadosProps, ProductoData };