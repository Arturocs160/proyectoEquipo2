"use client";

import "./globals.css";
import Menu from "../components/Menu";
import { usePathname } from "next/navigation";
import { NextAuthProvider } from "@/providers/NextAuthProvider";
import { Roboto_Serif, Inter } from "next/font/google";

const robotoSerif = Roboto_Serif({
  subsets: ["latin"],
  variable: "--font-roboto-serif",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname();

  const hideMenuRoutes = ["/register", "/login", "/client/list-services", "/client/list-appointments", "/client/business",
    "/admin/dashboard", "/admin/services-list", "/admin/new-service", "/admin/edit-service",
    "/admin/employees-list", "/admin/new-employee", "/admin/edit-employee", "/admin/appointments-list",
    "/client/select-service", "/client/create-appointment", "/reset-password", "/new-password", "/client/client-data", "/admin/business",
  ]

  return (
    <html lang="es" className={inter.className}>
      <body className={`bg-primary`}>
        {!hideMenuRoutes.includes(pathname) && <Menu />}

        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
