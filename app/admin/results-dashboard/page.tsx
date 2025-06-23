"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/lib/supabase"
import { BarChart3, Users, Vote, Trophy, TrendingUp, RefreshCw, LogOut, Crown, Star, Eye, FileText } from "lucide-react"
import Image from "next/image"

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

interface AdminUser {
  username: string
  role: string
  full_name: string
  permissions: string[]
}

export default function ResultsDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalVoters: 0,
    votedCount: 0,
    totalCandidates: 0,
    totalVotes: 0,
  })
  const [postResults, setPostResults] = useState<PostResult[]>([])
  const [loading, setLoading] = useState(true)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("adminUser")
    if (!storedUser) {
      window.location.href = "/admin/login"
      return
    }

    const user = JSON.parse(storedUser)
    setAdminUser(user)

    loadData()

    // Auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadData = async () => {
    try {
      await Promise.all([loadStats(), loadPostResults()])
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

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
          .slice(0, 3)

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

  const handleLogout = () => {
    localStorage.removeItem("adminUser")
    window.location.href = "/admin/login"
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

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "super_admin":
        return "Super Administrator"
      case "chairperson":
        return "Chairperson Electoral Commission"
      case "headteacher":
        return "Head Teacher"
      default:
        return "Administrator"
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-red-100 text-red-800 border-red-200"
      case "chairperson":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "headteacher":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const turnoutPercentage = stats.totalVoters > 0 ? Math.round((stats.votedCount / stats.totalVoters) * 100) : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Image src="/images/logo.png" alt="Logo" width={32} height={32} className="object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Election Results Dashboard</h1>
                <p className="text-sm text-gray-600">2024 Prefectorial Elections</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium text-gray-900">{adminUser?.full_name}</p>
              <Badge variant="outline" className={getRoleBadgeColor(adminUser?.role || "")}>
                {getRoleDisplayName(adminUser?.role || "")}
              </Badge>
            </div>
            <Button onClick={loadData} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Total Voters</CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{stats.totalVoters}</div>
              <p className="text-xs text-blue-600">Registered students</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Voter Turnout</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">{turnoutPercentage}%</div>
              <p className="text-xs text-green-600">{stats.votedCount} students voted</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">Candidates</CardTitle>
              <Trophy className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">{stats.totalCandidates}</div>
              <p className="text-xs text-purple-600">Running for office</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-800">Total Votes</CardTitle>
              <Vote className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900">{stats.totalVotes}</div>
              <p className="text-xs text-orange-600">Individual votes cast</p>
            </CardContent>
          </Card>
        </div>

        {/* Turnout Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Election Participation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Voter Turnout Progress</span>
                <Badge variant={turnoutPercentage > 50 ? "default" : "secondary"}>
                  {stats.votedCount} / {stats.totalVoters} voters
                </Badge>
              </div>
              <Progress value={turnoutPercentage} className="h-3" />
              <p className="text-sm text-muted-foreground">
                {turnoutPercentage}% of registered students have participated in the election
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Election Results */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Live Election Results</h2>
            <Badge variant="outline" className="px-3 py-1">
              <Eye className="w-4 h-4 mr-1" />
              Live Updates
            </Badge>
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
                <CardContent className="p-6">
                  {post.candidates.length > 0 ? (
                    <div className="space-y-4">
                      {post.candidates.map((candidate, index) => (
                        <div
                          key={candidate.id}
                          className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                            candidate.isLeading
                              ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300"
                              : "bg-gray-50 border border-gray-200"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
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
                            <div className="text-xl font-bold text-gray-900">{candidate.percentage}%</div>
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

        {/* Additional Actions for Chairperson */}
        {adminUser?.role === "chairperson" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Additional Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button asChild variant="outline">
                  <a href="/admin/analytics">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/admin/report">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
