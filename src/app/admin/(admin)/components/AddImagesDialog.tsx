"use client";

import { useRef, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImagePlus, X, Loader2, Upload, Star, Trash2 } from "lucide-react";
import type { ProductImage } from "@/src/types";

interface Props {
  productId: string;
  /** Pass the current images so the dialog can show them immediately */
  initialImages: ProductImage[];
}

export default function AddImagesDialog({ productId, initialImages }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<ProductImage[]>(initialImages);

  // --- upload state ---
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);

  // --- per-image loading flags ---
  const [deleting, setDeleting] = useState<Set<string>>(new Set());
  const [promoting, setPromoting] = useState<Set<string>>(new Set());

  const inputRef = useRef<HTMLInputElement>(null);

  // ---- helpers ----
  const setFlag = (setter: React.Dispatch<React.SetStateAction<Set<string>>>, id: string, value: boolean) => {
    setter((prev) => {
      const next = new Set(prev);
      if (value) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  // ---- existing image actions ----
  const handleDelete = useCallback(
    async (imageId: string) => {
      setFlag(setDeleting, imageId, true);
      try {
        const res = await fetch(`/api/products/${productId}/image/${imageId}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          alert(json.error ?? "No se pudo eliminar la imagen.");
          return;
        }
        setImages((prev) => prev.filter((img) => img.id !== imageId));
        router.refresh();
      } catch {
        alert("Error de red al eliminar.");
      } finally {
        setFlag(setDeleting, imageId, false);
      }
    },
    [productId, router],
  );

  const handleSetPrimary = useCallback(
    async (imageId: string) => {
      setFlag(setPromoting, imageId, true);
      try {
        const res = await fetch(`/api/products/${productId}/image/${imageId}`, {
          method: "PATCH",
        });
        if (!res.ok) {
          alert("No se pudo actualizar la imagen principal.");
          return;
        }
        setImages((prev) => prev.map((img) => ({ ...img, is_primary: img.id === imageId })));
        router.refresh();
      } catch {
        alert("Error de red al actualizar.");
      } finally {
        setFlag(setPromoting, imageId, false);
      }
    },
    [productId, router],
  );

  // ---- upload new images ----
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (!selected.length) return;
    setFiles((prev) => [...prev, ...selected]);
    const newPreviews = selected.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...newPreviews]);
    // reset input so same file can be re-selected
    e.target.value = "";
  };

  const removePreview = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleUpload = async () => {
    if (!files.length) return;
    setUploading(true);
    setUploadedCount(0);

    let failed = 0;
    const uploaded: ProductImage[] = [];

    for (const file of files) {
      const body = new FormData();
      body.append("image", file);
      try {
        const res = await fetch(`/api/products/${productId}/image`, {
          method: "POST",
          body,
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data) uploaded.push(json.data as ProductImage);
          setUploadedCount((n) => n + 1);
        } else {
          failed++;
        }
      } catch {
        failed++;
      }
    }

    setUploading(false);
    if (failed > 0) alert(`${failed} imagen(es) no se pudieron subir.`);

    // reset pending previews
    previews.forEach((p) => URL.revokeObjectURL(p));
    setPreviews([]);
    setFiles([]);

    // merge newly uploaded images into local state
    setImages((prev) => [...prev, ...uploaded]);
    router.refresh();
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) {
      previews.forEach((p) => URL.revokeObjectURL(p));
      setPreviews([]);
      setFiles([]);
    } else {
      // reset local images to latest prop value on open
      setImages(initialImages);
    }
    setOpen(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        <ImagePlus size={14} />
        Fotos ({initialImages.length})
      </DialogTrigger>

      <DialogContent className="w-[95vw] max-w-lg max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Imágenes del producto</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          {/* ── Existing images ── */}
          {images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="flex flex-col rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700"
                >
                  {/* Image */}
                  <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={img.url}
                      alt="imagen producto"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 45vw, 150px"
                    />
                    {/* Primary badge */}
                    {img.is_primary && (
                      <span className="absolute top-1 left-1 bg-yellow-400 text-yellow-900 text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                        Principal
                      </span>
                    )}
                  </div>

                  {/* Action bar — always visible, touch-friendly */}
                  <div className="flex items-center justify-center gap-2 p-2 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700">
                    {img.is_primary ? (
                      <span className="text-[10px] text-yellow-600 font-semibold flex items-center gap-1">
                        <Star size={11} className="fill-yellow-400 text-yellow-400" />
                        Principal
                      </span>
                    ) : (
                      <>
                        {/* Set primary */}
                        <button
                          title="Marcar como principal"
                          onClick={() => handleSetPrimary(img.id)}
                          disabled={promoting.has(img.id) || deleting.has(img.id)}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-yellow-50 hover:bg-yellow-100 active:bg-yellow-200 text-yellow-700 text-[11px] font-medium transition-colors disabled:opacity-40 min-h-9"
                        >
                          {promoting.has(img.id) ? <Loader2 size={13} className="animate-spin" /> : <Star size={13} />}
                        </button>

                        {/* Delete */}
                        <button
                          title="Eliminar imagen"
                          onClick={() => handleDelete(img.id)}
                          disabled={deleting.has(img.id) || promoting.has(img.id)}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-600 text-[11px] font-medium transition-colors disabled:opacity-40 min-h-9"
                        >
                          {deleting.has(img.id) ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">Este producto no tiene imágenes aún.</p>
          )}

          {/* ── Upload new images ── */}
          <div className="border-t pt-4 flex flex-col gap-3">
            <p className="text-sm font-semibold">Agregar imágenes</p>

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-5 flex flex-col items-center gap-2 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
            >
              <Upload size={24} />
              <span className="text-sm">Seleccionar imágenes</span>
              <span className="text-xs text-gray-400">JPG, PNG, WEBP — múltiples</span>
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />

            {/* New file previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {previews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                    <Image src={src} alt={`preview-${i}`} fill className="object-cover" sizes="120px" />
                    <button
                      type="button"
                      onClick={() => removePreview(i)}
                      className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {uploading && (
              <p className="text-sm text-center text-gray-500">
                Subiendo {uploadedCount} / {files.length}…
              </p>
            )}

            {files.length > 0 && (
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    previews.forEach((p) => URL.revokeObjectURL(p));
                    setPreviews([]);
                    setFiles([]);
                  }}
                  disabled={uploading}
                >
                  Limpiar
                </Button>
                <Button size="sm" onClick={handleUpload} disabled={uploading}>
                  {uploading ? (
                    <>
                      <Loader2 size={14} className="mr-1 animate-spin" />
                      Subiendo…
                    </>
                  ) : (
                    `Subir (${files.length})`
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
