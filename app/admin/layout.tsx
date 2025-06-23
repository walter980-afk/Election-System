"use client"

import { useEffect, useState } from "react"
import type React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Separator } from "@/components/ui/separator"
import { usePathname } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/admin/login") {
      setLoading(false)
      return
    }

    // Check if user is authenticated
    const adminUser = localStorage.getItem("adminUser")
    if (!adminUser) {
      window.location.href = "/admin/login"
      return
    }

    const user = JSON.parse(adminUser)

    // Check if user has super admin permissions for full admin access
    if (pathname.startsWith("/admin") && pathname !== "/admin/login" && pathname !== "/admin/results-dashboard") {
      if (user.role !== "super_admin") {
        window.location.href = "/admin/results-dashboard"
        return
      }
    }

    setIsAuthenticated(true)
    setLoading(false)
  }, [pathname])

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Don't wrap login page in sidebar layout
  if (pathname === "/admin/login" || pathname === "/admin/results-dashboard") {
    return <>{children}</>
  }

  // Only show sidebar layout for authenticated super admins
  if (!isAuthenticated) {
    return null
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Election Administration</h1>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
