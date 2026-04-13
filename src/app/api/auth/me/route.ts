import { NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Verifica la sesión activa y retorna el usuario
 *     responses:
 *       200:
 *         description: Usuario autenticado
 *       401:
 *         description: No autenticado
 */
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
    }
  })
}