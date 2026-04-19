"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Category } from "../../../types/index";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  categories: Category[];
};
import Image from "next/image";

export default function MobileNav({ categories }: Props) {
  const [open, setOpen] = useState(false);
  const [ws, setWS] = useState<{ number: string; url: string } | null>(null);
  useEffect(() => {
    const fetchWahtsapp = async () => {
      const res = await fetch(`/api/settings/whatsapp`, {
        cache: "no-store",
      });
      if (!res.ok) return null;
      const data = await res.json();
      setWS(data);
    };
    fetchWahtsapp();
  }, []);

  return (
    <>
      <button onClick={() => setOpen(true)} className="p-2 rounded-lg hover:bg-gray-100" aria-label="Abrir menú">
        <Menu className="text-white" />
      </button>

      {open && <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setOpen(false)} />}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-xl
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-center gap-x-3 mt-5">
          <Image src="/cat-logo-light.png" alt="Logo" width={50} height={50} className="w-auto h-auto" />
          <span className="font-black">BLACK CAT</span>
        </div>

        <span className="ml-5 text-xs font-semibold uppercase tracking-widest text-gray-400 mt-10">Categorias</span>
        <nav className="flex flex-col gap-1 px-3 py-4">
          <Link href="/" onClick={() => setOpen(false)} className="text-sm px-3 py-2 rounded-lg hover:bg-gray-100">
            Todos
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categoria/${cat.slug}`}
              onClick={() => setOpen(false)}
              className="text-sm px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              {cat.name}
            </Link>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="mt-4 w-full cursor-pointer"
            onClick={() => {
              window.open(`https://wa.me/+591${ws?.number}`, "_blank");
            }}
          >
            Enviar sugerencias
          </Button>
        </nav>
      </div>
    </>
  );
}
