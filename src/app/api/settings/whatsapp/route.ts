import { NextResponse } from 'next/server'
import { requireUser, getAuthSession } from '@/src/app/lib/auth'

/**
 * @swagger
 * /api/settings/whatsapp:
 *   get:
 *     tags: [Settings]
 *     summary: Obtiene el número de WhatsApp actual
 *     responses:
 *       200:
 *         description: Número obtenido exitosamente
 *       404:
 *         description: Configuración no encontrada
 *   patch:
 *     tags: [Settings]
 *     summary: Actualiza el número de WhatsApp (requiere autenticación)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [value]
 *             properties:
 *               value:
 *                 type: string
 *                 description: Número con código de país, ej. 591XXXXXXXX
 *     responses:
 *       200:
 *         description: Número actualizado exitosamente
 *       400:
 *         description: Número inválido
 *       401:
 *         description: No autorizado
 */

export async function GET() {
  const {supabase} = await getAuthSession()


  const { data, error } = await supabase
    .from('settings')
    .select('value, updated_at')
    .eq('key', 'whatsapp_number')
    .single()

  if (error) return NextResponse.json({ error: 'Configuración no encontrada' }, { status: 404 })

  return NextResponse.json({
    number: data.value,
    url: `https://wa.me/${data.value}`,
    updated_at: data.updated_at,
  })
}

export async function PATCH(request: Request) {
   const {supabase, unauthorizedResponse} = await requireUser()
  if (unauthorizedResponse) return unauthorizedResponse
  const body = await request.json()
  const { value } = body

  if (!value) {
    return NextResponse.json({ error: 'El número es requerido' }, { status: 400 })
  }

  // Validar que solo tenga números y mínimo 8 dígitos
  const clean = value.replace(/\s+/g, '')
  if (!/^\d{8,15}$/.test(clean)) {
    return NextResponse.json(
      { error: 'Número inválido. Solo dígitos, entre 8 y 15 caracteres. Ej: 591XXXXXXXX' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('settings')
    .update({ value: clean, updated_at: new Date().toISOString() })
    .eq('key', 'whatsapp_number')
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    message: 'Número actualizado exitosamente',
    number: data.value,
    url: `https://wa.me/${data.value}`,
  })
}