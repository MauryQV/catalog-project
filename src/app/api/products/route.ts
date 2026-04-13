import { NextResponse } from 'next/server'
import { createClient } from '../../lib/supabase/server'


/**
 * @swagger
 * /api/products:
 *   get:
 *     tags: [Productos]
 *     summary: Listar todos las prendas
 *     parameters:
 *       - name: categoria
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Slug de la categoría para filtrar
 *     responses:
 *       200:
 *         description: Lista de productos
 *   post:
 *     tags: [Productos]
 *     summary: Crear un nuevo producto
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, price, category_id]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category_id:
 *                 type: string
 *               stock:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Producto creado
 *       401:
 *         description: No autorizado
 *       400:
 *         description: Datos inválidos
 */

//GET  de los productos
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('categoria')

  const supabase = await createClient()
  let query = supabase
    .from('products')
    .select(`
      *,
      categories(name, slug),
      product_images(id, public_id, url, is_primary, sort_order)
    `)
    .eq('active', true)
    .order('created_at', { ascending: false })
    .order('sort_order', { referencedTable: 'product_images', ascending: true })

  if (slug) {
    query = query.eq('categories.slug', slug)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data })
}




// POST de los productos
export async function POST(request: Request) {
  const supabase = await createClient()
  //const { data: { user } } = await supabase.auth.getUser()
 // if (!user) {
  //  return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  //}
  const formData = await request.formData()
  const name        = formData.get('name') as string
  const description = formData.get('description') as string
  const price       = formData.get('price') as string
  const category_id = formData.get('category_id') as string
  const stock       = formData.get('stock') as string
  //const image       = formData.get('image') as File | null

  // 3. Validar campos requeridos
  if (!name || !price || !category_id) {
    return NextResponse.json(
      { error: 'name, price y category_id son requeridos' },
      { status: 400 }
    )
  }
  const { data, error } = await supabase
    .from('products')
    .insert({
      name,
      description: description || null,
      price: parseFloat(price),
      category_id,
      stock: stock ? parseInt(stock) : 0,
      active: true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}