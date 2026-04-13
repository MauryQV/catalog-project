import { NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Cierra la sesión activa
 *     responses:
 *       200:
 *         description: Sesión cerrada
 *       401:
 *         description: No hay sesión activa
 */
export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No hay sesión activa' }, { status: 401 })
  }

  await supabase.auth.signOut()
  return NextResponse.json({ message: 'Sesión cerrada correctamente' })
}