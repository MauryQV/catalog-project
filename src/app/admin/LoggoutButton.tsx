"use client";

import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm px-3 py-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors text-left"
    >
      Cerrar sesión
    </button>
  );
}
