import { NextResponse } from 'next/server'
import { requireUser, getAuthSession } from '../../../app/lib/auth'

/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags: [Categorias]
 *     summary: Listar todas la categorías
 *     description: Obtiene todas las categorías.
 *     parameters:
 *       - name: categoria
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Slug de la categoría para filtrar (ej. 'electronica')
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida exitosamente
 * 
 *   post:
 *     tags: [Categorias]
 *     summary: Crear una nueva categoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, slug]
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la categoría
 *               slug:
 *                 type: string
 *                 description: URL amigable de la categoría (sin espacios)
 *               description:
 *                 type: string
 *                 description: Descripción opcional
 *               sort_order:
 *                 type: integer
 *                 description: Orden de aparición de la categoría
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *       400:
 *         description: Faltan datos obligatorios o son inválidos
 *       401:
 *         description: No autorizado
 */

// Obtener categorias (GET)
export async function GET() {
   const { supabase } = await getAuthSession()
  
  // Iniciamos la consulta, ordenando por 'sort_order' para que se muestren como quieres
  let query = supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

// Crear una categoría (POST)
export async function POST(request: Request) {
  const { supabase } = await requireUser()

  const { data: { user } } = await supabase.auth.getUser()
   if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  // Recibimos el JSON limpio
  const body = await request.json()
  const { name, slug, description, sort_order } = body

  // Validación básica: Name y Slug son obligatorios
  if (!name || !slug) {
    return NextResponse.json(
      { error: 'Los campos "name" y "slug" son obligatorios' }, 
      { status: 400 }
    )
  }

  // Insertamos en la base de datos
  const { data, error } = await supabase
    .from('categories')
    .insert([
      { 
        name, 
        slug, 
        description: description || null, 
        sort_order: sort_order || 1 // Si no envían orden, le ponemos 1 por defecto
      }
    ])
    .select()
    .single() // Aquí sí usamos single() porque sabemos que acabamos de insertar 1 fila con éxito

  if (error) {
    // Si el slug ya existe, Supabase lanzará un error de clave única (si lo configuraste así en tu BD)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data, message: 'Categoría creada' }, { status: 201 })
}