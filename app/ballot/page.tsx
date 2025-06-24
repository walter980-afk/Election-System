"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/lib/supabase"
import { CheckCircle, ArrowLeft, User, Vote, Clock, AlertTriangle, Crown, Star, Trophy } from "lucide-react"
import Link from "next/link"

interface Post {
  id: string
  title: string
  description: string
  category: string
  candidates: Candidate[]
}

interface Candidate {
  id: string
  name: string
  gender: string
}

interface Voter {
  id: string
  voter_id: string
  name: string
}

export default function BallotPage() {
  const searchParams = useSearchParams()
  const voterId = searchParams.get("voterId")
  const voterIdNumber = searchParams.get("voterIdNumber")

  const [voter, setVoter] = useState<Voter | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedCandidates, setSelectedCandidates] = useState<Record<string, string>>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes in seconds
  const [showTimeWarning, setShowTimeWarning] = useState(false)
  const [selectedAnimation, setSelectedAnimation] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionDirection, setTransitionDirection] = useState<"next" | "prev">("next")

  // Timer effect
  useEffect(() => {
    if (loading || submitted) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up - auto logout
          handleTimeUp()
          return 0
        }

        // Show warning at 30 seconds
        if (prev === 30) {
          setShowTimeWarning(true)
        }

        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [loading, submitted])

  const handleTimeUp = useCallback(() => {
    alert("⏰ Time's up! You will be automatically logged out for security.")
    window.location.href = "/"
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  useEffect(() => {
    if (!voterId) {
      window.location.href = "/"
      return
    }
    loadVoterAndBallot()
  }, [voterId])

  const loadVoterAndBallot = async () => {
    try {
      const { data: voterData } = await supabase.from("voters").select("*").eq("id", voterId).single()

      if (!voterData) {
        window.location.href = "/"
        return
      }

      setVoter(voterData)

      const { data: election } = await supabase.from("elections").select("id").eq("is_active", true).single()

      if (!election) return

      const { data: postsData } = await supabase
        .from("posts")
        .select(`
          id,
          title,
          description,
          category,
          candidates (
            id,
            name,
            gender
          )
        `)
        .eq("election_id", election.id)
        .order("order_index")

      setPosts(postsData || [])
    } catch (error) {
      console.error("Error loading ballot:", error)
      window.location.href = "/"
    } finally {
      setLoading(false)
    }
  }

  const handleCandidateSelect = (postId: string, candidateId: string, candidateName: string) => {
    // Trigger selection animation
    setSelectedAnimation(candidateId)

    // Update selection
    setSelectedCandidates((prev) => ({
      ...prev,
      [postId]: candidateId,
    }))

    // Create celebration effect
    createCelebrationEffect(candidateName)

    // Clear animation after delay
    setTimeout(() => {
      setSelectedAnimation(null)
    }, 1000)

    // Auto advance to next step with PowerPoint transition
    setTimeout(() => {
      if (currentStep < posts.length - 1) {
        setTransitionDirection("next")
        setIsTransitioning(true)

        // After transition animation, change the step
        setTimeout(() => {
          setCurrentStep(currentStep + 1)
          setIsTransitioning(false)
        }, 600) // Match the CSS transition duration
      }
    }, 1500)
  }

  const createCelebrationEffect = (candidateName: string) => {
    // Create floating text effect
    const celebration = document.createElement("div")
    celebration.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
        pointer-events: none;
        font-size: 2rem;
        font-weight: bold;
        color: #10b981;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        animation: celebrationPop 1.5s ease-out forwards;
      ">
        ✨ ${candidateName} Selected! ✨
      </div>
    `

    document.body.appendChild(celebration)

    // Remove after animation
    setTimeout(() => {
      document.body.removeChild(celebration)
    }, 1500)

    // Add confetti effect
    createConfetti()
  }

  const createConfetti = () => {
    const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7", "#dda0dd"]

    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement("div")
      confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        top: -10px;
        left: ${Math.random() * 100}vw;
        z-index: 1000;
        pointer-events: none;
        border-radius: 50%;
        animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
      `

      document.body.appendChild(confetti)

      setTimeout(() => {
        if (document.body.contains(confetti)) {
          document.body.removeChild(confetti)
        }
      }, 5000)
    }
  }

  const handleVote = async () => {
    if (!voter || Object.keys(selectedCandidates).length !== posts.length) return

    setSubmitting(true)
    try {
      const { data: election } = await supabase.from("elections").select("id").eq("is_active", true).single()

      if (!election) return

      const votes = Object.entries(selectedCandidates).map(([postId, candidateId]) => ({
        voter_id: voter.id,
        candidate_id: candidateId,
        post_id: postId,
        election_id: election.id,
      }))

      await supabase.from("votes").insert(votes)

      await supabase
        .from("voters")
        .update({
          has_voted: true,
          voted_at: new Date().toISOString(),
        })
        .eq("id", voter.id)

      setSubmitted(true)
    } catch (error) {
      alert("Voting failed. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < posts.length - 1) {
      setTransitionDirection("next")
      setIsTransitioning(true)

      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        setIsTransitioning(false)
      }, 600)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setTransitionDirection("prev")
      setIsTransitioning(true)

      setTimeout(() => {
        setCurrentStep(currentStep - 1)
        setIsTransitioning(false)
      }, 600)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Senior Leadership":
        return <Crown className="w-6 h-6" />
      case "Entertainment":
        return <Star className="w-6 h-6" />
      case "Games and Sports":
        return <Trophy className="w-6 h-6" />
      default:
        return <Vote className="w-6 h-6" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Senior Leadership":
        return "from-purple-500 via-indigo-500 to-blue-500"
      case "Entertainment":
        return "from-pink-500 via-rose-500 to-red-500"
      case "Games and Sports":
        return "from-green-500 via-emerald-500 to-teal-500"
      case "Information":
        return "from-blue-500 via-cyan-500 to-sky-500"
      case "Uniform":
        return "from-gray-500 via-slate-500 to-zinc-500"
      case "Mess":
        return "from-orange-500 via-amber-500 to-yellow-500"
      default:
        return "from-blue-500 via-purple-500 to-pink-500"
    }
  }

  const progress = posts.length > 0 ? ((currentStep + 1) / posts.length) * 100 : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading your ballot...</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center shadow-lg">
          <CardContent className="pt-8">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-green-800 mb-4">🎉 Vote Submitted!</h2>
            <p className="text-gray-600 mb-2">Thank you, {voter?.name}!</p>
            <p className="text-gray-600 mb-8">Your vote counts.</p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentPost = posts.length > 0 ? posts[currentStep] : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-400 animate-pulse"
              style={{
                width: Math.random() * 100 + 50 + "px",
                height: Math.random() * 100 + 50 + "px",
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
                animationDelay: Math.random() * 2 + "s",
                animationDuration: Math.random() * 3 + 2 + "s",
              }}
            />
          ))}
        </div>
      </div>

      {/* Header with Timer */}
      <header className="bg-white/90 backdrop-blur-sm border-b relative z-10">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Login</span>
          </Link>

          {/* Timer Display */}
          <div
            className={`flex items-center gap-3 px-4 py-2 rounded-full transition-all ${
              timeLeft <= 30 ? "bg-red-100 border-2 border-red-500 animate-pulse" : "bg-blue-100 border border-blue-300"
            }`}
          >
            <Clock className={`w-5 h-5 ${timeLeft <= 30 ? "text-red-600" : "text-blue-600"}`} />
            <span className={`font-mono text-lg font-bold ${timeLeft <= 30 ? "text-red-600" : "text-blue-600"}`}>
              {formatTime(timeLeft)}
            </span>
            {timeLeft <= 30 && <AlertTriangle className="w-5 h-5 text-red-600 animate-bounce" />}
          </div>

          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-600" />
            <div className="text-right">
              <p className="font-medium">{voter?.name}</p>
              <p className="text-sm text-gray-600">ID: {voterIdNumber}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Time Warning Modal */}
      {showTimeWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 border-red-500 border-2">
            <CardContent className="pt-6 text-center">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4 animate-bounce" />
              <h3 className="text-xl font-bold text-red-600 mb-2">⚠️ Time Warning!</h3>
              <p className="text-gray-600 mb-4">You have less than 30 seconds remaining!</p>
              <Button onClick={() => setShowTimeWarning(false)} className="bg-red-500 hover:bg-red-600">
                Continue Voting
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="container mx-auto px-4 py-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Progress Header */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🏫 Prefectorial Elections
              </h1>
              <Badge variant="outline" className="px-3 py-1">
                Step {posts.length > 0 ? currentStep + 1 : 0} of {posts.length}
              </Badge>
            </div>
            <Progress value={progress} className="h-3 mb-1" />
            <p className="text-xs text-gray-600 text-center font-medium">{Math.round(progress)}% Complete</p>
          </div>

          {/* Current Position with PowerPoint Transition */}
          {posts.length === 0 ? (
            <Card className="shadow-xl border border-blue-200 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white relative py-4">
                <CardTitle className="text-xl flex items-center gap-2 relative z-10">
                  No Positions Available
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 bg-gradient-to-br from-white to-blue-50">
                <p className="text-center py-8">There are currently no positions available for voting. Please check back later.</p>
              </CardContent>
            </Card>
          ) : currentPost && (
            <div className="relative mb-8 perspective-1000">
              <Card
                className={`shadow-xl border border-blue-200 overflow-hidden transition-all duration-600 ease-in-out transform-gpu ${
                  isTransitioning ? (transitionDirection === "next" ? "slide-out-left" : "slide-out-right") : "slide-in"
                }`}
              >
                <CardHeader
                  className={`bg-gradient-to-r ${getCategoryColor(currentPost.category)} text-white relative py-4`}
                >
                  <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                  <CardTitle className="text-xl flex items-center gap-2 relative z-10">
                    {getCategoryIcon(currentPost.category)}
                    {currentPost.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 relative z-10">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                      {currentPost.category}
                    </Badge>
                    <p className="opacity-90 text-sm">{currentPost.description}</p>
                  </div>
                </CardHeader>
                <CardContent className="p-4 bg-gradient-to-br from-white to-blue-50">
                  <div className="space-y-3">
                    {currentPost.candidates.map((candidate, index) => (
                      <div
                        key={candidate.id}
                        className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-102 ${
                          selectedCandidates[currentPost.id] === candidate.id
                            ? "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg scale-102"
                            : "border-gray-200 hover:border-blue-400 hover:shadow-md bg-white"
                        } ${selectedAnimation === candidate.id ? "animate-pulse scale-110" : ""}`}
                        onClick={() => handleCandidateSelect(currentPost.id, candidate.id, candidate.name)}
                        style={{
                          animationDelay: `${index * 0.1}s`,
                        }}
                      >
                        {/* Selection Glow Effect */}
                        {selectedCandidates[currentPost.id] === candidate.id && (
                          <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-xl animate-pulse"></div>
                        )}

                        <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                                selectedCandidates[currentPost.id] === candidate.id
                                  ? "bg-green-500 text-white"
                                  : candidate.gender === "Male"
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-pink-100 text-pink-600"
                              }`}
                            >
                              {candidate.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-800">{candidate.name}</h3>
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  candidate.gender === "Male"
                                    ? "border-blue-300 text-blue-700"
                                    : "border-pink-300 text-pink-700"
                                }`}
                              >
                                {candidate.gender}
                              </Badge>
                            </div>
                          </div>

                          {selectedCandidates[currentPost.id] === candidate.id && (
                            <div className="flex items-center gap-2 animate-bounce">
                              <CheckCircle className="w-8 h-8 text-green-500" />
                              <span className="text-green-600 font-bold text-lg">SELECTED!</span>
                            </div>
                          )}
                        </div>

                        {/* Sparkle Effect for Selected */}
                        {selectedCandidates[currentPost.id] === candidate.id && (
                          <div className="absolute top-2 right-2">
                            <div className="text-2xl animate-spin">✨</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mb-8">
            {posts.length === 0 ? (
              <Button asChild className="mx-auto bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all" size="lg">
                <Link href="/">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Return to Login
                </Link>
              </Button>
            ) : (
              <>
                <Button
                  onClick={prevStep}
                  disabled={currentStep === 0 || isTransitioning}
                  variant="outline"
                  size="lg"
                  className="hover:scale-105 transition-transform"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Previous
                </Button>

                {currentStep === posts.length - 1 ? (
                  <Button
                    onClick={handleVote}
                    disabled={submitting || Object.keys(selectedCandidates).length !== posts.length}
                    className="bg-green-600 hover:bg-green-700 hover:scale-105 transition-all"
                    size="lg"
                  >
                    {submitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting Vote...
                      </div>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        🗳️ Submit My Vote!
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={nextStep}
                    disabled={!selectedCandidates[currentPost?.id] || isTransitioning}
                    size="lg"
                    className="hover:scale-105 transition-transform"
                  >
                    Next Position
                    <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Position Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
            {posts.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-4">
                No positions available for voting
              </div>
            ) : posts.map((post, index) => (
              <div
                key={post.id}
                className={`p-2 rounded-lg text-center transition-all duration-300 text-xs ${
                  index === currentStep
                    ? `bg-gradient-to-r ${getCategoryColor(post.category)} text-white border border-blue-600 shadow-md`
                    : selectedCandidates[post.id]
                      ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white border border-green-400"
                      : "bg-white border border-gray-300 hover:border-blue-400"
                }`}
              >
                <div className="flex items-center justify-center mb-2">{getCategoryIcon(post.category)}</div>
                <h4 className="font-bold text-sm mb-2">{post.title}</h4>
                <Badge
                  variant="outline"
                  className={index === currentStep || selectedCandidates[post.id] ? "border-white/30 text-white" : ""}
                >
                  {post.category}
                </Badge>
                {selectedCandidates[post.id] && (
                  <div className="flex items-center justify-center gap-2 text-sm mt-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">Vote Cast ✨</span>
                  </div>
                )}
                {index === currentStep && !selectedCandidates[post.id] && (
                  <div className="text-sm opacity-90 animate-bounce mt-2">👆 Vote Now!</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .slide-in {
          animation: slideIn 0.6s ease-out forwards;
        }
        
        .slide-out-left {
          animation: slideOutLeft 0.6s ease-in forwards;
        }
        
        .slide-out-right {
          animation: slideOutRight 0.6s ease-in forwards;
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%) rotateY(-15deg);
            opacity: 0;
          }
          to {
            transform: translateX(0) rotateY(0deg);
            opacity: 1;
          }
        }
        
        @keyframes slideOutLeft {
          from {
            transform: translateX(0) rotateY(0deg);
            opacity: 1;
          }
          to {
            transform: translateX(-100%) rotateY(15deg);
            opacity: 0;
          }
        }
        
        @keyframes slideOutRight {
          from {
            transform: translateX(0) rotateY(0deg);
            opacity: 1;
          }
          to {
            transform: translateX(100%) rotateY(-15deg);
            opacity: 0;
          }
        }

        @keyframes celebrationPop {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1) translateY(-100px);
            opacity: 0;
          }
        }
        
        @keyframes confettiFall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
