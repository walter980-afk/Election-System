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
    // Extended animation sequence with more phases
    const timers = [
      setTimeout(() => setAnimationPhase(1), 300), // Particle explosion
      setTimeout(() => setAnimationPhase(2), 800), // Name entrance
      setTimeout(() => setAnimationPhase(3), 2500), // Holographic effect
      setTimeout(() => setAnimationPhase(4), 3500), // Matrix rain
      setTimeout(() => setAnimationPhase(5), 4500), // Final zoom out
      setTimeout(() => setShowIntro(false), 5500), // Transition to login
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
      <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden z-50 perspective-1000">
        {/* Dynamic Background Layers */}
        <div className="absolute inset-0">
          {/* Animated Grid */}
          <div className="absolute inset-0 opacity-20">
            <div className="grid-background animate-grid-move"></div>
          </div>

          {/* Particle Explosion System */}
          <div className="absolute inset-0">
            {[...Array(200)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-1 h-1 rounded-full transition-all duration-1000 ${
                  animationPhase >= 1 ? "animate-particle-explosion" : "opacity-0"
                }`}
                style={{
                  background: `hsl(${Math.random() * 360}, 70%, 60%)`,
                  top: "50%",
                  left: "50%",
                  animationDelay: Math.random() * 2 + "s",
                  animationDuration: Math.random() * 3 + 2 + "s",
                }}
              />
            ))}
          </div>

          {/* Matrix Rain Effect */}
          {animationPhase >= 4 && (
            <div className="absolute inset-0 opacity-30">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-green-400 text-xs font-mono animate-matrix-rain"
                  style={{
                    left: Math.random() * 100 + "%",
                    animationDelay: Math.random() * 2 + "s",
                    animationDuration: Math.random() * 3 + 2 + "s",
                  }}
                >
                  {Math.random().toString(36).substring(7)}
                </div>
              ))}
            </div>
          )}

          {/* Holographic Scanlines */}
          {animationPhase >= 3 && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="holographic-scanlines"></div>
            </div>
          )}
        </div>

        {/* Main Animation Container */}
        <div className="relative z-10 text-center transform-gpu">
          {/* Glitch Effect Container */}
          <div
            className={`relative transition-all duration-1000 ease-out ${
              animationPhase >= 2 ? "transform scale-100 opacity-100" : "transform scale-0 opacity-0"
            } ${animationPhase >= 5 ? "animate-final-zoom" : ""}`}
          >
            {/* Main Name with 3D Effect */}
            <div className="relative">
              {/* Glitch Layers */}
              <h1 className="absolute inset-0 text-6xl md:text-9xl font-black text-red-500 opacity-20 animate-glitch-1">
                SSERUWAGI SINCLAIRE SEBASTIAN
              </h1>
              <h1 className="absolute inset-0 text-6xl md:text-9xl font-black text-blue-500 opacity-20 animate-glitch-2">
                SSERUWAGI SINCLAIRE SEBASTIAN
              </h1>

              {/* Main Text with Individual Letter Animation */}
              <h1 className="relative text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 tracking-wider leading-tight">
                {"SSERUWAGI SINCLAIRE SEBASTIAN".split("").map((letter, index) => (
                  <span
                    key={index}
                    className={`inline-block animate-letter-3d ${letter === " " ? "mx-4" : ""}`}
                    style={{
                      animationDelay: `${index * 0.05}s`,
                      textShadow: `
                        0 0 10px currentColor,
                        0 0 20px currentColor,
                        0 0 40px currentColor,
                        0 0 80px currentColor
                      `,
                    }}
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </span>
                ))}
              </h1>

              {/* Holographic Overlay */}
              {animationPhase >= 3 && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-holographic-sweep"></div>
              )}
            </div>

            {/* Subtitle with Typewriter Effect */}
            <div className="mt-8 overflow-hidden">
              <p className="text-2xl md:text-4xl text-cyan-300 font-mono animate-typewriter">
                <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                  &gt; E-VOTING SYSTEM ARCHITECT
                </span>
                <span className="animate-cursor">|</span>
              </p>
            </div>

            {/* Floating Geometric Elements */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-float-geometric"
                  style={{
                    top: Math.random() * 100 + "%",
                    left: Math.random() * 100 + "%",
                    animationDelay: Math.random() * 2 + "s",
                    animationDuration: Math.random() * 4 + 3 + "s",
                  }}
                >
                  <div
                    className={`w-4 h-4 border-2 ${
                      i % 3 === 0
                        ? "border-cyan-400 rotate-45"
                        : i % 3 === 1
                          ? "border-purple-400 rounded-full"
                          : "border-pink-400"
                    } animate-spin`}
                    style={{ animationDuration: Math.random() * 3 + 2 + "s" }}
                  ></div>
                </div>
              ))}
            </div>

            {/* Energy Orbs */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-8 h-8 rounded-full animate-energy-orb"
                  style={{
                    background: `radial-gradient(circle, hsl(${i * 60}, 70%, 60%), transparent)`,
                    top: Math.random() * 100 + "%",
                    left: Math.random() * 100 + "%",
                    animationDelay: Math.random() * 3 + "s",
                    animationDuration: Math.random() * 4 + 3 + "s",
                    boxShadow: `0 0 20px hsl(${i * 60}, 70%, 60%)`,
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* Loading Progress Bar */}
          {animationPhase >= 4 && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-80">
              <div className="text-cyan-400 text-sm font-mono mb-2">INITIALIZING SYSTEM...</div>
              <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 animate-loading-bar"></div>
              </div>
            </div>
          )}
        </div>

        {/* Advanced CSS Animations */}
        <style jsx>{`
          .perspective-1000 {
            perspective: 1000px;
          }

          .grid-background {
            background-image: 
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
            background-size: 50px 50px;
            width: 200%;
            height: 200%;
          }

          @keyframes grid-move {
            0% { transform: translate(0, 0); }
            100% { transform: translate(-50px, -50px); }
          }

          @keyframes particle-explosion {
            0% { 
              transform: translate(0, 0) scale(0); 
              opacity: 1; 
            }
            50% { 
              opacity: 1; 
            }
            100% { 
              transform: translate(
                ${Math.random() * 800 - 400}px, 
                ${Math.random() * 800 - 400}px
              ) scale(1); 
              opacity: 0; 
            }
          }

          @keyframes letter-3d {
            0% { 
              transform: rotateY(90deg) rotateX(45deg) scale(0); 
              opacity: 0; 
            }
            50% { 
              transform: rotateY(45deg) rotateX(22.5deg) scale(1.2); 
              opacity: 0.8; 
            }
            100% { 
              transform: rotateY(0deg) rotateX(0deg) scale(1); 
              opacity: 1; 
            }
          }

          @keyframes glitch-1 {
            0%, 100% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
          }

          @keyframes glitch-2 {
            0%, 100% { transform: translate(0); }
            20% { transform: translate(2px, -2px); }
            40% { transform: translate(2px, 2px); }
            60% { transform: translate(-2px, -2px); }
            80% { transform: translate(-2px, 2px); }
          }

          @keyframes holographic-sweep {
            0% { transform: translateX(-100%) skewX(-15deg); }
            100% { transform: translateX(200%) skewX(-15deg); }
          }

          @keyframes typewriter {
            from { width: 0; }
            to { width: 100%; }
          }

          @keyframes cursor {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }

          @keyframes matrix-rain {
            0% { 
              transform: translateY(-100vh); 
              opacity: 0; 
            }
            10% { 
              opacity: 1; 
            }
            90% { 
              opacity: 1; 
            }
            100% { 
              transform: translateY(100vh); 
              opacity: 0; 
            }
          }

          @keyframes float-geometric {
            0%, 100% { 
              transform: translateY(0) rotate(0deg); 
            }
            50% { 
              transform: translateY(-20px) rotate(180deg); 
            }
          }

          @keyframes energy-orb {
            0%, 100% { 
              transform: scale(0.5) rotate(0deg); 
              opacity: 0.3; 
            }
            50% { 
              transform: scale(1.5) rotate(180deg); 
              opacity: 0.8; 
            }
          }

          @keyframes loading-bar {
            0% { width: 0%; }
            100% { width: 100%; }
          }

          @keyframes final-zoom {
            0% { 
              transform: scale(1); 
              opacity: 1; 
            }
            100% { 
              transform: scale(0.1) rotateY(90deg); 
              opacity: 0; 
            }
          }

          .holographic-scanlines {
            background: repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 255, 255, 0.1) 2px,
              rgba(0, 255, 255, 0.1) 4px
            );
            animation: scanlines 2s linear infinite;
          }

          @keyframes scanlines {
            0% { transform: translateY(0); }
            100% { transform: translateY(4px); }
          }

          .animate-grid-move {
            animation: grid-move 20s linear infinite;
          }

          .animate-particle-explosion {
            animation: particle-explosion 3s ease-out forwards;
          }

          .animate-letter-3d {
            animation: letter-3d 1s ease-out forwards;
          }

          .animate-glitch-1 {
            animation: glitch-1 0.3s infinite;
          }

          .animate-glitch-2 {
            animation: glitch-2 0.3s infinite reverse;
          }

          .animate-holographic-sweep {
            animation: holographic-sweep 2s ease-in-out infinite;
          }

          .animate-typewriter {
            animation: typewriter 2s steps(30) forwards;
            white-space: nowrap;
            overflow: hidden;
            border-right: 2px solid;
          }

          .animate-cursor {
            animation: cursor 1s infinite;
          }

          .animate-matrix-rain {
            animation: matrix-rain 5s linear infinite;
          }

          .animate-float-geometric {
            animation: float-geometric 6s ease-in-out infinite;
          }

          .animate-energy-orb {
            animation: energy-orb 4s ease-in-out infinite;
          }

          .animate-loading-bar {
            animation: loading-bar 2s ease-out forwards;
          }

          .animate-final-zoom {
            animation: final-zoom 1s ease-in forwards;
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
