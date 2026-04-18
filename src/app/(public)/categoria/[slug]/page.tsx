import { getProductsByCategory } from "../../../lib/supabase/queries";
import ProductGrid from "../../../components/catalog/ProductGrid";
import { createClient } from "../../../lib/supabase/server";
import Image from "next/image";
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = await getProductsByCategory(slug);
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).single();
  return (
    <div>
      <Image
        src={data?.public_url ?? `/background.jpg`}
        alt="Fondo"
        width={1500}
        height={1500}
        className="bottom-0 fixed inset-0 h-full w-full -z-10 opacity-100 brightness-60 object-cover"
      />
      <ProductGrid products={products} />
    </div>
  );
}
