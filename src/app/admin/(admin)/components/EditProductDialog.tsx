"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import type { Product } from "@/src/types";

export default function EditProductDialog({ product }: { product: Product }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      price: parseFloat(formData.get("price") as string),
      stock: parseInt(formData.get("stock") as string || "0", 10),
      description: formData.get("description") as string,
    };

    try {
      // 1. Actualizar datos como JSON
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Error al modificar producto");

      // 2. Si subieron una imagen nueva, subirla por su endpoint
      const imageFile = formData.get("image") as File;
      if (imageFile && imageFile.size > 0) {
        const imgData = new FormData();
        imgData.append("image", imageFile);
        const imgRes = await fetch(`/api/products/${product.id}/image`, {
          method: "POST",
          body: imgData,
        });
        if (!imgRes.ok) throw new Error("Error al modificar la imagen");
      }

      setOpen(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Error al editar el producto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs">
        Editar
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm mb-1">Nombre</label>
            <Input name="name" defaultValue={product.name} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Precio</label>
            <Input name="price" type="number" step="0.01" defaultValue={product.price} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Stock</label>
            <Input name="stock" type="number" defaultValue={product.stock} />
          </div>
          <div>
            <label className="block text-sm mb-1">Descripción</label>
            <Textarea name="description" rows={3} defaultValue={product.description || ""} />
          </div>
          <div className="border-t pt-4">
            <label className="block text-sm mb-1 font-semibold">Actualizar Imagen</label>
            <span className="text-xs text-gray-500 block mb-2">Selecciona un archivo si deseas reemplazar la imagen principal</span>
            <Input name="image" type="file" accept="image/*" />
          </div>
          <div className="flex justify-end mt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
