"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Category } from "@/src/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

export default function CategoryEditor({ category }: { category: Category }) {
  const router = useRouter();
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description || "");
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleSave = async () => {
    setLoading(true);
    const slug = generateSlug(name);
    try {
      const res = await fetch(`/api/categories/${category.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, slug }),
      });

      if (!res.ok) throw new Error("Error al guardar");

      toast.success("Categoría actualizada correctamente");
      router.refresh();
    } catch (e) {
      console.error(e);
      toast.error("Error guardando categoría");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`/api/categories/${category.id}/image`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al subir imagen");

      toast.success("Imagen actualizada");
      router.refresh();
      setImgError(false);
    } catch (e) {
      console.error(e);
      toast.error("Error subiendo imagen");
    } finally {
      setImageLoading(false);
    }
  };

  const handleImageDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar la imagen?")) return;

    setImageLoading(true);
    try {
      const res = await fetch(`/api/categories/${category.id}/image`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar imagen");

      toast.success("Imagen eliminada");
      router.refresh();
    } catch (e) {
      console.error(e);
      toast.error("Error eliminando imagen");
    } finally {
      setImageLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Datos básicos */}
      <div className="p-6 rounded-xl border border-white/10 backdrop-blur-sm shadow-xl">
        <h2 className="text-xl font-bold mb-4 ">Información General</h2>
        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-900">Nombre de la Categoría</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Electrónica" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-gray-900">Descripción</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe de qué trata esta categoría..."
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Imagen */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl">
        <h2 className="text-xl font-bold mb-4 ">Imagen de Portada</h2>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-80 h-40 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center group">
            {category.public_url && !imgError ? (
              <Image
                src={category.public_url}
                alt={category.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                <Upload className="h-8 w-8 mb-2 opacity-20" />
                <span className="text-[10px]">Sin imagen</span>
              </div>
            )}
            {imageLoading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                <Loader2 className="h-6 w-6 text-gray-500 animate-spin" />
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col gap-3 w-full">
            <p className="text-sm text-gray-400">
              Esta imagen se usará como fondo en la sección de la categoría. Se recomienda una imagen de alta resolución
              orientada horizontalmente.
            </p>
            <div className="flex flex-col gap-2 w-60">
              <label className="hover:bg-gray-200 cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground h-9 px-4 py-2">
                <Upload className="mr-2 h-4 w-4" />
                {category.public_url ? "Cambiar Imagen" : "Subir Imagen"}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={imageLoading}
                />
              </label>

              {category.public_url && (
                <Button
                  variant="destructive"
                  className="h-9 px-4 py-2 text-sm cursor-pointer"
                  onClick={handleImageDelete}
                  disabled={imageLoading}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
