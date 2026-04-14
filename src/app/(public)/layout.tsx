import { getCategories } from "../lib/supabase/queries";
import { createClient } from "../lib/supabase/server";
import Sidebar from "../components/layout/Sidebar";
import MobileNav from "../components/layout/MobileNav";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = !!user;

  return (
    <div className="flex min-h-screen">
      <Sidebar categories={categories} isAdmin={isAdmin} />
      <div className="flex-1 flex flex-col">
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b">
          <span className="font-semibold text-lg">Mi Catálogo</span>
          <MobileNav categories={categories} isAdmin={isAdmin} />
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
