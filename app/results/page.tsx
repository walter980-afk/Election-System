"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { Trophy, Users, TrendingUp, RefreshCw, Crown, Star, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PublicResult {
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

export default function PublicResultsPage() {
  const [results, setResults] = useState<PublicResult[]>([])
  const [loading, setLoading] = useState(true)
  const [totalVoters, setTotalVoters] = useState(0)
  const [votedCount, setVotedCount] = useState(0)

  useEffect(() => {
    loadResults()
    const interval = setInterval(loadResults, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const loadResults = async () => {
    try {
      // Get voter statistics
      const { data: voters } = await supabase.from("voters").select("has_voted")
      const voterData = voters || []
      setTotalVoters(voterData.length)
      setVotedCount(voterData.filter(v => v.has_voted).length)

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

        const voteCounts = votes?.reduce((acc, vote) => {
          acc[vote.candidate_id] = (acc[vote.candidate_id] || 0) + 1
          return acc
        }, {} as Record<string, number>) || {}

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

      const resultsData = await Promise.all(resultsPromises)
      setResults(resultsData)
    } catch (error) {
      console.error("Error loading results:", error)
    } finally {
      setLoading(false)
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
        return <Users className="w-6 h-6" />
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

  const turnoutPercentage = totalVoters > 0 ? Math.round((votedCount / totalVoters) * 100) : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading election results...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">2024 Prefectorial Election Results</h1>
            <p className="text-sm text-gray-600">Live Results</p>
          </div>

          <Button onClick={loadResults} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Turnout Statistics */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="py-6">
            <div className="grid gap-4 md:grid-cols-3 text-center">
              <div>
                <div className="text-3xl font-bold">{totalVoters}</div>
                <div className="text-sm opacity-90">Registered Voters</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{votedCount}</div>
                <div className="text-sm opacity-90">Votes Cast</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{turnoutPercentage}%</div>
                <div className="text-sm opacity-90">Voter Turnout</div>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={turnoutPercentage} className="h-3 bg-white/20" />
            </div>
          </CardContent>
        </Card>

        {/* Results by Position */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((post) => (
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
              <CardContent className="p-6">
                {post.candidates.length > 0 ? (
                  <div className="space-y-4">
                    {post.candidates.map((candidate, index) => (
                      <div
                        key={candidate.id}
                        className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                          candidate.isWinner
                            ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300"
                            : "bg-gray-50 border border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                              candidate.isWinner
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
                          <div className="text-xl font-bold text-gray-900">{candidate.percentage}%</div>
                          {candidate.isWinner && (
                            <div className="text-xs text-yellow-600 font-medium flex items-center gap-1">
                              <Trophy className="w-3 h-3" />
                              Winner
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Vote Distribution Bar */}
                    <div className="mt-6">
                      <div className="text-sm text-gray-600 mb-2 font-medium">Vote Distribution</div>
                      <div className="flex h-4 bg-gray-200 rounded-full overflow-hidden">
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
                    <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No votes cast yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {results.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Election Results</h3>
              <p className="text-gray-500">Results will appear here once voting begins.</p>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center py-4 border-t">
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleString()} | 
            <span className="font-semibold text-blue-600 ml-1">Lubiri Secondary School</span>
          </p>
        </div>
      </div>
    </div>
  )
}