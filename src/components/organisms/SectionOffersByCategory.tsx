import React from "react";
import { Text } from "../atoms/Text";
import { Button } from "../atoms/Button";
import {
  CartProductPopular,
  type ProductData,
} from "../molecules/CartProductPopular";
import {
  CardCategorieSimple,
  type CategoryData,
} from "../molecules/CardCategorieSimple";

type SectionOffersByCategoryProps = {
  products: ProductData[];
  categories: CategoryData[];
};

function SectionOffersByCategory({
  products,
  categories,
}: SectionOffersByCategoryProps) {
  return (
   <section className="w-full py-10">
  <div className="max-w-6xl mx-auto flex flex-col items-center">
    {/* Título */}
    <div className="text-center mb-8">
      <Text size="xl" weight="bold">Ofertas por categoría</Text>
    </div>

    {/* aquí usamos altura fija para que los hijos puedan usar h-full */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch w-full h-[500px]">
      {/* Columna izquierda: productos */}
      <div className="bg-sky-100 p-4 rounded-lg flex flex-col gap-4 h-full overflow-hidden">
        <div className="flex flex-col gap-2 items-start">
          <Text size="xl" weight="bold">Viva</Text>
          <Text size="sm" color="muted">Tu elección de moda</Text>
          <Button text="Comprar" variant="primary" size="medium" />
        </div>

        {/* la lista de productos ocupa el resto de la altura y hace scroll si hace falta */}
        <div className="flex flex-row gap-4 w-full h-full overflow-auto items-stretch">
          {products.map((product) => (
            <CartProductPopular
              key={product.id}
              dataProduct={product}
              size="medium"
            />
          ))}
        </div>
      </div>

      {/* Columna derecha: categorías */}
      <div className="grid grid-cols-2 gap-2 place-content-center h-full overflow-hidden">
        {categories.map((cat) => (
          <CardCategorieSimple
            key={cat.id}
            dataCategorie={cat}
            size="full"     /* usamos "full" para que la tarjeta sea h-full */
          />
        ))}
      </div>
    </div>
  </div>
</section>



  );
}

export { SectionOffersByCategory };
