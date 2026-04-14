"use client";

import { useState } from "react";
import Link from "next/link";
import type { Category } from "@/src/types/index";
type Props = {
  categories: Category[];
  isAdmin: boolean;
};

export default function MobileNav({ categories, isAdmin }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className="p-2 rounded-lg hover:bg-gray-100" aria-label="Abrir menú">
        <span className="block w-5 h-0.5 bg-gray-700 mb-1" />
        <span className="block w-5 h-0.5 bg-gray-700 mb-1" />
        <span className="block w-5 h-0.5 bg-gray-700" />
      </button>

      {open && <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setOpen(false)} />}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-xl
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <span className="font-bold text-lg">LOGO</span>
          <button onClick={() => setOpen(false)} className="text-gray-500 text-xl">
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-3 py-4">
          <Link href="/" onClick={() => setOpen(false)} className="text-sm px-3 py-2 rounded-lg hover:bg-gray-100">
            Todos
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`admin/category/${cat.slug}`}
              onClick={() => setOpen(false)}
              className="text-sm px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
