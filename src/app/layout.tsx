import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Black Cat Store | Catalogo",
  description: "Catálogo de productos",
  icons:{
    icon: "/cat-logo-light.png",
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={cn("font-sans", inter.variable)} suppressHydrationWarning>
      <body>
        <Toaster />

        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
