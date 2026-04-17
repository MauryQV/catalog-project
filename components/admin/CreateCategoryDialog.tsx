"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateCategoryDialog() {
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);

    const slug = generateSlug(name);

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al crear categoría");
      }

      toast.success("Categoría creada");
      setName("");
      setOpen(false);
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="sm" className="w-full justify-start text-white hover:bg-white/10 mt-4 mb-2" />
        }
      >
        <Plus className="mr-2 h-4 w-4" />
        Nueva Categoría
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva Categoría</DialogTitle>
          <DialogDescription>Ingresa el nombre de la nueva categoría.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Electrónica" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? "Creando..." : "Crear Categoría"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
