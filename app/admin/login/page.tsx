"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { Shield, Eye, EyeOff, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleAdminLogin = async () => {
    if (!credentials.username || !credentials.password) {
      alert("Please enter both username and password")
      return
    }

    setLoading(true)
    try {
      const { data: adminUser } = await supabase
        .from("admin_users")
        .select("*")
        .eq("username", credentials.username)
        .single()

      if (!adminUser) {
        alert("Invalid credentials")
        setLoading(false)
        return
      }

      // In a real app, you'd verify the password hash
      // For demo purposes, we'll check against 'admin123'
      if (credentials.password !== "admin123") {
        alert("Invalid credentials")
        setLoading(false)
        return
      }

      // Store user info in localStorage for role-based access
      localStorage.setItem("adminUser", JSON.stringify(adminUser))

      // Redirect based on role
      if (adminUser.role === "super_admin") {
        window.location.href = "/admin"
      } else {
        window.location.href = "/admin/results-dashboard"
      }
    } catch (error) {
      alert("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Orbs */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-red-400/20 to-orange-400/20 animate-pulse"
            style={{
              width: Math.random() * 150 + 80 + "px",
              height: Math.random() * 150 + 80 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              animationDelay: Math.random() * 3 + "s",
              animationDuration: Math.random() * 4 + 3 + "s",
            }}
          />
        ))}

        {/* Geometric Shapes */}
        <div
          className="absolute top-20 right-20 w-28 h-28 border-2 border-red-400/20 rotate-45 animate-spin"
          style={{ animationDuration: "25s" }}
        />
        <div className="absolute bottom-20 left-20 w-20 h-20 border-2 border-orange-300/20 rotate-12 animate-bounce" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Back to Student Login */}
          <div className="mb-6">
            <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Student Login
            </Link>
          </div>

          {/* Logo and Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
              <div className="relative bg-white rounded-full p-4 mx-auto w-32 h-32 flex items-center justify-center shadow-2xl">
                <Image src="/images/logo.png" alt="E-Voting Logo" width={80} height={80} className="object-contain" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 animate-slide-up">
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                Admin Portal
              </span>
            </h1>
            <p className="text-white/80 text-lg animate-slide-up" style={{ animationDelay: "0.2s" }}>
              Election Management System
            </p>
            <Badge variant="outline" className="mt-4 px-4 py-2 border-red-400 text-red-400 animate-pulse">
              <Shield className="w-4 h-4 mr-2" />
              Secure Access
            </Badge>
          </div>

          {/* Login Form */}
          <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl animate-scale-in">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-400/20 to-orange-400/20 rounded-full flex items-center justify-center mb-4 animate-pulse">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">Administrator Login</CardTitle>
              <p className="text-white/70">Access election management dashboard</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-white/90">
                  Username
                </label>
                <Input
                  id="username"
                  placeholder="Enter username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-white/90">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    onKeyPress={(e) => e.key === "Enter" && handleAdminLogin()}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button
                onClick={handleAdminLogin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-200"
                size="lg"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Authenticating...
                  </div>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Access Dashboard
                  </>
                )}
              </Button>

              {/* Demo Credentials */}
              <div className="text-center text-sm text-white/60 space-y-3 pt-4 border-t border-white/20">
                <p className="font-medium">Demo Accounts:</p>
                <div className="space-y-2">
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/80 font-medium">Super Admin</p>
                    <p className="text-xs">
                      <code className="bg-white/10 px-2 py-1 rounded text-white/80">sinclairesebastian</code> /
                      <code className="bg-white/10 px-2 py-1 rounded text-white/80 ml-1">admin123</code>
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/80 font-medium">Chairperson</p>
                    <p className="text-xs">
                      <code className="bg-white/10 px-2 py-1 rounded text-white/80">chairperson</code> /
                      <code className="bg-white/10 px-2 py-1 rounded text-white/80 ml-1">admin123</code>
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/80 font-medium">Head Teacher</p>
                    <p className="text-xs">
                      <code className="bg-white/10 px-2 py-1 rounded text-white/80">headteacher</code> /
                      <code className="bg-white/10 px-2 py-1 rounded text-white/80 ml-1">admin123</code>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes scale-in {
          from { 
            opacity: 0; 
            transform: scale(0.9); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scale-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
