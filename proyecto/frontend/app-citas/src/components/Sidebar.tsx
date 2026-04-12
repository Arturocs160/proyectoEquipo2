"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { signOutBackend } from "@/features/auth/actions/auth-actions";
import {
  LayoutDashboard,
  Calendar,
  Briefcase,
  Users,
  LogOut,
  Building2
} from "lucide-react";
import Logo from "@/components/Logo";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    // @ts-ignore
    const token = session?.user?.accessToken;
    if (token) {
      try {
        await signOutBackend(token);
      } catch (error) {
        console.error(error);
      }
    }
    signOut({ callbackUrl: "/login" });
  };

  const menuItems = [
    { name: "Panel", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Mis Citas", href: "/admin/appointments-list", icon: Calendar },
    { name: "Servicios", href: "/admin/services-list", icon: Briefcase },
    { name: "Empleados", href: "/admin/employees-list", icon: Users },
    { name: "Negocio", href: "/admin/business", icon: Building2 },
  ];

  return (
    <aside className="w-64 bg-white border-r border-black/5 flex flex-col p-6 sticky top-0 h-screen">
      <div className="mb-10 px-2">
        <Logo />
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-[#666] hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleSignOut}
        className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 transition-all duration-200 mt-auto"
      >
        <LogOut size={20} />
        Cerrar sesión
      </button>
    </aside>
  );
}
