import type { Metadata } from 'next'
import { getCategories } from '../app/lib/supabase/queries'
import { createClient } from '../app/lib/supabase/server' 
import Sidebar from '../app/components/layout/Sidebar'
import MobileNav from '../app/components/layout/MobileNav'
import './globals.css'
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Mi Catálogo',
  description: 'Catálogo de productos',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const categories = await getCategories()

  // 2. Verificamos si hay un administrador logueado
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = !!user

  return (
    <html lang="es" className={cn("font-sans", inter.variable)}>
      <body className="bg-gray-50 text-gray-900">
        <div className="flex min-h-screen">
          
          {/* 3. Le pasamos el isAdmin al Sidebar desktop */}
          <Sidebar categories={categories} isAdmin={isAdmin} />

          {/* main content */}
          <div className="flex-1 flex flex-col">
            
            {/* header para moviles */}
            <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b">
              <span className="font-semibold text-lg">Mi Catálogo</span>
              {/* 4. Le pasamos el isAdmin al MobileNav también */}
              <MobileNav categories={categories} isAdmin={isAdmin} />
            </header>

            <main className="flex-1 p-4 md:p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}