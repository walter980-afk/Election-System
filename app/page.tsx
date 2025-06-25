"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { Vote, User, HelpCircle, BarChart3, FileText, Info, Sparkles, Shield, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function LoginPage() {
  const [voterId, setVoterId] = useState("")
  const [loading, setLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [focusedInput, setFocusedInput] = useState(false)

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const logoVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
        type: "spring",
        stiffness: 100
      }
    }
  }

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const sparkleVariants = {
    animate: {
      rotate: [0, 360],
      scale: [1, 1.2, 1],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "linear"
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Orbs with Motion */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20"
            style={{
              width: Math.random() * 200 + 100 + "px",
              height: Math.random() * 200 + 100 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Geometric Shapes with Enhanced Animation */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 border-2 border-white/10"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div
          className="absolute bottom-20 right-20 w-24 h-24 border-2 border-purple-300/20"
          animate={{
            rotate: [0, -360],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Sparkle Effects */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute"
            style={{
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
            }}
            variants={sparkleVariants}
            animate="animate"
          >
            <Sparkles className="w-4 h-4 text-yellow-300/40" />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 min-h-screen flex items-center justify-center p-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <motion.div
            className="text-center mb-8"
            variants={itemVariants}
          >
            <motion.div
              className="relative mb-6"
              variants={logoVariants}
            >
              <motion.div
                className="absolute inset-0 bg-white/20 rounded-full blur-xl"
                variants={pulseVariants}
                animate="animate"
              />
              <motion.div
                className="relative bg-white rounded-full p-4 mx-auto w-32 h-32 flex items-center justify-center shadow-2xl"
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Image src="/images/logo.png" alt="E-Voting Logo" width={80} height={80} className="object-contain" />
              </motion.div>
            </motion.div>

            <motion.h1
              className="text-4xl font-bold text-white mb-2"
              variants={itemVariants}
            >
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                E-Voting System
              </span>
            </motion.h1>

            <motion.p
              className="text-white/80 text-lg"
              variants={itemVariants}
            >
              Secure • Transparent • Democratic
            </motion.p>

            <motion.div variants={itemVariants}>
              <Badge variant="outline" className="mt-4 px-4 py-2 border-green-400 text-green-400">
                <motion.div
                  className="w-2 h-2 bg-green-400 rounded-full mr-2"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                Election Active
              </Badge>
            </motion.div>
          </motion.div>

          {/* Enhanced Login Form */}
          <motion.div variants={itemVariants}>
            <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-2xl overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              <CardHeader className="text-center pb-4 relative z-10">
                <motion.div
                  className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full flex items-center justify-center mb-4"
                  variants={floatingVariants}
                  animate="animate"
                >
                  <User className="w-8 h-8 text-white" />
                </motion.div>
                <CardTitle className="text-2xl text-white">Student Voter Login</CardTitle>
                <p className="text-white/70">Enter your Student ID to cast your vote</p>
              </CardHeader>

              <CardContent className="space-y-6 relative z-10">
                <div className="space-y-2">
                  <label htmlFor="voterId" className="text-sm font-medium text-white/90">
                    Student ID
                  </label>
                  <motion.div
                    animate={{
                      scale: focusedInput ? 1.02 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      id="voterId"
                      placeholder="Enter your Student ID (e.g., V001)"
                      value={voterId}
                      onChange={(e) => setVoterId(e.target.value)}
                      onFocus={() => setFocusedInput(true)}
                      onBlur={() => setFocusedInput(false)}
                      onKeyPress={(e) => e.key === "Enter" && handleVoterLogin()}
                      className="text-center text-lg font-mono bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 transition-all"
                    />
                  </motion.div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleVoterLogin}
                    disabled={loading || !voterId.trim()}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                    size="lg"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <AnimatePresence mode="wait">
                      {loading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <motion.div
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Verifying...
                        </motion.div>
                      ) : (
                        <motion.div
                          key="default"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <Vote className="w-5 h-5" />
                          <motion.span
                            animate={{
                              x: isHovered ? 5 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                          >
                            Access Ballot
                          </motion.span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>

                {/* Enhanced Quick Links */}
                <motion.div
                  className="space-y-3 pt-4 border-t border-white/20"
                  variants={itemVariants}
                >
                  <motion.div
                    className="grid grid-cols-2 gap-2"
                    variants={containerVariants}
                  >
                    {[
                      { href: "/results", icon: BarChart3, label: "Results" },
                      { href: "/help", icon: HelpCircle, label: "Help" },
                      { href: "/about", icon: Info, label: "About" },
                      { href: "/documentation", icon: FileText, label: "Docs" },
                    ].map((link, index) => (
                      <motion.div
                        key={link.href}
                        variants={itemVariants}
                        whileHover={{
                          scale: 1.05,
                          y: -2,
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link href={link.href}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-white/80 border-white/30 hover:bg-white/10 transition-all duration-200"
                          >
                            <link.icon className="w-4 h-4 mr-1" />
                            {link.label}
                          </Button>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>

                {/* Admin Access Link */}
                <motion.div
                  className="text-center pt-4 border-t border-white/20"
                  variants={itemVariants}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="/admin/login"
                      className="text-white/70 hover:text-white text-sm transition-colors underline flex items-center justify-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      Admin Access →
                    </Link>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Creator Credit */}
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <motion.p
          className="text-white/50 text-sm"
          whileHover={{
            scale: 1.05,
            color: "rgba(255, 255, 255, 0.8)",
          }}
          transition={{ duration: 0.2 }}
        >
          Created by <span className="text-white/70 font-medium">Sseruwagi Sinclaire Sebastian</span>
        </motion.p>
      </motion.div>

      {/* Floating Action Indicators */}
      <motion.div
        className="absolute top-1/2 right-8 transform -translate-y-1/2 space-y-4"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        {[
          { icon: Vote, label: "Vote Now", color: "text-green-400" },
          { icon: BarChart3, label: "Live Results", color: "text-blue-400" },
          { icon: Clock, label: "Real-time", color: "text-purple-400" },
        ].map((item, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-2 text-white/60"
            animate={{
              x: [0, 10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: index * 0.5,
              ease: "easeInOut"
            }}
          >
            <item.icon className={`w-5 h-5 ${item.color}`} />
            <span className="text-sm hidden lg:block">{item.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}