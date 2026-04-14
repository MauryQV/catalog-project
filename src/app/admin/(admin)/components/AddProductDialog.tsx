"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

type Props = {
  categoryId: string;
};

export default function AddProductDialog({ categoryId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("category_id", categoryId);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al crear producto");

      setOpen(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Error al subir el producto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
        Agregar Producto
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo Producto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm mb-1">Nombre</label>
            <Input name="name" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Precio</label>
            <Input name="price" type="number" step="0.01" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Stock</label>
            <Input name="stock" type="number" defaultValue="0" />
          </div>
          <div>
            <label className="block text-sm mb-1">Descripción</label>
            <Textarea name="description" rows={3} />
          </div>
          <div>
            <label className="block text-sm mb-1">Imagen (Opcional por ahora)</label>
            <Input name="image" type="file" accept="image/*" />
          </div>
          <div className="flex justify-end mt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Crear Producto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
