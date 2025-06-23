"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { Users, Vote, Trophy, BarChart3, Zap, Play, X, Crown, Star, TrendingUp } from "lucide-react"

interface DashboardStats {
  totalVoters: number
  votedCount: number
  totalCandidates: number
  totalVotes: number
}

interface PostResult {
  postId: string
  postTitle: string
  category: string
  candidates: {
    id: string
    name: string
    votes: number
    percentage: number
    isLeading: boolean
  }[]
  totalVotes: number
}

interface AnimatedResult {
  postId: string
  postTitle: string
  category: string
  candidates: {
    id: string
    name: string
    votes: number
    percentage: number
    isWinner: boolean
  }[]
  totalVotes: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalVoters: 0,
    votedCount: 0,
    totalCandidates: 0,
    totalVotes: 0,
  })
  const [loading, setLoading] = useState(true)
  const [showAnimatedView, setShowAnimatedView] = useState(false)
  const [animatedResults, setAnimatedResults] = useState<AnimatedResult[]>([])
  const [currentAnimationStep, setCurrentAnimationStep] = useState(0)
  const [animationPhase, setAnimationPhase] = useState<"overview" | "individual" | "complete">("overview")
  const [postResults, setPostResults] = useState<PostResult[]>([])

  useEffect(() => {
    // Check if user is authenticated and has super admin access
    const adminUser = localStorage.getItem("adminUser")
    if (!adminUser) {
      window.location.href = "/admin/login"
      return
    }

    const user = JSON.parse(adminUser)
    if (user.role !== "super_admin") {
      window.location.href = "/admin/results-dashboard"
      return
    }

    loadStats()
    loadPostResults()
  }, [])

  const loadStats = async () => {
    try {
      const [votersResult, candidatesResult, votesResult] = await Promise.all([
        supabase.from("voters").select("has_voted"),
        supabase.from("candidates").select("id"),
        supabase.from("votes").select("id"),
      ])

      const voters = votersResult.data || []
      const votedCount = voters.filter((v) => v.has_voted).length

      setStats({
        totalVoters: voters.length,
        votedCount,
        totalCandidates: candidatesResult.data?.length || 0,
        totalVotes: votesResult.data?.length || 0,
      })
    } catch (error) {
      console.error("Error loading stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadPostResults = async () => {
    try {
      const { data: election } = await supabase.from("elections").select("id").eq("is_active", true).single()
      if (!election) return

      const { data: postsData } = await supabase
        .from("posts")
        .select(`
          id,
          title,
          category,
          candidates (
            id,
            name
          )
        `)
        .eq("election_id", election.id)
        .order("order_index")
        .limit(6) // Show first 6 posts on dashboard

      if (!postsData) return

      const resultsPromises = postsData.map(async (post: any) => {
        const { data: votes } = await supabase.from("votes").select("candidate_id").eq("post_id", post.id)

        const voteCounts =
          votes?.reduce(
            (acc, vote) => {
              acc[vote.candidate_id] = (acc[vote.candidate_id] || 0) + 1
              return acc
            },
            {} as Record<string, number>,
          ) || {}

        const totalVotes = Object.values(voteCounts).reduce((sum, count) => sum + count, 0)
        const maxVotes = Math.max(...Object.values(voteCounts), 0)

        const candidates = post.candidates
          .map((candidate: any) => ({
            id: candidate.id,
            name: candidate.name,
            votes: voteCounts[candidate.id] || 0,
            percentage: totalVotes > 0 ? Math.round(((voteCounts[candidate.id] || 0) / totalVotes) * 100) : 0,
            isLeading: (voteCounts[candidate.id] || 0) === maxVotes && maxVotes > 0,
          }))
          .sort((a, b) => b.votes - a.votes)
          .slice(0, 3) // Show top 3 candidates

        return {
          postId: post.id,
          postTitle: post.title,
          category: post.category || "General",
          candidates,
          totalVotes,
        }
      })

      const results = await Promise.all(resultsPromises)
      setPostResults(results)
    } catch (error) {
      console.error("Error loading post results:", error)
    }
  }

  const loadAnimatedResults = async () => {
    try {
      const { data: election } = await supabase.from("elections").select("id").eq("is_active", true).single()
      if (!election) return

      const { data: postsData } = await supabase
        .from("posts")
        .select(`
          id,
          title,
          category,
          candidates (
            id,
            name
          )
        `)
        .eq("election_id", election.id)
        .order("order_index")

      if (!postsData) return

      const resultsPromises = postsData.map(async (post: any) => {
        const { data: votes } = await supabase.from("votes").select("candidate_id").eq("post_id", post.id)

        const voteCounts =
          votes?.reduce(
            (acc, vote) => {
              acc[vote.candidate_id] = (acc[vote.candidate_id] || 0) + 1
              return acc
            },
            {} as Record<string, number>,
          ) || {}

        const totalVotes = Object.values(voteCounts).reduce((sum, count) => sum + count, 0)
        const maxVotes = Math.max(...Object.values(voteCounts), 0)

        const candidates = post.candidates
          .map((candidate: any) => ({
            id: candidate.id,
            name: candidate.name,
            votes: voteCounts[candidate.id] || 0,
            percentage: totalVotes > 0 ? Math.round(((voteCounts[candidate.id] || 0) / totalVotes) * 100) : 0,
            isWinner: (voteCounts[candidate.id] || 0) === maxVotes && maxVotes > 0,
          }))
          .sort((a, b) => b.votes - a.votes)

        return {
          postId: post.id,
          postTitle: post.title,
          category: post.category || "General",
          candidates,
          totalVotes,
        }
      })

      const results = await Promise.all(resultsPromises)
      setAnimatedResults(results)
    } catch (error) {
      console.error("Error loading animated results:", error)
    }
  }

  const startAnimatedView = async () => {
    await loadAnimatedResults()
    setShowAnimatedView(true)
    setCurrentAnimationStep(0)
    setAnimationPhase("overview")

    // Start the animation sequence
    setTimeout(() => {
      setAnimationPhase("individual")
      startIndividualAnimations()
    }, 5000) // Show overview for 5 seconds
  }

  const startIndividualAnimations = () => {
    if (animatedResults.length === 0) return

    const animateNextPost = (index: number) => {
      if (index >= animatedResults.length) {
        setAnimationPhase("complete")
        return
      }

      setCurrentAnimationStep(index)

      // Move to next post after 8 seconds
      setTimeout(() => {
        animateNextPost(index + 1)
      }, 8000)
    }

    animateNextPost(0)
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

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "Senior Leadership":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Entertainment":
        return "bg-pink-100 text-pink-800 border-pink-200"
      case "Games and Sports":
        return "bg-green-100 text-green-800 border-green-200"
      case "Information":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Uniform":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "Mess":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const turnoutPercentage = stats.totalVoters > 0 ? Math.round((stats.votedCount / stats.totalVoters) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Election management overview and quick actions</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={startAnimatedView}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Play className="w-4 h-4 mr-2" />
            Show Animated View
          </Button>
          <Button asChild>
            <a href="/admin/live">
              <Zap className="w-4 h-4 mr-2" />
              Live Results
            </a>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Voters</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVoters}</div>
            <p className="text-xs text-muted-foreground">Registered voters</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Votes Cast</CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.votedCount}</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant={turnoutPercentage > 50 ? "default" : "secondary"}>{turnoutPercentage}% turnout</Badge>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Candidates</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCandidates}</div>
            <p className="text-xs text-muted-foreground">Running for office</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVotes}</div>
            <p className="text-xs text-muted-foreground">Individual votes cast</p>
          </CardContent>
        </Card>
      </div>

      {/* Election Results Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold tracking-tight">Current Election Results</h3>
          <Button asChild variant="outline">
            <a href="/admin/live">
              <TrendingUp className="w-4 h-4 mr-2" />
              View All Results
            </a>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {postResults.map((post) => (
            <Card key={post.postId} className="overflow-hidden border-2 hover:shadow-lg transition-all duration-300">
              <CardHeader className={`bg-gradient-to-r ${getCategoryColor(post.category)} text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(post.category)}
                    <div>
                      <CardTitle className="text-lg">{post.postTitle}</CardTitle>
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30 mt-1">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{post.totalVotes}</div>
                    <div className="text-sm opacity-90">votes</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {post.candidates.length > 0 ? (
                  <div className="space-y-3">
                    {post.candidates.map((candidate, index) => (
                      <div
                        key={candidate.id}
                        className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                          candidate.isLeading
                            ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300"
                            : "bg-gray-50 border border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              candidate.isLeading
                                ? "bg-yellow-500 text-white"
                                : index === 0
                                  ? "bg-blue-500 text-white"
                                  : index === 1
                                    ? "bg-gray-400 text-white"
                                    : "bg-gray-300 text-gray-700"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{candidate.name}</div>
                            <div className="text-sm text-gray-600">{candidate.votes} votes</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">{candidate.percentage}%</div>
                          {candidate.isLeading && (
                            <div className="text-xs text-yellow-600 font-medium flex items-center gap-1">
                              <Trophy className="w-3 h-3" />
                              Leading
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Vote Distribution Bar */}
                    <div className="mt-4">
                      <div className="text-sm text-gray-600 mb-2">Vote Distribution</div>
                      <div className="flex h-3 bg-gray-200 rounded-full overflow-hidden">
                        {post.candidates.map((candidate, index) => (
                          <div
                            key={candidate.id}
                            className={`h-full transition-all duration-1000 ${
                              index === 0
                                ? "bg-blue-500"
                                : index === 1
                                  ? "bg-green-500"
                                  : index === 2
                                    ? "bg-orange-500"
                                    : "bg-gray-400"
                            }`}
                            style={{ width: `${candidate.percentage}%` }}
                            title={`${candidate.name}: ${candidate.percentage}%`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Vote className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No votes cast yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {postResults.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Election Results</h3>
              <p className="text-gray-500">Results will appear here once voting begins.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full justify-start">
              <a href="/admin/votes">
                <Vote className="w-4 h-4 mr-2" />
                Manage Votes
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <a href="/admin/candidates">
                <Users className="w-4 h-4 mr-2" />
                View Candidates
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <a href="/admin/report">
                <BarChart3 className="w-4 h-4 mr-2" />
                Generate Report
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Election Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Voter Turnout</span>
                <Badge variant={turnoutPercentage > 50 ? "default" : "secondary"}>{turnoutPercentage}%</Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${turnoutPercentage}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.votedCount} of {stats.totalVoters} voters have participated
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Animated Results Fullscreen Modal */}
      {showAnimatedView && (
        <div className="fixed inset-0 z-50 bg-black overflow-hidden">
          {/* Close Button */}
          <button
            onClick={() => setShowAnimatedView(false)}
            className="absolute top-4 right-4 z-50 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            {/* Floating Particles */}
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/10 animate-pulse"
                style={{
                  width: Math.random() * 6 + 2 + "px",
                  height: Math.random() * 6 + 2 + "px",
                  top: Math.random() * 100 + "%",
                  left: Math.random() * 100 + "%",
                  animationDelay: Math.random() * 3 + "s",
                  animationDuration: Math.random() * 4 + 2 + "s",
                }}
              />
            ))}
          </div>

          {/* Overview Phase */}
          {animationPhase === "overview" && (
            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="text-center text-white animate-fade-in">
                <h1 className="text-8xl font-bold mb-8 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
                  🏆 ELECTION RESULTS 🏆
                </h1>
                <div className="text-4xl mb-12 animate-slide-up" style={{ animationDelay: "1s" }}>
                  2024 Prefectorial Elections
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                  {animatedResults.map((result, index) => (
                    <div
                      key={result.postId}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 animate-scale-in"
                      style={{ animationDelay: `${2 + index * 0.2}s` }}
                    >
                      <div className="flex justify-center mb-4">{getCategoryIcon(result.category)}</div>
                      <h3 className="text-xl font-bold mb-2">{result.postTitle}</h3>
                      <div className="text-sm opacity-80">{result.totalVotes} votes</div>
                      <div className="text-lg font-bold text-yellow-400 mt-2">
                        {result.candidates[0]?.name || "No votes"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Individual Post Phase */}
          {animationPhase === "individual" && animatedResults[currentAnimationStep] && (
            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="w-full max-w-6xl mx-auto px-8">
                {/* Post Title Animation */}
                <div className="text-center mb-12">
                  <div className="relative">
                    <h2
                      className={`text-9xl font-black bg-gradient-to-r ${getCategoryColor(animatedResults[currentAnimationStep].category)} bg-clip-text text-transparent animate-zoom-text`}
                      id="animated-title"
                    >
                      {animatedResults[currentAnimationStep].postTitle}
                    </h2>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine"></div>
                  </div>
                  <div className="text-3xl text-white/80 mt-4 animate-fade-in" style={{ animationDelay: "2s" }}>
                    {animatedResults[currentAnimationStep].category}
                  </div>
                </div>

                {/* Results */}
                <div className="space-y-6 animate-slide-up" style={{ animationDelay: "3s" }}>
                  {animatedResults[currentAnimationStep].candidates.map((candidate, index) => (
                    <div
                      key={candidate.id}
                      className={`relative p-8 rounded-2xl backdrop-blur-sm border-2 transition-all duration-1000 ${
                        candidate.isWinner
                          ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400 shadow-2xl scale-105"
                          : "bg-white/10 border-white/20"
                      }`}
                      style={{ animationDelay: `${3.5 + index * 0.5}s` }}
                    >
                      {candidate.isWinner && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <div className="bg-yellow-500 text-black px-6 py-2 rounded-full font-bold text-lg animate-bounce">
                            🏆 WINNER 🏆
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="text-6xl font-bold text-white">#{index + 1}</div>
                          <div>
                            <h3 className="text-4xl font-bold text-white mb-2">{candidate.name}</h3>
                            <div className="text-xl text-white/80">{candidate.votes} votes</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-6xl font-bold text-yellow-400">{candidate.percentage}%</div>
                          <div className="w-32 h-4 bg-white/20 rounded-full mt-2">
                            <div
                              className="h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-2000"
                              style={{
                                width: `${candidate.percentage}%`,
                                animationDelay: `${4 + index * 0.5}s`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Complete Phase */}
          {animationPhase === "complete" && (
            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-8xl font-bold mb-8 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent animate-pulse">
                  🎉 RESULTS COMPLETE! 🎉
                </h1>
                <div className="text-4xl mb-8 animate-fade-in">
                  Thank you for participating in the 2024 Prefectorial Elections
                </div>
                <Button
                  onClick={() => setShowAnimatedView(false)}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 text-xl"
                >
                  Return to Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0; 
            transform: translateY(50px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes scale-in {
          from { 
            opacity: 0; 
            transform: scale(0.8); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }

        @keyframes zoom-text {
          0% {
            opacity: 0;
            transform: scale(0.5) rotateY(-90deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.1) rotateY(0deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotateY(0deg);
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 1s ease-out forwards;
          opacity: 0;
        }
        
        .animate-scale-in {
          animation: scale-in 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-zoom-text {
          animation: zoom-text 2s ease-out forwards;
        }

        .animate-shine {
          animation: shine 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
