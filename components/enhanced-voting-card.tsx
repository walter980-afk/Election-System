"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Trophy, Crown, Star } from "lucide-react"

interface EnhancedVotingCardProps {
  candidate: {
    id: string
    name: string
    gender: string
  }
  isSelected: boolean
  onSelect: () => void
  index: number
  category: string
}

export function EnhancedVotingCard({ 
  candidate, 
  isSelected, 
  onSelect, 
  index, 
  category 
}: EnhancedVotingCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Senior Leadership":
        return <Crown className="w-5 h-5" />
      case "Entertainment":
        return <Star className="w-5 h-5" />
      case "Games and Sports":
        return <Trophy className="w-5 h-5" />
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
      }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.02,
        y: -5,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className={`cursor-pointer transition-all duration-300 transform ${
          isSelected
            ? "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg scale-102 ring-2 ring-green-200"
            : "border-gray-200 hover:border-blue-400 hover:shadow-md bg-white"
        }`}
        onClick={onSelect}
      >
        {/* Selection Glow Effect */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>

        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
                  isSelected
                    ? "bg-green-500 text-white"
                    : candidate.gender === "Male"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-pink-100 text-pink-600"
                }`}
                animate={isSelected ? {
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                } : {}}
                transition={{ duration: 0.5 }}
              >
                {candidate.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </motion.div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(category)}
                  <h3 className="text-xl font-bold text-gray-800">{candidate.name}</h3>
                </div>
                <Badge
                  variant="outline"
                  className={`text-sm ${
                    candidate.gender === "Male"
                      ? "border-blue-300 text-blue-700"
                      : "border-pink-300 text-pink-700"
                  }`}
                >
                  {candidate.gender}
                </Badge>
              </div>
            </div>

            <AnimatePresence>
              {isSelected && (
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, scale: 0, x: 20 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    x: 0,
                    rotate: [0, 10, -10, 0]
                  }}
                  exit={{ opacity: 0, scale: 0, x: 20 }}
                  transition={{ 
                    duration: 0.4,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <span className="text-green-600 font-bold text-lg">SELECTED!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sparkle Effect for Selected */}
          <AnimatePresence>
            {isSelected && (
              <motion.div
                className="absolute top-4 right-4"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  rotate: [0, 360]
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ 
                  duration: 0.6,
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" }
                }}
              >
                <div className="text-3xl">✨</div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}