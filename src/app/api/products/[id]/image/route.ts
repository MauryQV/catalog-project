import { NextResponse } from 'next/server'
import {requireUser } from '../../../../lib/auth' 
import cloudinary from '../../../../lib/cloudinary/cloudinary'

/**
 * @swagger
 * /api/products/{id}/image:
 *   post:
 *     tags: [Imagenes de Productos]
 *     summary: Agrega una imagen al producto
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Imagen agregada
 *       400:
 *         description: No se envió imagen
 *       401:
 *         description: No autorizado
 */

type Params = { params: Promise<{ id: string }> }

export async function POST(request: Request, { params }: Params) {
  const { supabase, unauthorizedResponse } = await requireUser()
  if (unauthorizedResponse) return unauthorizedResponse

  const { id } = await params
  const formData = await request.formData()
  const image = formData.get('image') as File | null

  if (!image || image.size === 0) {
    return NextResponse.json({ error: 'No se envió ninguna imagen' }, { status: 400 })
  }

  // Contar imágenes existentes para sort_order e is_primary
  const { data: existingImages } = await supabase
    .from('product_images')
    .select('id')
    .eq('product_id', id)

  const isFirst = !existingImages || existingImages.length === 0
  const nextSortOrder = existingImages?.length ?? 0

  // Subir a Cloudinary
  const bytes = await image.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploaded = await new Promise<{ public_id: string; secure_url: string }>(
    (resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'productos' },
        (error, result) => {
          if (error || !result) return reject(error)
          resolve(result)
        }
      ).end(buffer)
    }
  )
    const { data, error } = await supabase
    .from('product_images')
    .insert({
      product_id: id,
      public_id:  uploaded.public_id,
      url:        uploaded.secure_url,
      is_primary: isFirst,        
      sort_order: nextSortOrder,  
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    message: isFirst
      ? 'Imagen agregada y marcada como principal'
      : 'Imagen agregada exitosamente',
    data,
  }, { status: 201 })
}