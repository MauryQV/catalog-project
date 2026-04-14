import { getCategories } from "../../lib/supabase/queries";
import { createClient } from "../../lib/supabase/server";
import Sidebar from "@/components/admin/Sidebar";
import MobileNav from "@/components/admin/MobileNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Si NO está autenticado, NO muestra el layout de admin, solo renderiza el hijo (el login form)
    return <>{children}</>;
  }

  const categories = await getCategories();

  // Si SÍ está autenticado, muestra el layout de admin
  return (
    <div className="flex min-h-screen relative">
      <Sidebar categories={categories} isAdmin={true} />
      <div className="flex-1 flex flex-col">
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b">
          <span className="font-semibold text-lg">Panel de Administración</span>
          <MobileNav categories={categories} isAdmin={true} />
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
