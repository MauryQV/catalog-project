import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

export default function AppLayout({ children, categories, isAdmin }: { children: React.ReactNode, categories: any[], isAdmin: boolean }) {
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
