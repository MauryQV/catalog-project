// lib/auth.ts
import { createClient } from '../../app/lib/supabase/server'
import { NextResponse } from 'next/server'


export async function getAuthSession() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  return { supabase, user }
}

export async function requireUser() {
  const { supabase, user } = await getAuthSession()

  if (!user) {
    return { 
      supabase, 
      user: null, 
      unauthorizedResponse: NextResponse.json(
        { error: 'No autorizado' }, 
        { status: 401 }
      )
    }
  }

  return { supabase, user, unauthorizedResponse: null }
}