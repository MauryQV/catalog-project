import ProductCard from "./ProductCard";
import type { Product } from "../../../types/index";

type Props = {
  products: Product[];
  isAdmin?: boolean; 
}

export default function ProductGrid({ products, isAdmin = false }: Props) {
  if (products.length === 0) {
    return <p className="text-gray-400 text-sm mt-8 text-center">No hay productos en esta categoría.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}