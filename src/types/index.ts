export type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  sort_order: number
  image_url: string | null
}

export type ProductImage = {
  id: string
  product_id: string
  public_id: string
  url: string
  is_primary: boolean
  sort_order: number
}

export type Product = {
  id: string
  category_id: string | null
  name: string
  description: string | null
  price: number
  active: boolean
  stock: number
  created_at: string
  // relaciones
  categories?: Pick<Category, 'name' | 'slug'>
  product_images?: ProductImage[]
}