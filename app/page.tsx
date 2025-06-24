"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Vote, AlertCircle, Info } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [voterId, setVoterId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!voterId.trim()) {
      setError("Please enter your Voter ID")
      setIsLoading(false)
      return
    }

    // Simulate authentication
    setTimeout(() => {
      if (voterId.length >= 6) {
        window.location.href = "/ballot"
      } else {
        setError("Invalid Voter ID. Please check and try again.")
        setIsLoading(false)
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center text-white space-y-4">
          <div className="flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
              <Vote className="h-12 w-12 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold">Student Voting Portal</h1>
            <p className="text-blue-100 mt-2">Lubiri Secondary School Elections</p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-800">Cast Your Vote</CardTitle>
            <CardDescription className="text-gray-600">Enter your Voter ID to access the ballot</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="voterId" className="text-gray-700 font-medium">
                  Voter ID
                </Label>
                <Input
                  id="voterId"
                  type="text"
                  placeholder="Enter your Voter ID"
                  value={voterId}
                  onChange={(e) => setVoterId(e.target.value)}
                  className="h-12 text-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>

              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Access Ballot"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-start space-x-3 text-sm text-gray-600">
                <Info className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700">Voting Instructions:</p>
                  <ul className="mt-1 space-y-1 text-xs">
                    <li>• Use your assigned Voter ID to log in</li>
                    <li>• You can only vote once per election</li>
                    <li>• Review your choices before submitting</li>
                    <li>• Contact election officials if you need help</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Login Link */}
        <div className="text-center">
          <Link href="/admin/login">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Administrator Login
            </Button>
          </Link>
        </div>

        {/* About Link */}
        <div className="text-center">
          <Link href="/about">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              About This System
            </Button>
          </Link>
        </div>

        {/* Creator Credit */}
        <div className="text-center text-white/70 text-sm">
          <p>
            Created by <span className="font-medium text-white">Sseruwagi Sinclaire Sebastian</span>
          </p>
        </div>
      </div>
    </div>
  )
}
