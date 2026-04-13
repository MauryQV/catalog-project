import { NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Inicia sesión como administrador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Sesión iniciada correctamente
 *       401:
 *         description: Credenciales incorrectas
 */
export async function POST(request: Request) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email y password son requeridos' },
      { status: 400 }
    )
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return NextResponse.json(
      { error: 'Credenciales incorrectas' },
      { status: 401 }
    )
  }

  return NextResponse.json({
    user: {
      id: data.user.id,
      email: data.user.email,
    }
  })
}