import type { Product } from "@/src/types";
import ProductCardAdmin from "./ProductCardAdmin";

export default function ProductGridAdmin({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="text-gray-400 text-sm mt-8 text-center">
        No hay productos en esta categoría.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCardAdmin key={product.id} product={product} />
      ))}
    </div>
  )
}
