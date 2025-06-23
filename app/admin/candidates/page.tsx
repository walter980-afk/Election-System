"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"
import { Users, Plus, Trash2, Search, Edit, Trophy, UserCheck, Crown, Star } from "lucide-react"

interface Candidate {
  id: string
  name: string
  gender: string
  post_title: string
  post_id: string
  category: string
  vote_count?: number
}

interface Post {
  id: string
  title: string
  category: string
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPost, setFilterPost] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null)
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    gender: "",
    post_id: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load posts
      const { data: postsData } = await supabase.from("posts").select("id, title, category").order("order_index")

      setPosts(postsData || [])

      // Load candidates with vote counts
      const { data: candidatesData } = await supabase.from("candidates").select(`
          id,
          name,
          gender,
          post_id,
          posts (
            title,
            category
          )
        `)

      if (candidatesData) {
        // Get vote counts for each candidate
        const candidatesWithVotes = await Promise.all(
          candidatesData.map(async (candidate: any) => {
            const { data: votes } = await supabase.from("votes").select("id").eq("candidate_id", candidate.id)

            return {
              id: candidate.id,
              name: candidate.name,
              gender: candidate.gender || "Not specified",
              post_title: candidate.posts?.title || "Unknown",
              category: candidate.posts?.category || "Unknown",
              post_id: candidate.post_id,
              vote_count: votes?.length || 0,
            }
          }),
        )

        setCandidates(candidatesWithVotes)
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCandidate = async () => {
    if (!newCandidate.name || !newCandidate.post_id || !newCandidate.gender) return

    try {
      await supabase.from("candidates").insert([newCandidate])
      setNewCandidate({ name: "", gender: "", post_id: "" })
      setIsAddDialogOpen(false)
      await loadData()
    } catch (error) {
      alert("Failed to add candidate")
    }
  }

  const handleEditCandidate = async () => {
    if (!editingCandidate) return

    try {
      await supabase
        .from("candidates")
        .update({
          name: editingCandidate.name,
          gender: editingCandidate.gender,
        })
        .eq("id", editingCandidate.id)

      setEditingCandidate(null)
      await loadData()
    } catch (error) {
      alert("Failed to update candidate")
    }
  }

  const handleDeleteCandidate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this candidate?")) return

    try {
      await supabase.from("candidates").delete().eq("id", id)
      await loadData()
    } catch (error) {
      alert("Failed to delete candidate")
    }
  }

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPost = filterPost === "all" || candidate.post_id === filterPost
    const matchesCategory = filterCategory === "all" || candidate.category === filterCategory

    return matchesSearch && matchesPost && matchesCategory
  })

  const categories = [...new Set(candidates.map((c) => c.category))]
  const totalVotes = candidates.reduce((sum, c) => sum + (c.vote_count || 0), 0)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Senior Leadership":
        return <Crown className="w-4 h-4" />
      case "Entertainment":
        return <Star className="w-4 h-4" />
      case "Games and Sports":
        return <Trophy className="w-4 h-4" />
      default:
        return <UserCheck className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading candidates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Prefectorial Candidates</h2>
          <p className="text-muted-foreground">Manage candidates for prefectorial elections</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Candidate
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Candidate</DialogTitle>
              <DialogDescription>Enter the candidate's information below.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newCandidate.name}
                  onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                  placeholder="Enter candidate's full name"
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={newCandidate.gender}
                  onValueChange={(value) => setNewCandidate({ ...newCandidate, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Select
                  value={newCandidate.post_id}
                  onValueChange={(value) => setNewCandidate({ ...newCandidate, post_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    {posts.map((post) => (
                      <SelectItem key={post.id} value={post.id}>
                        {post.title} ({post.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddCandidate} className="w-full">
                Add Candidate
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{candidates.length}</div>
            <p className="text-xs text-muted-foreground">Registered candidates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positions</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
            <p className="text-xs text-muted-foreground">Prefectorial positions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Position categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVotes}</div>
            <p className="text-xs text-muted-foreground">Votes received</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPost} onValueChange={setFilterPost}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                {posts.map((post) => (
                  <SelectItem key={post.id} value={post.id}>
                    {post.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Candidates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Candidate Directory</CardTitle>
          <CardDescription>
            Showing {filteredCandidates.length} of {candidates.length} candidates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Votes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell className="font-medium">{candidate.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        candidate.gender === "Male" ? "border-blue-300 text-blue-700" : "border-pink-300 text-pink-700"
                      }
                    >
                      {candidate.gender}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{candidate.post_title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getCategoryColor(candidate.category)}>
                      <span className="flex items-center gap-1">
                        {getCategoryIcon(candidate.category)}
                        {candidate.category}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{candidate.vote_count || 0}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditingCandidate(candidate)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteCandidate(candidate.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingCandidate} onOpenChange={() => setEditingCandidate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Candidate</DialogTitle>
            <DialogDescription>Update the candidate's information.</DialogDescription>
          </DialogHeader>
          {editingCandidate && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={editingCandidate.name}
                  onChange={(e) => setEditingCandidate({ ...editingCandidate, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-gender">Gender</Label>
                <Select
                  value={editingCandidate.gender}
                  onValueChange={(value) => setEditingCandidate({ ...editingCandidate, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleEditCandidate} className="w-full">
                Update Candidate
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
