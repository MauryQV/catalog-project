import { getCategories, getAllProductsByCategory } from "@/src/app/lib/supabase/queries";
import { notFound } from "next/navigation";
import ProductGridAdmin from "../../components/ProductGridAdmin";
import CategoryEditor from "../../components/CategoryEditor";
import AddProductDialog from "../../components/AddProductDialog";

export default async function CategoryPage({ params }: { params: Promise<{ category_id: string }> }) {
  const { category_id } = await params;
  const categories = await getCategories();

  const category = categories.find((c) => c.id === category_id);

  if (!category) {
    notFound();
  }

  const products = await getAllProductsByCategory(category.slug);

  return (
    <div className="flex flex-col gap-6">
      <CategoryEditor category={category} />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Productos en esta categoría</h2>
          <AddProductDialog categoryId={category.id} />
        </div>
        <ProductGridAdmin products={products} />
      </div>
    </div>
  );
}
