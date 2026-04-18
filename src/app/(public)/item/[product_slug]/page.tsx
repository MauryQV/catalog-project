import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/src/app/lib/supabase/queries";
import { ArrowLeft } from "lucide-react";
import { headers } from "next/headers";
import ImageGallery from "./ImageGallery";

async function getWhatsappNumber(): Promise<string | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3800";
    const res = await fetch(`${baseUrl}/api/settings/whatsapp`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.number ?? null;
  } catch {
    return null;
  }
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ product_slug: string }> }) {
  const { product_slug } = await params;

  const [product, whatsappNumber] = await Promise.all([getProductById(product_slug), getWhatsappNumber()]);

  if (!product) {
    notFound();
  }

  const allImages = product.product_images ?? [];

  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const currentUrl = `${protocol}://${host}/item/${product_slug}`;

  const categoryName = product.categories?.name ?? "";
  const whatsappMessage = encodeURIComponent(
    `Estoy interesado en este producto ${product.name} de la categoría ${categoryName} - ${currentUrl}`,
  );
  const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${whatsappMessage}` : null;

  return (
    <div>
      <Image
        src="/background.jpg"
        alt="Fondo"
        width={1500}
        height={1500}
        className="fixed inset-0 h-full w-full -z-10 opacity-100 brightness-60 object-cover"
      />

      <div className="max-w-5xl mx-auto py-8">
        <Link
          href="/"
          className="px-4 py-2 rounded-full bg-black/90 inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors drop-shadow-md font-medium"
        >
          <span className="mr-2">
            <ArrowLeft size={20} />
          </span>{" "}
          Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Image gallery */}
          <ImageGallery images={allImages} productName={product.name} />

          <div className="flex flex-col rounded-3xl overflow-hidden border border-white/30 bg-black/95 p-8 text-white relative">
            {product.categories?.name && (
              <span className="inline-block bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase mb-6 w-max shadow-sm border border-white/30">
                {product.categories.name}
              </span>
            )}

            <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg leading-tight">{product.name}</h1>

            <p className="text-3xl font-light text-white/90 drop-shadow-md mb-8">
              Bs. {Number(product.price).toFixed(2)}
            </p>

            <div className="h-px w-full bg-white/20 my-6 shadow-sm"></div>

            <div className="flex-1">
              <h3 className="text-lg font-medium mb-3 text-white/90 drop-shadow-sm tracking-wide">Descripción</h3>
              <p className="text-white/80 leading-relaxed font-light drop-shadow-sm">
                {product.description || "No hay descripción detallada disponible para este producto."}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex flex-col w-full sm:w-auto text-center sm:text-left">
                <span className="text-[10px] text-white/60 uppercase tracking-widest mb-1">Disponibilidad</span>
                <span className={`font-bold drop-shadow-md ${product.stock > 0 ? "text-white" : "text-red-400"}`}>
                  {product.stock > 0 ? `${product.stock} unidades en stock` : "Agotado"}
                </span>
              </div>

              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={product.stock === 0}
                  className={`text-[#25D366] w-full sm:w-auto bg-white flex items-center justify-center gap-x-2 font-bold uppercase tracking-wider px-8 py-3.5 rounded-full hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] active:scale-95 ${product.stock === 0 ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#25D366" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  Adquirir
                </a>
              ) : (
                <button
                  disabled={product.stock === 0}
                  className="text-[#25D366] w-full sm:w-auto bg-white flex items-center justify-center gap-x-2 font-bold uppercase tracking-wider px-8 py-3.5 rounded-full hover:bg-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#25D366" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  Adquirir
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
