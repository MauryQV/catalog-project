"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WhatsappSettingsDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [number, setNumber] = useState("");
  const router = useRouter();

  const fetchSettings = async () => {
    setFetching(true);
    try {
      const res = await fetch("/api/settings/whatsapp");
      if (res.ok) {
        const data = await res.json();
        setNumber(data.number || "");
      }
    } catch (error) {
      console.error("Error fetching whatsapp settings:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchSettings();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/settings/whatsapp", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: number }),
      });

      if (res.ok) {
        setOpen(false);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Error al actualizar el número");
      }
    } catch (error) {
      console.error("Error updating whatsapp settings:", error);
      alert("Error de red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex items-center gap-2 w-fit">
        <MessageCircle size={18} className="text-[#25D366]" />
        Configurar WhatsApp
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="text-[#25D366]" />
            Configuración de WhatsApp
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="whatsapp" className="text-sm font-medium">
              Número de WhatsApp
            </label>
            <div className="relative">
              <Input
                id="whatsapp"
                placeholder="Ej: 59170000000"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                disabled={fetching || loading}
                className="pl-4"
                required
              />
              {fetching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 size={16} className="animate-spin text-gray-400" />
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Ingresa el número con el código de país, sin espacios ni el signo &quot;+&quot;.
            </p>
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={loading || fetching} className="flex items-center gap-2">
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
