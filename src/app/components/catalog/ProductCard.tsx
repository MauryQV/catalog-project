import Image from 'next/image'
import type { Product } from '../../../types/index'
import Link from 'next/link'
import { Pencil } from 'lucide-react'

export default function ProductCard({ product, isAdmin = false }: { product: Product, isAdmin?: boolean }) {
 const primaryImage = product.product_images?.find(img => img.is_primary)
 const fallbackImage = product.product_images?.[0]

const imageUrl = primaryImage?.url || fallbackImage?.url || 'https://placehold.co/400x400?text=sin imagen'
  
  // verifica el stock :V
  const isOutOfStock = product.stock === 0;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border hover:shadow-md transition-shadow group">
      
   
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        

        {isAdmin && (
          <Link 
            href={`/admin/productos/editar/${product.id}`}
            className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-blue-600 p-2 rounded-full shadow-lg z-20 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 hover:bg-white hover:scale-110 flex items-center justify-center w-9 h-9 border border-gray-100"
            title="Editar producto"
          >
            <Pencil className="w-4 h-4" strokeWidth={2.5} />
          </Link>
        )}

        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300" 
          sizes="(max-width: 768px) 50vw, 25vw"
          priority={true} 
        />

        {/*sold out*/}
        {isOutOfStock && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md z-10">
            Agotado
          </div>
        )}
        
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/10 z-0"></div>
        )}
      </div>

      <div className="p-3">
        <p className="text-xs text-gray-400 mb-1">
          Bs. {Number(product.price).toFixed(2)}
        </p>
        <p className="text-sm font-medium text-gray-800 line-clamp-2">
          {product.name}
        </p>
      </div>
    </div>
  )
}