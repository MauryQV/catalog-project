import Link from "next/link";
import type { Category } from "@/src/types/index";
import LogoutButton from "@/src/app/admin/LoggoutButton";

type Props = {
  categories: Category[];
  isAdmin: boolean;
};

export default function Sidebar({ categories, isAdmin }: Props) {
  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen bg-black border-r px-4 py-6 shrink-0">
      <Link href="/" className="text-xl font-bold mb-8 block">
        LOGO
      </Link>

      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Categorías</p>

      <nav className="flex flex-col gap-1">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/admin/category/${cat.id}`}
            className="text-sm px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {cat.name}
          </Link>
        ))}
      </nav>

      {isAdmin && (
        <div className="mt-auto pt-4 border-t">
          <LogoutButton />
        </div>
      )}
    </aside>
  );
}
