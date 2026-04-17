import { NextResponse } from 'next/server'
import { requireUser, getAuthSession } from '../../../lib/auth'

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     tags: [Categorias]
 *     summary: Obtiene el detalle de una categoría
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalle de la categoría
 *       404:
 *         description: Categoría no encontrada
 *   delete:
 *    tags: [Categorias]
 *    summary: Elimina una categoría
 *    parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       schema:
 *         type: string
 *    responses:
 *     200: 
 *       description: Categoría eliminada exitosamente
 *     400:
 *       description: No se puede eliminar la categoría (ej. tiene productos asociados)
 *     500:
 *       description: Error del servidor
 * 
 *   patch:
 *     tags: [Categorias]
 *     summary: Editar una categoria
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
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *               sort_order:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Categoría actualizada
 *       400:
 *         description: No se enviaron datos válidos
 *       401:
 *         description: No autorizado
 */

type Params = { params: Promise<{ id: string }> }

//Funcion para obtener el detalle de una categoría (GET)
export async function GET(_request: Request, { params }: Params) {
  const { supabase } = await getAuthSession()
  const { id } = await params

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 })
  return NextResponse.json({ data })
}
// Editar una categoría (PATCH)
export async function PATCH(request: Request, { params }: Params) {

  const { supabase, unauthorizedResponse } = await requireUser()
  if (unauthorizedResponse) return unauthorizedResponse


  const { id } = await params
  const body = await request.json()

  const allowedFields = ['name', 'slug', 'description', 'sort_order']
  const updates: Record<string, unknown> = {}

  Object.keys(body).forEach(key => {
    if (allowedFields.includes(key) && body[key] !== undefined) {
      updates[key] = body[key]
    }
  })

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: 'No se enviaron datos válidos para actualizar' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

// Eliminar una categoría (DELETE)
export async function DELETE(_request: Request, { params }: Params) {
  const { supabase, unauthorizedResponse } = await requireUser()
  if (unauthorizedResponse) return unauthorizedResponse

  const { id } = await params
  const { count, error: countError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', id)

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 })
  }

  if (count && count > 0) {
    return NextResponse.json(
      { 
        error: 'No se puede eliminar', 
        message: `Existen ${count} productos asociados a esta categoría. Reasígnalos antes de borrar.` 
      }, 
      { status: 400 } 
    )
  }

  const { error: deleteError } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Categoría eliminada exitosamente' }, { status: 200 })
}