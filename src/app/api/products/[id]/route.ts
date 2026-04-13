import { NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'


/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     tags: [Productos]
 *     summary: Obtiene el detalle de un producto
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalle del producto
 *       404:
 *         description: Producto no encontrado
 *   patch:
 *     tags: [Productos]
 *     summary: Actualiza un producto
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       400:
 *         description: No se enviaron datos válidos
 *       401:
 *         description: No autorizado
 *   delete:
 *     tags: [Productos]
 *     summary: Desactivar un producto
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto desactivado
 *       401:
 *         description: No autorizado
 */

type Params = { params: Promise<{ id: string }> }

//PATCH  para actualizar un producto
export async function PATCH(request: Request, { params }: Params) {
  const supabase = await createClient()
  //const { data: { user } } = await supabase.auth.getUser()
  //if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const body = await request.json()

  const allowedFields = ['name', 'description', 'price', 'category_id', 'stock', 'active']
  const updates: Record<string, unknown> = {}

  Object.keys(body).forEach(key => {
    if (allowedFields.includes(key) && body[key] !== undefined) {
      updates[key] = body[key]
    }
  })

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: 'No se enviaron datos validos para actualizar' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data })
}

export async function DELETE(_request: Request, { params }: Params) {
  const supabase = await createClient()
  //const { data: { user } } = await supabase.auth.getUser()
  //if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params

  const { data, error } = await supabase
    .from('products')
    .update({ active: false })
    .eq('id', id)
    .select()
    .maybeSingle()
//console.log("ID recibido:", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ message: 'Producto desactivado exitosamente', data })
}

//GET de un producto por id
export async function GET(_request: Request, { params }: Params) {
  const supabase = await createClient()
  const { id } = await params

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories(name, slug),
      product_images(id, public_id, url, is_primary, sort_order)
    `)
    .eq('id', id)
    .eq('active', true)
    .order('sort_order', { referencedTable: 'product_images', ascending: true })
    .single()

  if (error) return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })

  return NextResponse.json({ data })
}