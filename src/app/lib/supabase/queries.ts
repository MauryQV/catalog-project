import { createClient } from './server'
import type { Category, Product } from '../../../types/index'


export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function getProducts(slug?: string): Promise<Product[]> {
  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select(`
      *,
      categories(name, slug),
      product_images(
        id,
        url,
        is_primary,
        sort_order
      )
    `)
    .eq('active', true)
    .order('created_at', { ascending: false })
    .order('sort_order', { referencedTable: 'product_images', ascending: true })


  if (slug) {
    query = query.eq('categories.slug', slug)
  }

  const { data, error } = await query
  if (error) throw error

  //console.log('debuuuuuuuuuuuug:', data)
  return data ?? []
  
}


export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories!inner(name, slug),
      product_images(
        id,
        url,
        is_primary,
        sort_order
      )
    `)
    .eq('active', true)
    .eq('categories.slug', slug)
    .order('created_at', { ascending: false })
    .order('sort_order', { referencedTable: 'product_images', ascending: true })

  if (error) throw error
  return data ?? []
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories(name, slug),
      product_images(
        id,
        url,
        is_primary,
        sort_order
      )
    `)
    .eq('id', id)
    .order('sort_order', { referencedTable: 'product_images', ascending: true })
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw error
  }
  
  return data as Product;
}