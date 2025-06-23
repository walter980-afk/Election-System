"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { supabase } from "@/lib/supabase"
import { FileText, Download, BarChart3, Users, Trophy } from "lucide-react"

interface ReportData {
  election: {
    title: string
    description: string
    startDate: string
    endDate: string
  }
  summary: {
    totalVoters: number
    votedCount: number
    turnoutPercentage: number
    totalVotes: number
  }
  results: {
    postTitle: string
    candidates: {
      name: string
      party: string
      votes: number
      percentage: number
      isWinner: boolean
    }[]
    totalVotes: number
  }[]
}

export default function ReportPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReportData()
  }, [])

  const loadReportData = async () => {
    try {
      // Get active election
      const { data: election } = await supabase.from("elections").select("*").eq("is_active", true).single()

      if (!election) return

      // Get voter statistics
      const { data: voters } = await supabase.from("voters").select("has_voted")

      const totalVoters = voters?.length || 0
      const votedCount = voters?.filter((v) => v.has_voted).length || 0
      const turnoutPercentage = totalVoters > 0 ? Math.round((votedCount / totalVoters) * 100) : 0

      // Get total votes
      const { data: allVotes } = await supabase.from("votes").select("id").eq("election_id", election.id)

      // Get posts and results
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
        const maxVotes = Math.max(...Object.values(voteCounts), 0)

        const candidates = post.candidates
          .map((candidate) => ({
            name: candidate.name,
            party: candidate.party || "Independent",
            votes: voteCounts[candidate.id] || 0,
            percentage: totalVotes > 0 ? Math.round(((voteCounts[candidate.id] || 0) / totalVotes) * 100) : 0,
            isWinner: (voteCounts[candidate.id] || 0) === maxVotes && maxVotes > 0,
          }))
          .sort((a, b) => b.votes - a.votes)

        return {
          postTitle: post.title,
          candidates,
          totalVotes,
        }
      })

      const results = await Promise.all(resultsPromises)

      setReportData({
        election: {
          title: election.title,
          description: election.description || "",
          startDate: election.start_date,
          endDate: election.end_date,
        },
        summary: {
          totalVoters,
          votedCount,
          turnoutPercentage,
          totalVotes: allVotes?.length || 0,
        },
        results,
      })
    } catch (error) {
      console.error("Error loading report data:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateReport = () => {
    if (!reportData) return

    const reportContent = `
ELECTION REPORT
===============

Election: ${reportData.election.title}
Description: ${reportData.election.description}
Period: ${new Date(reportData.election.startDate).toLocaleDateString()} - ${new Date(reportData.election.endDate).toLocaleDateString()}

SUMMARY
-------
Total Registered Voters: ${reportData.summary.totalVoters}
Votes Cast: ${reportData.summary.votedCount}
Voter Turnout: ${reportData.summary.turnoutPercentage}%
Total Individual Votes: ${reportData.summary.totalVotes}

RESULTS BY POSITION
-------------------
${reportData.results
  .map(
    (post) => `
${post.postTitle.toUpperCase()}
Total Votes: ${post.totalVotes}

${post.candidates
  .map(
    (candidate, index) =>
      `${index + 1}. ${candidate.name} (${candidate.party})
     Votes: ${candidate.votes} (${candidate.percentage}%) ${candidate.isWinner ? "*** WINNER ***" : ""}`,
  )
  .join("\n")}
`,
  )
  .join("\n")}

Generated on: ${new Date().toLocaleString()}
    `.trim()

    const blob = new Blob([reportContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `election-report-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Generating Report...</p>
        </div>
      </div>
    )
  }

  if (!reportData) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Election Data</h3>
        <p className="text-gray-500">No active election found to generate report.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Election Report</h2>
          <p className="text-muted-foreground">Comprehensive election results and analysis</p>
        </div>
        <Button onClick={generateReport} className="bg-gradient-to-r from-blue-600 to-purple-600">
          <Download className="w-4 h-4 mr-2" />
          Generate Full Report
        </Button>
      </div>

      {/* Election Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Election Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold text-lg mb-2">{reportData.election.title}</h3>
              <p className="text-muted-foreground mb-4">{reportData.election.description}</p>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Start Date:</strong> {new Date(reportData.election.startDate).toLocaleDateString()}
                </div>
                <div>
                  <strong>End Date:</strong> {new Date(reportData.election.endDate).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="grid gap-4 grid-cols-2">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{reportData.summary.totalVoters}</div>
                <div className="text-sm text-muted-foreground">Registered Voters</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{reportData.summary.turnoutPercentage}%</div>
                <div className="text-sm text-muted-foreground">Voter Turnout</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results by Position */}
      <div className="space-y-6">
        {reportData.results.map((post, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                {post.postTitle}
              </CardTitle>
              <p className="text-muted-foreground">{post.totalVotes} total votes cast</p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Party</TableHead>
                    <TableHead>Votes</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {post.candidates.map((candidate, candidateIndex) => (
                    <TableRow key={candidateIndex} className={candidate.isWinner ? "bg-yellow-50" : ""}>
                      <TableCell className="font-medium">
                        {candidateIndex + 1}
                        {candidateIndex === 0 && <Trophy className="w-4 h-4 text-yellow-500 inline ml-1" />}
                      </TableCell>
                      <TableCell className="font-medium">{candidate.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{candidate.party}</Badge>
                      </TableCell>
                      <TableCell>{candidate.votes}</TableCell>
                      <TableCell>{candidate.percentage}%</TableCell>
                      <TableCell>
                        {candidate.isWinner && <Badge className="bg-yellow-500 hover:bg-yellow-600">WINNER</Badge>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
