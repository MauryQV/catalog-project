import Link from "next/link";
import type { Category } from "@/src/types/index";
import LogoutButton from "@/src/app/admin/LoggoutButton";
import Image from "next/image";

type Props = {
  categories: Category[];
  isAdmin: boolean;
};

export default function Sidebar({ categories, isAdmin }: Props) {
  return (
    <aside className="hidden md:flex flex-col w-56 h-screen sticky top-0 overflow-y-auto bg-black border-r px-4 py-6 shrink-0 ">
      <div className="flex items-center justify-center gap-x-3">
        <Image src="/catlogo.png" alt="Logo" width={50} height={50} />
        <span className="font-black text-white">BLACK CAT</span>
      </div>

      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mt-4 mb-2">Categorías</p>

      <nav className="flex flex-col gap-1 text-white">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/admin/category/${cat.id}`}
            className="text-sm px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {cat.name}
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t text-white ">
        <LogoutButton />
      </div>
    </aside>
  );
}
