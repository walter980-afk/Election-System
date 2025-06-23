"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, Users, Vote, Trophy, Clock } from "lucide-react"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

interface AnalyticsData {
  totalVotes: number
  totalVoters: number
  turnoutRate: number
  positionData: any[]
  partyData: any[]
  timeData: any[]
  demographicData: any[]
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      // Get total voters and votes
      const [votersResult, votesResult] = await Promise.all([
        supabase.from("voters").select("has_voted, created_at"),
        supabase.from("votes").select("created_at, candidate_id, post_id"),
      ])

      const voters = votersResult.data || []
      const votes = votesResult.data || []
      const votedCount = voters.filter((v) => v.has_voted).length
      const turnoutRate = voters.length > 0 ? (votedCount / voters.length) * 100 : 0

      // Get position data
      const { data: postsData } = await supabase.from("posts").select(`
          id,
          title,
          candidates (
            id,
            name,
            party
          )
        `)

      const positionData = await Promise.all(
        (postsData || []).map(async (post: any) => {
          const { data: postVotes } = await supabase.from("votes").select("candidate_id").eq("post_id", post.id)

          return {
            position: post.title,
            votes: postVotes?.length || 0,
            candidates: post.candidates.length,
          }
        }),
      )

      // Get party data
      const { data: candidatesData } = await supabase.from("candidates").select("id, party")

      const partyVotes: Record<string, number> = {}

      for (const candidate of candidatesData || []) {
        const { data: candidateVotes } = await supabase.from("votes").select("id").eq("candidate_id", candidate.id)

        const party = candidate.party || "Independent"
        partyVotes[party] = (partyVotes[party] || 0) + (candidateVotes?.length || 0)
      }

      const partyData = Object.entries(partyVotes).map(([party, votes]) => ({
        party,
        votes,
      }))

      // Get time-based data (votes over time)
      const timeData = votes.reduce((acc: Record<string, number>, vote) => {
        const hour = new Date(vote.created_at).getHours()
        const timeSlot = `${hour}:00`
        acc[timeSlot] = (acc[timeSlot] || 0) + 1
        return acc
      }, {})

      const timeChartData = Object.entries(timeData)
        .map(([time, count]) => ({
          time,
          votes: count,
        }))
        .sort((a, b) => Number.parseInt(a.time) - Number.parseInt(b.time))

      // Mock demographic data (in real app, this would come from voter registration)
      const demographicData = [
        { grade: "Grade 9", votes: Math.floor(votes.length * 0.25) },
        { grade: "Grade 10", votes: Math.floor(votes.length * 0.28) },
        { grade: "Grade 11", votes: Math.floor(votes.length * 0.24) },
        { grade: "Grade 12", votes: Math.floor(votes.length * 0.23) },
      ]

      setData({
        totalVotes: votes.length,
        totalVoters: voters.length,
        turnoutRate,
        positionData,
        partyData,
        timeData: timeChartData,
        demographicData,
      })
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
        <p className="text-gray-500">Analytics data could not be loaded.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Comprehensive election data analysis and insights</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          <TrendingUp className="w-4 h-4 mr-1" />
          Live Data
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Total Votes</CardTitle>
            <Vote className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{data.totalVotes}</div>
            <p className="text-xs text-blue-600">Across all positions</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Voter Turnout</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{data.turnoutRate.toFixed(1)}%</div>
            <p className="text-xs text-green-600">{data.totalVoters} registered voters</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Avg Votes/Position</CardTitle>
            <Trophy className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {data.positionData.length > 0 ? Math.round(data.totalVotes / data.positionData.length) : 0}
            </div>
            <p className="text-xs text-purple-600">Per contested position</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Peak Hour</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              {data.timeData.length > 0
                ? data.timeData.reduce((max, curr) => (curr.votes > max.votes ? curr : max)).time
                : "N/A"}
            </div>
            <p className="text-xs text-orange-600">Highest voting activity</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="positions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="positions">By Position</TabsTrigger>
          <TabsTrigger value="parties">By Party</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>

        <TabsContent value="positions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Votes by Position</CardTitle>
                <CardDescription>Vote distribution across all contested positions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.positionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="position" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="votes" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Position Engagement</CardTitle>
                <CardDescription>Candidates vs votes per position</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.positionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="position" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="candidates" fill="#82ca9d" name="Candidates" />
                    <Bar dataKey="votes" fill="#8884d8" name="Votes" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="parties" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Party Performance</CardTitle>
                <CardDescription>Total votes received by each party</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.partyData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ party, percent }) => `${party}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="votes"
                    >
                      {data.partyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Party Vote Share</CardTitle>
                <CardDescription>Detailed breakdown of party performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.partyData.map((party, index) => {
                    const percentage = data.totalVotes > 0 ? (party.votes / data.totalVotes) * 100 : 0
                    return (
                      <div key={party.party} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{party.party}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{party.votes} votes</span>
                            <Badge variant="outline">{percentage.toFixed(1)}%</Badge>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Voting Timeline</CardTitle>
              <CardDescription>Vote activity throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data.timeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="votes" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Votes by Grade Level</CardTitle>
                <CardDescription>Student participation by grade</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.demographicData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="grade" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="votes" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>Percentage breakdown by grade level</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.demographicData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ grade, percent }) => `${grade}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="votes"
                    >
                      {data.demographicData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
