"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"
import { Settings, Save, RefreshCw, Database, Shield, Bell, Users, Clock } from "lucide-react"

interface ElectionSettings {
  id: string
  title: string
  description: string
  start_date: string
  end_date: string
  is_active: boolean
}

export default function SettingsPage() {
  const [election, setElection] = useState<ElectionSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [systemSettings, setSystemSettings] = useState({
    allowLateVoting: false,
    showLiveResults: true,
    enableNotifications: true,
    votingTimeLimit: 120, // 2 minutes
    maxVotesPerPosition: 1,
    requireVoterVerification: true,
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const { data: electionData } = await supabase.from("elections").select("*").eq("is_active", true).single()

      if (electionData) {
        setElection(electionData)
      }
    } catch (error) {
      console.error("Error loading settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveElection = async () => {
    if (!election) return

    setSaving(true)
    try {
      await supabase
        .from("elections")
        .update({
          title: election.title,
          description: election.description,
          start_date: election.start_date,
          end_date: election.end_date,
          is_active: election.is_active,
        })
        .eq("id", election.id)

      alert("Election settings saved successfully!")
    } catch (error) {
      alert("Failed to save election settings")
    } finally {
      setSaving(false)
    }
  }

  const handleResetVotes = async () => {
    if (!confirm("Are you sure you want to reset ALL votes? This action cannot be undone!")) {
      return
    }

    try {
      // Reset all votes
      await supabase.from("votes").delete().neq("id", "00000000-0000-0000-0000-000000000000")

      // Reset voter status
      await supabase
        .from("voters")
        .update({ has_voted: false, voted_at: null })
        .neq("id", "00000000-0000-0000-0000-000000000000")

      alert("All votes have been reset successfully!")
    } catch (error) {
      alert("Failed to reset votes")
    }
  }

  const handleExportData = async () => {
    try {
      const [votesResult, votersResult, candidatesResult] = await Promise.all([
        supabase.from("votes").select("*"),
        supabase.from("voters").select("*"),
        supabase.from("candidates").select("*"),
      ])

      const exportData = {
        votes: votesResult.data,
        voters: votersResult.data,
        candidates: candidatesResult.data,
        exported_at: new Date().toISOString(),
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `election-data-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      alert("Failed to export data")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Configure election and system settings</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          <Settings className="w-4 h-4 mr-1" />
          Admin Panel
        </Badge>
      </div>

      <Tabs defaultValue="election" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="election">Election</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
        </TabsList>

        <TabsContent value="election" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Election Configuration
              </CardTitle>
              <CardDescription>Configure basic election information and schedule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {election && (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="title">Election Title</Label>
                      <Input
                        id="title"
                        value={election.title}
                        onChange={(e) => setElection({ ...election, title: e.target.value })}
                        placeholder="Enter election title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Election Status</Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="status"
                          checked={election.is_active}
                          onCheckedChange={(checked) => setElection({ ...election, is_active: checked })}
                        />
                        <Label htmlFor="status">{election.is_active ? "Active" : "Inactive"}</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={election.description || ""}
                      onChange={(e) => setElection({ ...election, description: e.target.value })}
                      placeholder="Enter election description"
                      rows={3}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="start_date">Start Date & Time</Label>
                      <Input
                        id="start_date"
                        type="datetime-local"
                        value={election.start_date ? new Date(election.start_date).toISOString().slice(0, 16) : ""}
                        onChange={(e) => setElection({ ...election, start_date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end_date">End Date & Time</Label>
                      <Input
                        id="end_date"
                        type="datetime-local"
                        value={election.end_date ? new Date(election.end_date).toISOString().slice(0, 16) : ""}
                        onChange={(e) => setElection({ ...election, end_date: e.target.value })}
                      />
                    </div>
                  </div>

                  <Button onClick={handleSaveElection} disabled={saving} className="w-full">
                    {saving ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </div>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Election Settings
                      </>
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Voting Settings
                </CardTitle>
                <CardDescription>Configure voting behavior and limits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Late Voting</Label>
                    <p className="text-sm text-muted-foreground">Allow voting after the official end time</p>
                  </div>
                  <Switch
                    checked={systemSettings.allowLateVoting}
                    onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, allowLateVoting: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeLimit">Voting Time Limit (seconds)</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    value={systemSettings.votingTimeLimit}
                    onChange={(e) =>
                      setSystemSettings({ ...systemSettings, votingTimeLimit: Number.parseInt(e.target.value) })
                    }
                    min="60"
                    max="600"
                  />
                  <p className="text-sm text-muted-foreground">
                    Current: {Math.floor(systemSettings.votingTimeLimit / 60)} minutes{" "}
                    {systemSettings.votingTimeLimit % 60} seconds
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxVotes">Max Votes Per Position</Label>
                  <Input
                    id="maxVotes"
                    type="number"
                    value={systemSettings.maxVotesPerPosition}
                    onChange={(e) =>
                      setSystemSettings({ ...systemSettings, maxVotesPerPosition: Number.parseInt(e.target.value) })
                    }
                    min="1"
                    max="5"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Display Settings
                </CardTitle>
                <CardDescription>Configure what information is visible</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Live Results</Label>
                    <p className="text-sm text-muted-foreground">Display real-time voting results</p>
                  </div>
                  <Switch
                    checked={systemSettings.showLiveResults}
                    onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, showLiveResults: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Notifications</Label>
                    <p className="text-sm text-muted-foreground">Show system notifications and alerts</p>
                  </div>
                  <Switch
                    checked={systemSettings.enableNotifications}
                    onCheckedChange={(checked) =>
                      setSystemSettings({ ...systemSettings, enableNotifications: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Configure security and verification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Voter Verification</Label>
                  <p className="text-sm text-muted-foreground">
                    Verify voter identity before allowing access to ballot
                  </p>
                </div>
                <Switch
                  checked={systemSettings.requireVoterVerification}
                  onCheckedChange={(checked) =>
                    setSystemSettings({ ...systemSettings, requireVoterVerification: checked })
                  }
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Session Timeout</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatic logout after {systemSettings.votingTimeLimit} seconds of inactivity
                  </p>
                  <Badge variant="outline">Active</Badge>
                </div>

                <div className="space-y-2">
                  <Label>Vote Encryption</Label>
                  <p className="text-sm text-muted-foreground">All votes are encrypted in transit and at rest</p>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Enabled
                  </Badge>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Security Notice</span>
                </div>
                <p className="text-sm text-yellow-700">
                  All voter activities are logged for audit purposes. Ensure compliance with your institution's privacy
                  policies.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Data Export
                </CardTitle>
                <CardDescription>Export election data for backup or analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleExportData} variant="outline" className="w-full">
                  <Database className="w-4 h-4 mr-2" />
                  Export All Data
                </Button>
                <p className="text-sm text-muted-foreground">
                  Downloads a JSON file containing all votes, voters, and candidate data.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Reset Options
                </CardTitle>
                <CardDescription>Reset election data (use with caution)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleResetVotes} variant="destructive" className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset All Votes
                </Button>
                <p className="text-sm text-muted-foreground">
                  This will permanently delete all votes and reset voter status. This action cannot be undone.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Database Statistics</CardTitle>
              <CardDescription>Current database usage and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">-</div>
                  <div className="text-sm text-muted-foreground">Total Voters</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Database className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">-</div>
                  <div className="text-sm text-muted-foreground">Total Votes</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">-</div>
                  <div className="text-sm text-muted-foreground">Candidates</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Settings className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-600">-</div>
                  <div className="text-sm text-muted-foreground">Positions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
