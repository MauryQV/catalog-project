import { NextResponse } from 'next/server'
import { createClient } from '../../../../../lib/supabase/server'
import cloudinary from '../../../../../lib/cloudinary/cloudinary'

/**
 * @swagger
 * /api/products/{id}/image/{imageId}:
 *   patch:
 *     tags: [Imagenes de Productos]
 *     summary: Marca una imagen como principal
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: imageId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Imagen marcada como principal
 *       401:
 *         description: No autorizado
 *   delete:
 *     tags: [Imagenes de Productos]
 *     summary: Desliga y elimina una imagen del producto
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: imageId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Imagen eliminada de Cloudinary y Supabase
 *       401:
 *         description: No autorizado
 */

type Params = { params: Promise<{ id: string; imageId: string }> }

// PATCH marcar imagen como prrincipañ
export async function PATCH(_request: Request, { params }: Params) {
  const supabase = await createClient()
 // const { data: { user } } = await supabase.auth.getUser()
  //if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id, imageId } = await params

  // Quitar primary de todas
  await supabase
    .from('product_images')
    .update({ is_primary: false })
    .eq('product_id', id)

  // Marcar esta como primary
  const { data, error } = await supabase
    .from('product_images')
    .update({ is_primary: true })
    .eq('id', imageId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}



export async function DELETE(_request: Request, { params }: Params) {
  const supabase = await createClient()
 // const { data: { user } } = await supabase.auth.getUser()
  //if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { imageId } = await params

  // Buscar el public_id antes de borrar
  const { data: image, error: fetchError } = await supabase
    .from('product_images')
    .select('public_id, is_primary')
    .eq('id', imageId)
    .single()

  if (fetchError || !image) {
    return NextResponse.json({ error: 'Imagen no encontrada' }, { status: 404 })
  }

  if (image.is_primary) {
    return NextResponse.json(
      { error: 'No puedes eliminar la imagen principal. Asigna otra primero.' },
      { status: 400 }
    )
  }

  // Borrar de Cloudinary
  await cloudinary.uploader.destroy(image.public_id)

  // Borrar de Supabase
  const { error } = await supabase
    .from('product_images')
    .delete()
    .eq('id', imageId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ message: 'Imagen eliminada exitosamente' })
}