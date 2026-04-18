"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import EditProductDialog from "./EditProductDialog";
import AddImagesDialog from "./AddImagesDialog";
import type { Product } from "@/src/types";

export default function ProductCardAdmin({ product }: { product: Product }) {
  const router = useRouter();
  const [active, setActive] = useState(product.active);
  const [loading, setLoading] = useState(false);

  const primaryImage = product.product_images?.find((img) => img.is_primary) || product.product_images?.[0];
  const imageUrl = primaryImage?.url || "/placeholder-image.png";

  const handleToggleActive = async (checked: boolean) => {
    setActive(checked);
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: checked }),
      });
      if (!res.ok) {
        throw new Error("Failed to update status");
      }
      router.refresh();
    } catch (e) {
      console.error(e);
      setActive(!checked); // Rollback optimistic update
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border shadow-sm overflow-hidden flex flex-col">
      <div className="relative aspect-square bg-gray-100">
        {imageUrl !== "/placeholder-image.png" ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">Sin imagen</div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold dark:text-white truncate">{product.name}</h3>
        <p className="text-sm font-medium text-gray-700 mt-1">${product.price.toFixed(2)}</p>

        <div className="text-xs text-gray-500 mt-2 mb-4">
          <p>Stock: {product.stock}</p>
        </div>

        <div className="mt-auto flex flex-col gap-2 border-t pt-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <Switch
                id={`switch-${product.id}`}
                checked={active}
                onCheckedChange={handleToggleActive}
                disabled={loading}
              />
              <Label htmlFor={`switch-${product.id}`} className="text-xs">
                {active ? "Visible" : "Oculto"}
              </Label>
            </div>
            <EditProductDialog product={product} />
          </div>
          <AddImagesDialog productId={product.id} initialImages={product.product_images ?? []} />
        </div>
      </div>
    </div>
  );
}
