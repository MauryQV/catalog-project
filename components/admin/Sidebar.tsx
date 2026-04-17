"use client";

import { useState, useCallback, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import type { Category } from "@/src/types/index";
import LogoutButton from "@/src/app/admin/LoggoutButton";
import Image from "next/image";
import DraggableCategory from "./DraggableCategory";
import CreateCategoryDialog from "./CreateCategoryDialog";
import { toast } from "sonner";

type Props = {
  categories: Category[];
  isAdmin: boolean;
};

export default function Sidebar({ categories: initialCategories, isAdmin }: Props) {
  const [categories, setCategories] = useState(initialCategories);

  // Sincronizar estado local si las props cambian (ej. después de un router.refresh)
  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const moveCategory = useCallback((dragIndex: number, hoverIndex: number) => {
    setCategories((prevCategories) => {
      const newCategories = [...prevCategories];
      const draggedCategory = newCategories[dragIndex];
      newCategories.splice(dragIndex, 1);
      newCategories.splice(hoverIndex, 0, draggedCategory);
      return newCategories;
    });
  }, []);

  const handleDrop = useCallback(async () => {
    try {
      // Persistir el nuevo orden en la base de datos
      const updatePromises = categories.map((cat, index) => {
        return fetch(`/api/categories/${cat.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sort_order: index,
          }),
        });
      });

      await Promise.all(updatePromises);
      toast.success("Orden actualizado");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Error al guardar el orden");
    }
  }, [categories]);

  return (
    <DndProvider backend={HTML5Backend}>
      <aside className="hidden md:flex flex-col w-56 h-screen sticky top-0 overflow-y-auto bg-black border-r px-4 py-6 shrink-0 ">
        <div className="flex items-center justify-center gap-x-3">
          <Image src="/catlogo.png" alt="Logo" width={50} height={50} />
          <span className="font-black text-white">BLACK CAT</span>
        </div>

        <CreateCategoryDialog />

        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mt-4 mb-2">Categorías</p>

        <nav className="flex flex-col gap-1 text-white">
          {categories.map((cat, index) => (
            <DraggableCategory
              key={cat.id}
              cat={cat}
              index={index}
              moveCategory={moveCategory}
              onDrop={handleDrop}
            />
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t text-white ">
          <LogoutButton />
        </div>
      </aside>
    </DndProvider>
  );
}
