import { getProducts } from "@/src/app/lib/supabase/queries";
import { createClient } from "@/src/app/lib/supabase/server"; // <-- 1. Importamos el cliente de servidor
import ProductGrid from "@/src/app/components/catalog/ProductGrid";
import Image from "next/image";
export default async function Page() {
  const products = await getProducts();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAdmin = !!user;

  return (
    <div>
      <Image
        src="/background.jpg"
        alt="Fondo"
        width={1500}
        height={1500}
        className="fixed inset-0 h-full w-full -z-10 opacity-100 brightness-60 object-cover"
      />
      <ProductGrid products={products} isAdmin={isAdmin} />
    </div>
  );
}
