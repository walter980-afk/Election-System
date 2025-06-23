"use client"

import { useState, useEffect } from "react"
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
  const [showIntro, setShowIntro] = useState(true)
  const [animationPhase, setAnimationPhase] = useState(0)

  useEffect(() => {
    // Faster, more visible animation sequence
    const timers = [
      setTimeout(() => setAnimationPhase(1), 200), // Corporate particles
      setTimeout(() => setAnimationPhase(2), 500), // Name entrance - FASTER
      setTimeout(() => setAnimationPhase(3), 2000), // Professional glow
      setTimeout(() => setAnimationPhase(4), 3000), // Data streams
      setTimeout(() => setAnimationPhase(5), 4000), // Final transition
      setTimeout(() => setShowIntro(false), 5000), // To login - SHORTER
    ]

    return () => timers.forEach(clearTimeout)
  }, [])

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

  if (showIntro) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center overflow-hidden z-50">
        {/* Corporate Background Elements */}
        <div className="absolute inset-0">
          {/* Professional Grid */}
          <div className="absolute inset-0 opacity-10">
            <div className="corporate-grid animate-grid-slide"></div>
          </div>

          {/* Corporate Particle System */}
          <div className="absolute inset-0">
            {[...Array(80)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-1 h-1 rounded-full transition-all duration-1500 ${
                  animationPhase >= 1 ? "animate-corporate-particles" : "opacity-0"
                }`}
                style={{
                  background: `hsl(${210 + Math.random() * 30}, 70%, ${60 + Math.random() * 20}%)`,
                  top: "50%",
                  left: "50%",
                  animationDelay: Math.random() * 2 + "s",
                  animationDuration: Math.random() * 3 + 2 + "s",
                }}
              />
            ))}
          </div>

          {/* Data Stream Effect */}
          {animationPhase >= 4 && (
            <div className="absolute inset-0 opacity-20">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-blue-300 text-xs font-mono animate-data-stream"
                  style={{
                    left: Math.random() * 100 + "%",
                    animationDelay: Math.random() * 2 + "s",
                    animationDuration: Math.random() * 4 + 3 + "s",
                  }}
                >
                  {["01", "10", "11", "00"][Math.floor(Math.random() * 4)]}
                </div>
              ))}
            </div>
          )}

          {/* Professional Light Rays */}
          {animationPhase >= 3 && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="professional-rays"></div>
            </div>
          )}
        </div>

        {/* Main Content Container */}
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
          <div
            className={`transition-all duration-1000 ease-out ${
              animationPhase >= 2 ? "transform scale-100 opacity-100" : "transform scale-50 opacity-0"
            } ${animationPhase >= 5 ? "animate-professional-exit" : ""}`}
          >
            {/* Corporate Name Display */}
            <div className="relative mb-8">
              {/* Main Name - Solid White Text for Visibility */}
              <div className="space-y-4 antialiased">
                {/* First Name */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight tracking-tight drop-shadow-2xl">
                  {"SSERUWAGI".split("").map((letter, index) => (
                    <span
                      key={index}
                      className="inline-block animate-corporate-letter"
                      style={{
                        animationDelay: `${index * 0.08}s`,
                        textShadow: "0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.4)",
                      }}
                    >
                      {letter}
                    </span>
                  ))}
                </h1>

                {/* Second Name */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight tracking-tight drop-shadow-2xl">
                  {"SINCLAIRE".split("").map((letter, index) => (
                    <span
                      key={index}
                      className="inline-block animate-corporate-letter"
                      style={{
                        animationDelay: `${(index + 9) * 0.08}s`,
                        textShadow: "0 0 20px rgba(99, 102, 241, 0.8), 0 0 40px rgba(99, 102, 241, 0.4)",
                      }}
                    >
                      {letter}
                    </span>
                  ))}
                </h1>

                {/* Third Name */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight tracking-tight drop-shadow-2xl">
                  {"SEBASTIAN".split("").map((letter, index) => (
                    <span
                      key={index}
                      className="inline-block animate-corporate-letter"
                      style={{
                        animationDelay: `${(index + 18) * 0.08}s`,
                        textShadow: "0 0 20px rgba(34, 211, 238, 0.8), 0 0 40px rgba(34, 211, 238, 0.4)",
                      }}
                    >
                      {letter}
                    </span>
                  ))}
                </h1>
              </div>

              {/* Blue Glow Background for Extra Visibility */}
              <div className="absolute inset-0 bg-blue-500/10 rounded-lg blur-3xl -z-10"></div>
            </div>

            {/* Professional Subtitle */}
            <div className="mt-8 mb-12">
              <div className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 rounded-full">
                <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold tracking-wide antialiased">
                  <span className="animate-professional-typewriter">CHIEF TECHNOLOGY OFFICER • E-VOTING SYSTEMS</span>
                </p>
              </div>
            </div>

            {/* Corporate Geometric Elements */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-corporate-float"
                  style={{
                    top: Math.random() * 100 + "%",
                    left: Math.random() * 100 + "%",
                    animationDelay: Math.random() * 2 + "s",
                    animationDuration: Math.random() * 6 + 4 + "s",
                  }}
                >
                  <div
                    className={`w-3 h-3 border border-blue-400/50 ${
                      i % 2 === 0 ? "rotate-45" : "rounded-full"
                    } animate-spin`}
                    style={{
                      animationDuration: Math.random() * 8 + 4 + "s",
                      boxShadow: "0 0 10px rgba(59, 130, 246, 0.3)",
                    }}
                  ></div>
                </div>
              ))}
            </div>

            {/* Professional Status Indicators */}
            <div className="flex justify-center space-x-8 mt-8">
              <div className="flex items-center space-x-2 text-blue-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-mono">SYSTEM ONLINE</span>
              </div>
              <div className="flex items-center space-x-2 text-indigo-300">
                <div
                  className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <span className="text-sm font-mono">SECURE CONNECTION</span>
              </div>
              <div className="flex items-center space-x-2 text-cyan-300">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: "1s" }}></div>
                <span className="text-sm font-mono">READY TO DEPLOY</span>
              </div>
            </div>
          </div>

          {/* Professional Loading Bar */}
          {animationPhase >= 4 && (
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-96 max-w-full px-4">
              <div className="text-blue-300 text-sm font-mono mb-3 text-center">INITIALIZING E-VOTING PLATFORM...</div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-blue-500/30">
                <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 animate-professional-loading shadow-lg shadow-blue-500/50"></div>
              </div>
              <div className="text-xs text-blue-400 font-mono mt-2 text-center">
                Powered by Advanced Security Protocols
              </div>
            </div>
          )}
        </div>

        {/* Professional CSS Animations */}
        <style jsx>{`
          .corporate-grid {
            background-image: 
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
            background-size: 60px 60px;
            width: 200%;
            height: 200%;
          }

          @keyframes grid-slide {
            0% { transform: translate(0, 0); }
            100% { transform: translate(-60px, -60px); }
          }

          @keyframes corporate-particles {
            0% { 
              transform: translate(0, 0) scale(0); 
              opacity: 1; 
            }
            50% { 
              opacity: 0.8; 
            }
            100% { 
              transform: translate(
                ${Math.random() * 400 - 200}px, 
                ${Math.random() * 400 - 200}px
              ) scale(1); 
              opacity: 0; 
            }
          }

          @keyframes corporate-letter {
            0% { 
              transform: translateY(30px) scale(0.8); 
              opacity: 0; 
            }
            50% { 
              transform: translateY(-5px) scale(1.05); 
              opacity: 0.9; 
            }
            100% { 
              transform: translateY(0) scale(1); 
              opacity: 1; 
            }
          }

          @keyframes professional-glow {
            0% { transform: translateX(-100%) skewX(-10deg); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateX(200%) skewX(-10deg); opacity: 0; }
          }

          @keyframes professional-typewriter {
            from { width: 0; opacity: 0; }
            to { width: 100%; opacity: 1; }
          }

          @keyframes data-stream {
            0% { 
              transform: translateY(-100vh) rotate(0deg); 
              opacity: 0; 
            }
            10% { 
              opacity: 0.6; 
            }
            90% { 
              opacity: 0.6; 
            }
            100% { 
              transform: translateY(100vh) rotate(360deg); 
              opacity: 0; 
            }
          }

          @keyframes corporate-float {
            0%, 100% { 
              transform: translateY(0) rotate(0deg) scale(1); 
            }
            33% { 
              transform: translateY(-15px) rotate(120deg) scale(1.1); 
            }
            66% { 
              transform: translateY(10px) rotate(240deg) scale(0.9); 
            }
          }

          @keyframes professional-loading {
            0% { width: 0%; }
            100% { width: 100%; }
          }

          @keyframes professional-exit {
            0% { 
              transform: scale(1) rotateY(0deg); 
              opacity: 1; 
            }
            100% { 
              transform: scale(0.3) rotateY(90deg); 
              opacity: 0; 
            }
          }

          .professional-rays {
            background: conic-gradient(
              from 0deg,
              transparent,
              rgba(59, 130, 246, 0.1),
              transparent,
              rgba(99, 102, 241, 0.1),
              transparent,
              rgba(34, 211, 238, 0.1),
              transparent
            );
            animation: rays-rotate 8s linear infinite;
          }

          @keyframes rays-rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .animate-grid-slide {
            animation: grid-slide 25s linear infinite;
          }

          .animate-corporate-particles {
            animation: corporate-particles 4s ease-out forwards;
          }

          .animate-corporate-letter {
            animation: corporate-letter 1s ease-out forwards;
          }

          .animate-professional-glow {
            animation: professional-glow 3s ease-in-out infinite;
          }

          .animate-professional-typewriter {
            animation: professional-typewriter 2s ease-out forwards;
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
          }

          .animate-data-stream {
            animation: data-stream 6s linear infinite;
          }

          .animate-corporate-float {
            animation: corporate-float 8s ease-in-out infinite;
          }

          .animate-professional-loading {
            animation: professional-loading 2.5s ease-out forwards;
          }

          .animate-professional-exit {
            animation: professional-exit 1s ease-in forwards;
          }
        `}</style>
      </div>
    )
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
              <div className="text-center text-sm text-white/60 space-y-2">
                <p className="font-medium">Demo Student IDs:</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  {["V001", "V002", "V003", "V004", "V005"].map((id) => (
                    <Badge
                      key={id}
                      variant="outline"
                      className="cursor-pointer hover:bg-white/20 border-white/30 text-white/80 hover:text-white transition-all transform hover:scale-105"
                      onClick={() => setVoterId(id)}
                    >
                      {id}
                    </Badge>
                  ))}
                </div>
              </div>

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
