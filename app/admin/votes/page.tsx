"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"
import {
  Vote,
  Search,
  Filter,
  RefreshCw,
  Trash2,
  Eye,
  AlertTriangle,
  Download,
  UserPlus,
  Printer,
  CreditCard,
  Upload,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface VoteRecord {
  id: string
  voter_name: string
  voter_id: string
  candidate_name: string
  post_title: string
  party: string
  created_at: string
}

export default function ManageVotesPage() {
  const [votes, setVotes] = useState<VoteRecord[]>([])
  const [filteredVotes, setFilteredVotes] = useState<VoteRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPost, setFilterPost] = useState("all")
  const [filterParty, setFilterParty] = useState("all")
  const [posts, setPosts] = useState<string[]>([])
  const [parties, setParties] = useState<string[]>([])
  const [showVoterIdDialog, setShowVoterIdDialog] = useState(false)
  const [newVoter, setNewVoter] = useState({
    voter_id: "",
    name: "",
    email: "",
  })
  const [voters, setVoters] = useState<any[]>([])
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [importData, setImportData] = useState<any[]>([])
  const [importPreview, setImportPreview] = useState<any[]>([])
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importErrors, setImportErrors] = useState<string[]>([])

  useEffect(() => {
    loadVotes()
  }, [])

  useEffect(() => {
    filterVotes()
  }, [votes, searchTerm, filterPost, filterParty])

  const loadVotes = async () => {
    try {
      // Load voters
      const { data: votersData } = await supabase.from("voters").select("*").order("voter_id")

      setVoters(votersData || [])

      const { data: votesData } = await supabase
        .from("votes")
        .select(`
          id,
          created_at,
          voters (
            name,
            voter_id
          ),
          candidates (
            name,
            party
          ),
          posts (
            title
          )
        `)
        .order("created_at", { ascending: false })

      if (votesData) {
        const formattedVotes: VoteRecord[] = votesData.map((vote: any) => ({
          id: vote.id,
          voter_name: vote.voters?.name || "Unknown",
          voter_id: vote.voters?.voter_id || "Unknown",
          candidate_name: vote.candidates?.name || "Unknown",
          post_title: vote.posts?.title || "Unknown",
          party: vote.candidates?.party || "Independent",
          created_at: vote.created_at,
        }))

        setVotes(formattedVotes)

        // Extract unique posts and parties for filters
        const uniquePosts = [...new Set(formattedVotes.map((v) => v.post_title))]
        const uniqueParties = [...new Set(formattedVotes.map((v) => v.party))]
        setPosts(uniquePosts)
        setParties(uniqueParties)
      }
    } catch (error) {
      console.error("Error loading votes:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterVotes = () => {
    let filtered = votes

    if (searchTerm) {
      filtered = filtered.filter(
        (vote) =>
          vote.voter_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vote.voter_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vote.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterPost !== "all") {
      filtered = filtered.filter((vote) => vote.post_title === filterPost)
    }

    if (filterParty !== "all") {
      filtered = filtered.filter((vote) => vote.party === filterParty)
    }

    setFilteredVotes(filtered)
  }

  const handleDeleteVote = async (voteId: string) => {
    if (!confirm("Are you sure you want to delete this vote? This action cannot be undone.")) {
      return
    }

    try {
      await supabase.from("votes").delete().eq("id", voteId)
      await loadVotes()
    } catch (error) {
      alert("Failed to delete vote")
    }
  }

  const handleCreateVoter = async () => {
    if (!newVoter.voter_id || !newVoter.name) {
      alert("Please fill in required fields")
      return
    }

    try {
      await supabase.from("voters").insert([newVoter])
      setNewVoter({ voter_id: "", name: "", email: "" })
      setShowVoterIdDialog(false)
      await loadVotes()
      alert("Voter created successfully!")
    } catch (error) {
      alert("Failed to create voter")
    }
  }

  const generateRandomVoterId = () => {
    const prefix = "V"
    const randomNum = Math.floor(Math.random() * 9000) + 1000 // 4-digit number
    return `${prefix}${randomNum}`
  }

  const parseCSVFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string
          const lines = text.split("\n").filter((line) => line.trim())
          const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())

          const data = lines.slice(1).map((line, index) => {
            const values = line.split(",").map((v) => v.trim())
            const row: any = { rowNumber: index + 2 }

            headers.forEach((header, i) => {
              row[header] = values[i] || ""
            })

            return row
          })

          resolve(data)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsText(file)
    })
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".csv")) {
      alert("Please upload a CSV file")
      return
    }

    setImportFile(file)

    try {
      const data = await parseCSVFile(file)
      setImportData(data)

      // Process and validate data
      const processedData = data.map((row) => {
        const name = row.name || row["full name"] || row["student name"] || ""
        const email = row.email || row["email address"] || ""
        let voterId = row["voter id"] || row["voter_id"] || row.id || ""

        // Generate random voter ID if not provided
        if (!voterId) {
          voterId = generateRandomVoterId()
        }

        return {
          name: name.trim(),
          email: email.trim(),
          voter_id: voterId.trim(),
          original_row: row.rowNumber,
        }
      })

      // Validate data and check for errors
      const errors: string[] = []
      const existingVoterIds = new Set(voters.map((v) => v.voter_id))
      const newVoterIds = new Set()

      processedData.forEach((item, index) => {
        if (!item.name) {
          errors.push(`Row ${item.original_row}: Name is required`)
        }
        if (!item.voter_id) {
          errors.push(`Row ${item.original_row}: Voter ID is required`)
        }
        if (existingVoterIds.has(item.voter_id)) {
          errors.push(`Row ${item.original_row}: Voter ID "${item.voter_id}" already exists`)
        }
        if (newVoterIds.has(item.voter_id)) {
          errors.push(`Row ${item.original_row}: Duplicate Voter ID "${item.voter_id}" in import data`)
        }
        newVoterIds.add(item.voter_id)
      })

      setImportErrors(errors)
      setImportPreview(processedData)
      setShowImportDialog(true)
    } catch (error) {
      alert("Error parsing CSV file. Please check the format.")
      console.error("CSV parsing error:", error)
    }
  }

  const handleBulkImport = async () => {
    if (importErrors.length > 0) {
      alert("Please fix the errors before importing")
      return
    }

    try {
      const { error } = await supabase.from("voters").insert(
        importPreview.map((item) => ({
          voter_id: item.voter_id,
          name: item.name,
          email: item.email || null,
          has_voted: false,
        })),
      )

      if (error) throw error

      alert(`Successfully imported ${importPreview.length} voters!`)
      setShowImportDialog(false)
      setImportData([])
      setImportPreview([])
      setImportFile(null)
      setImportErrors([])
      await loadVotes()
    } catch (error) {
      alert("Failed to import voters. Please try again.")
      console.error("Import error:", error)
    }
  }

  const generateVoterIdPdf = (voter: any) => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Voter ID Card - ${voter.name}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f0f0f0;
          }
          .id-card {
            width: 350px;
            height: 220px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 15px;
            padding: 20px;
            color: white;
            position: relative;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            margin: 20px auto;
          }
          .header {
            text-align: center;
            margin-bottom: 15px;
          }
          .school-name {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .election-title {
            font-size: 12px;
            opacity: 0.9;
          }
          .voter-info {
            margin-top: 20px;
          }
          .voter-name {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 8px;
          }
          .voter-id {
            font-size: 16px;
            background: rgba(255,255,255,0.2);
            padding: 5px 10px;
            border-radius: 5px;
            display: inline-block;
            margin-bottom: 8px;
          }
          .voter-email {
            font-size: 12px;
            opacity: 0.8;
          }
          .footer {
            position: absolute;
            bottom: 15px;
            right: 20px;
            font-size: 10px;
            opacity: 0.7;
          }
          .logo {
            position: absolute;
            top: 15px;
            right: 20px;
            width: 40px;
            height: 40px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            background-image: url('/images/logo.png');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
          }
          @media print {
            body { background: white; }
            .id-card { 
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              page-break-after: always;
            }
          }
        </style>
      </head>
      <body>
        <div class="id-card">
          <div class="logo">🗳️</div>
          <div class="header">
            <div class="school-name">SCHOOL ELECTION</div>
            <div class="election-title">2024 Prefectorial Elections</div>
          </div>
          <div class="voter-info">
            <div class="voter-name">${voter.name}</div>
            <div class="voter-id">ID: ${voter.voter_id}</div>
            ${voter.email ? `<div class="voter-email">${voter.email}</div>` : ""}
          </div>
          <div class="footer">
            Valid for voting only
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            }
          }
        </script>
      </body>
      </html>
    `)

    printWindow.document.close()
  }

  const printAllVoterIds = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const voterCards = voters
      .map(
        (voter) => `
      <div class="id-card">
        <div class="logo">🗳️</div>
        <div class="header">
          <div class="school-name">SCHOOL ELECTION</div>
          <div class="election-title">2024 Prefectorial Elections</div>
        </div>
        <div class="voter-info">
          <div class="voter-name">${voter.name}</div>
          <div class="voter-id">ID: ${voter.voter_id}</div>
          ${voter.email ? `<div class="voter-email">${voter.email}</div>` : ""}
        </div>
        <div class="footer">
          Valid for voting only
        </div>
      </div>
    `,
      )
      .join("")

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>All Voter ID Cards</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f0f0f0;
          }
          .id-card {
            width: 350px;
            height: 220px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 15px;
            padding: 20px;
            color: white;
            position: relative;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            margin: 20px auto;
            page-break-after: always;
          }
          .header {
            text-align: center;
            margin-bottom: 15px;
          }
          .school-name {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .election-title {
            font-size: 12px;
            opacity: 0.9;
          }
          .voter-info {
            margin-top: 20px;
          }
          .voter-name {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 8px;
          }
          .voter-id {
            font-size: 16px;
            background: rgba(255,255,255,0.2);
            padding: 5px 10px;
            border-radius: 5px;
            display: inline-block;
            margin-bottom: 8px;
          }
          .voter-email {
            font-size: 12px;
            opacity: 0.8;
          }
          .footer {
            position: absolute;
            bottom: 15px;
            right: 20px;
            font-size: 10px;
            opacity: 0.7;
          }
          .logo {
            position: absolute;
            top: 15px;
            right: 20px;
            width: 40px;
            height: 40px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            background-image: url('/images/logo.png');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
          }
          @media print {
            body { background: white; }
            .id-card { 
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
          }
        </style>
      </head>
      <body>
        ${voterCards}
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            }
          }
        </script>
      </body>
      </html>
    `)

    printWindow.document.close()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading votes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Votes</h2>
          <p className="text-muted-foreground">Monitor and manage all cast votes</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadVotes} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Voter ID Management Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Voter ID Management
          </CardTitle>
          <CardDescription>Create new voters and print ID cards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Dialog open={showVoterIdDialog} onOpenChange={setShowVoterIdDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Create New Voter
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Voter</DialogTitle>
                  <DialogDescription>Add a new voter to the system</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="voter_id">Voter ID</Label>
                    <Input
                      id="voter_id"
                      value={newVoter.voter_id}
                      onChange={(e) => setNewVoter({ ...newVoter, voter_id: e.target.value })}
                      placeholder="e.g., V006"
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newVoter.name}
                      onChange={(e) => setNewVoter({ ...newVoter, name: e.target.value })}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newVoter.email}
                      onChange={(e) => setNewVoter({ ...newVoter, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                  <Button onClick={handleCreateVoter} className="w-full">
                    Create Voter
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <div className="flex items-center gap-2">
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="csv-upload" />
              <Button
                onClick={() => document.getElementById("csv-upload")?.click()}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Import Spreadsheet
              </Button>
            </div>

            <Button
              onClick={printAllVoterIds}
              variant="outline"
              className="flex items-center gap-2"
              disabled={voters.length === 0}
            >
              <Printer className="w-4 h-4" />
              Print All ID Cards ({voters.length})
            </Button>

            <Button
              onClick={() => {
                const csvContent =
                  "data:text/csv;charset=utf-8," +
                  "Voter ID,Name,Email,Has Voted\n" +
                  voters.map((v) => `${v.voter_id},${v.name},${v.email || ""},${v.has_voted ? "Yes" : "No"}`).join("\n")

                const link = document.createElement("a")
                link.setAttribute("href", encodeURI(csvContent))
                link.setAttribute("download", "voters_list.csv")
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              }}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Voters CSV
            </Button>
          </div>

          {/* Import Preview Dialog */}
          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5" />
                  Import Preview
                </DialogTitle>
                <DialogDescription>
                  Review the data before importing. Voter IDs will be generated automatically if not provided.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* File Info */}
                {importFile && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium">File: {importFile.name}</p>
                    <p className="text-sm text-gray-600">Found {importPreview.length} records</p>
                  </div>
                )}

                {/* Errors */}
                {importErrors.length > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      Errors Found ({importErrors.length})
                    </h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      {importErrors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Success Message */}
                {importErrors.length === 0 && importPreview.length > 0 && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-medium flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Ready to import {importPreview.length} voters
                    </p>
                  </div>
                )}

                {/* Preview Table */}
                {importPreview.length > 0 && (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Row</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Voter ID</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {importPreview.slice(0, 10).map((item, index) => {
                          const hasError = importErrors.some((error) => error.includes(`Row ${item.original_row}`))
                          return (
                            <TableRow key={index} className={hasError ? "bg-red-50" : ""}>
                              <TableCell>{item.original_row}</TableCell>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    item.voter_id.startsWith("V") && item.voter_id.length === 5
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {item.voter_id}
                                </Badge>
                              </TableCell>
                              <TableCell>{item.email || "—"}</TableCell>
                              <TableCell>
                                {hasError ? (
                                  <Badge variant="destructive">Error</Badge>
                                ) : (
                                  <Badge variant="default">Ready</Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                    {importPreview.length > 10 && (
                      <div className="p-3 text-center text-sm text-gray-500 border-t">
                        Showing first 10 of {importPreview.length} records
                      </div>
                    )}
                  </div>
                )}

                {/* CSV Format Help */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Expected CSV Format:</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      • <strong>Required columns:</strong> name (or "full name", "student name")
                    </p>
                    <p>
                      • <strong>Optional columns:</strong> voter_id (or "voter id", "id"), email
                    </p>
                    <p>
                      • <strong>Auto-generated:</strong> Voter IDs will be created automatically if not provided
                    </p>
                  </div>
                  <div className="mt-2 p-2 bg-white rounded border text-xs font-mono">
                    name,email,voter_id
                    <br />
                    John Doe,john@school.edu,V1001
                    <br />
                    Jane Smith,jane@school.edu,
                    <br />
                    Bob Johnson,,V1003
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleBulkImport}
                    disabled={importErrors.length > 0 || importPreview.length === 0}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Import {importPreview.length} Voters
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{votes.length}</div>
            <p className="text-xs text-muted-foreground">All positions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Voters</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(votes.map((v) => v.voter_id)).size}</div>
            <p className="text-xs text-muted-foreground">Students voted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positions</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
            <p className="text-xs text-muted-foreground">Contested</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parties</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{parties.length}</div>
            <p className="text-xs text-muted-foreground">Participating</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Votes</CardTitle>
          <CardDescription>Search and filter votes by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by voter name, ID, or candidate..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={filterPost} onValueChange={setFilterPost}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                {posts.map((post) => (
                  <SelectItem key={post} value={post}>
                    {post}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterParty} onValueChange={setFilterParty}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by party" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Parties</SelectItem>
                {parties.map((party) => (
                  <SelectItem key={party} value={party}>
                    {party}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Votes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vote Records</CardTitle>
          <CardDescription>
            Showing {filteredVotes.length} of {votes.length} votes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Voter</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Candidate</TableHead>
                <TableHead>Party</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVotes.map((vote) => (
                <TableRow key={vote.id}>
                  <TableCell className="font-medium">{vote.voter_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{vote.voter_id}</Badge>
                  </TableCell>
                  <TableCell>{vote.post_title}</TableCell>
                  <TableCell className="font-medium">{vote.candidate_name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{vote.party}</Badge>
                  </TableCell>
                  <TableCell>{new Date(vote.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteVote(vote.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredVotes.length === 0 && (
            <div className="text-center py-8">
              <Vote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No votes found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Voter ID Cards Section */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Voters & ID Cards</CardTitle>
          <CardDescription>Showing {voters.length} registered voters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {voters.map((voter) => (
              <div
                key={voter.id}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-gradient-to-br from-blue-50 to-purple-50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{voter.name}</h4>
                    <Badge variant="outline" className="text-sm">
                      ID: {voter.voter_id}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <Badge variant={voter.has_voted ? "default" : "secondary"}>
                      {voter.has_voted ? "Voted" : "Not Voted"}
                    </Badge>
                  </div>
                </div>

                {voter.email && <p className="text-sm text-gray-600 mb-3">{voter.email}</p>}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => generateVoterIdPdf(voter)}
                    className="flex items-center gap-1 text-xs"
                  >
                    <Printer className="w-3 h-3" />
                    Print ID
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      if (confirm(`Delete voter ${voter.name}? This will also delete their votes.`)) {
                        try {
                          await supabase.from("voters").delete().eq("id", voter.id)
                          await loadVotes()
                        } catch (error) {
                          alert("Failed to delete voter")
                        }
                      }
                    }}
                    className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {voters.length === 0 && (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No voters registered</h3>
              <p className="text-gray-500">Create your first voter to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
