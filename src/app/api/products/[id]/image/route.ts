import { NextResponse } from 'next/server'
import {requireUser } from '../../../../lib/auth' 
import cloudinary from '../../../../lib/cloudinary/cloudinary'

/**
 * @swagger
 * /api/products/{id}/image:
 *   post:
 *     tags: [Imagenes de Productos]
 *     summary: Sube o reemplaza la imagen de un producto
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
 *       200:
 *         description: Imagen actualizada
 *       400:
 *         description: No se envió imagen
 *       401:
 *         description: No autorizado
 */

type Params = { params: Promise<{ id: string }> }

// Subir o reemplazar imagen de un producto (POST)
export async function POST(request: Request, { params }: Params) {
  const { supabase, unauthorizedResponse} = await requireUser() 
if (unauthorizedResponse) return unauthorizedResponse


  const { id } =  await params
  const formData = await request.formData()
  const image = formData.get('image') as File | null

  if (!image || image.size === 0) {
    return NextResponse.json({ error: 'No se envió ninguna imagen' }, { status: 400 })
  }

  // Subir a Cloudinary
  const bytes = await image.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploaded = await new Promise<any>((resolve, reject) => {
  cloudinary.uploader.upload_stream(
    { folder: 'productos' },
    (error, result) => {
      if (error || !result) return reject(error)
      resolve(result)
    }
  ).end(buffer)
})

const { data: existingImages } = await supabase
  .from('product_images')
  .select('id')
  .eq('product_id', id)


const isPrimary = !existingImages || existingImages.length === 0

await supabase
  .from('product_images')
  .update({ is_primary: false })
  .eq('product_id', id)


const { data, error } = await supabase
  .from('product_images')
  .insert([
    {
      product_id: id,
      public_id: uploaded.public_id,
      url: uploaded.secure_url,
      is_primary: true, 
      sort_order: 0
    }
  ])
  .select()
  .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    message: 'Imagen actualizada exitosamente',
    image_url: uploaded.public_id,
    data,
  })
}