"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { Vote, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"


export default function LoginPage() {
  const [voterId, setVoterId] = useState("")
  const [loading, setLoading] = useState(false)

  const handleVoterLogin = async () => {
    if (!voterId.trim()) return

    setLoading(true)
    try {
      const { data, error } = await supabase.from("voters").select("*").eq("voter_id", voterId.trim()).single()

      if (error || !data) {
        alert("Invalid Voter ID. Please check your ID and try again.")
        return
      }

      if (data.has_voted) {
        alert("You have already voted in this election!")
        return
      }

      window.location.href = `/ballot?voterId=${data.id}&voterIdNumber=${data.voter_id}`
    } catch (error) {
      alert("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden animate-fade-in">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Orbs */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"
            style={{
              width: Math.random() * 200 + 100 + "px",
              height: Math.random() * 200 + 100 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              animationDelay: Math.random() * 3 + "s",
              animationDuration: Math.random() * 4 + 3 + "s",
            }}
          />
        ))}

        {/* Geometric Shapes */}
        <div
          className="absolute top-20 left-20 w-32 h-32 border-2 border-white/10 rotate-45 animate-spin"
          style={{ animationDuration: "20s" }}
        />
        <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-purple-300/20 rotate-12 animate-bounce" />
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full animate-pulse" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse" />
              <div className="relative bg-white rounded-full p-4 mx-auto w-32 h-32 flex items-center justify-center shadow-2xl">
                <Image src="/images/logo.png" alt="E-Voting Logo" width={80} height={80} className="object-contain" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 animate-slide-up">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                E-Voting System
              </span>
            </h1>
            <p className="text-white/80 text-lg animate-slide-up" style={{ animationDelay: "0.2s" }}>
              Secure • Transparent • Democratic
            </p>
            <Badge variant="outline" className="mt-4 px-4 py-2 border-green-400 text-green-400 animate-pulse">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-ping" />
              Election Active
            </Badge>
          </div>

          {/* Login Form */}
          <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl animate-scale-in">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full flex items-center justify-center mb-4 animate-pulse">
                <User className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">Student Voter Login</CardTitle>
              <p className="text-white/70">Enter your Student ID to cast your vote</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="voterId" className="text-sm font-medium text-white/90">
                  Student ID
                </label>
                <Input
                  id="voterId"
                  placeholder="Enter your Student ID (e.g., V001)"
                  value={voterId}
                  onChange={(e) => setVoterId(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleVoterLogin()}
                  className="text-center text-lg font-mono bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 transition-all"
                />
              </div>
              <Button
                onClick={handleVoterLogin}
                disabled={loading || !voterId.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
                size="lg"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </div>
                ) : (
                  <>
                    <Vote className="w-5 h-5 mr-2" />
                    Access Ballot
                  </>
                )}
              </Button>

              {/* Admin Access Link */}
              <div className="text-center pt-4 border-t border-white/20">
                <Link
                  href="/admin/login"
                  className="text-white/70 hover:text-white text-sm transition-colors underline"
                >
                  Admin Access →
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Creator Credit */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <p className="text-white/50 text-sm">
          Created by <span className="text-white/70 font-medium">Sseruwagi Sinclaire Sebastian</span>
        </p>
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
