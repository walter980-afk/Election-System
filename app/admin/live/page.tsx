"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/lib/supabase"
import { Trophy, Users, TrendingUp } from "lucide-react"

interface LiveResult {
  postId: string
  postTitle: string
  candidates: {
    id: string
    name: string
    party: string
    votes: number
    percentage: number
  }[]
  totalVotes: number
}

export default function LiveResultsPage() {
  const [results, setResults] = useState<LiveResult[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPostIndex, setCurrentPostIndex] = useState(0)

  useEffect(() => {
    loadResults()
    const interval = setInterval(loadResults, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (results.length > 0) {
      const interval = setInterval(() => {
        setCurrentPostIndex((prev) => (prev + 1) % results.length)
      }, 8000) // Change post every 8 seconds
      return () => clearInterval(interval)
    }
  }, [results.length])

  const loadResults = async () => {
    try {
      const { data: election } = await supabase.from("elections").select("id").eq("is_active", true).single()

      if (!election) return

      const { data: postsData } = await supabase
        .from("posts")
        .select(`
          id,
          title,
          candidates (
            id,
            name,
            party
          )
        `)
        .eq("election_id", election.id)
        .order("order_index")

      if (!postsData) return

      const resultsPromises = postsData.map(async (post) => {
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

        const candidates = post.candidates
          .map((candidate) => ({
            id: candidate.id,
            name: candidate.name,
            party: candidate.party || "Independent",
            votes: voteCounts[candidate.id] || 0,
            percentage: totalVotes > 0 ? Math.round(((voteCounts[candidate.id] || 0) / totalVotes) * 100) : 0,
          }))
          .sort((a, b) => b.votes - a.votes)

        return {
          postId: post.id,
          postTitle: post.title,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading Live Results...</p>
        </div>
      </div>
    )
  }

  const currentPost = results[currentPostIndex]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-4xl font-bold tracking-tight mb-2">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            LIVE ELECTION RESULTS
          </span>
        </h2>
        <p className="text-muted-foreground text-lg">Real-time election coverage</p>
      </div>

      {/* Featured Post Display */}
      {currentPost && (
        <div className="relative overflow-hidden">
          <Card className="border-2 border-blue-500 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="text-center">
                <div className="text-6xl font-bold mb-4 tracking-wider">
                  <span className="inline-block animate-pulse">
                    {currentPost.postTitle.split("").map((letter, index) => (
                      <span
                        key={index}
                        className="inline-block"
                        style={{
                          animationDelay: `${index * 0.1}s`,
                          textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                        }}
                      >
                        {letter === " " ? "\u00A0" : letter}
                      </span>
                    ))}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-4 text-lg">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>{currentPost.totalVotes} votes cast</span>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    LIVE
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                {currentPost.candidates.map((candidate, index) => (
                  <div
                    key={candidate.id}
                    className={`p-6 rounded-lg border-2 transition-all duration-1000 ${
                      index === 0
                        ? "border-gold bg-yellow-50 shadow-lg transform scale-105"
                        : "border-gray-200 bg-white"
                    }`}
                    style={{
                      animationDelay: `${index * 0.3}s`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {index === 0 && <Trophy className="w-6 h-6 text-yellow-600" />}
                        <div>
                          <h3 className="text-2xl font-bold">{candidate.name}</h3>
                          <Badge variant="outline">{candidate.party}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">{candidate.percentage}%</div>
                        <div className="text-sm text-muted-foreground">{candidate.votes} votes</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Progress value={candidate.percentage} className="h-3" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Vote Share</span>
                        <span>
                          {candidate.votes} / {currentPost.totalVotes}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* All Results Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {results.map((post, postIndex) => (
          <Card
            key={post.postId}
            className={`transition-all duration-500 ${
              postIndex === currentPostIndex ? "ring-2 ring-blue-500 shadow-lg" : "hover:shadow-md"
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                {post.postTitle}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{post.totalVotes} total votes</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {post.candidates.slice(0, 3).map((candidate, index) => (
                  <div key={candidate.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {index === 0 && <Trophy className="w-4 h-4 text-yellow-500" />}
                      <span className="font-medium">{candidate.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{candidate.percentage}%</span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-blue-500 rounded-full transition-all duration-1000"
                          style={{ width: `${candidate.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
