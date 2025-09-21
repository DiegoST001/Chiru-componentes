import { CartProduct, type ProductCard } from "../molecules/CartProduct";

type ProductsFlexProps = {
  products: ProductCard[];
};

function ProductFlex({ products }: ProductsFlexProps) {
  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {products.map((product) => (
        <CartProduct key={product.id} product={product} />
      ))}
    </section>
  );
}

export default ProductFlex;