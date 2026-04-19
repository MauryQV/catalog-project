"use client";
import Link from "next/link";
import type { Category } from "../../../types/index";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
type Props = {
  categories: Category[];
};

export default function Sidebar({ categories }: Props) {
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
    <aside className="hidden md:flex flex-col w-56 h-screen sticky top-0 overflow-y-auto px-4 py-6 shrink-0 bg-black/70 backdrop-blur-sm">
      <div className="flex items-center justify-center gap-x-3 ">
        <Image src="/catlogo.png" alt="Logo" width={50} height={50} className="w-auto h-auto" />
        <span className="font-black text-white">BLACK CAT</span>
      </div>

      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Categorías</p>

      <nav className="flex flex-col gap-1">
        <Link href="/" className="text-sm px-3 py-2 rounded-lg hover:bg-black transition-colors text-white">
          Todos
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categoria/${cat.slug}`}
            className="text-sm px-3 py-2 rounded-lg hover:bg-black transition-colors text-white"
          >
            {cat.name}
          </Link>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="text-sm px-3 py-2 rounded-lg hover:bg-black transition-colors text-white hover:text-white cursor-pointer"
          onClick={() => {
            console.log("ws", ws);
            window.open(`https://wa.me/+591${ws?.number}`, "_blank");
          }}
        >
          Enviar sugerencias
        </Button>
      </nav>
    </aside>
  );
}
