"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  HelpCircle,
  Vote,
  Users,
  Shield,
  Phone,
  Mail,
  MessageCircle,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
} from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I vote in the election?",
      answer: "Enter your unique Voter ID on the login page. You'll be guided through each position step by step. Select your preferred candidate for each position and submit your ballot.",
    },
    {
      question: "What is my Voter ID?",
      answer: "Your Voter ID is a unique identifier provided by the school administration. It typically starts with 'V' followed by numbers (e.g., V001). Contact your class teacher if you don't have yours.",
    },
    {
      question: "Can I change my vote after submitting?",
      answer: "No, once you submit your ballot, your votes are final and cannot be changed. Please review your selections carefully before submitting.",
    },
    {
      question: "What if I encounter technical issues?",
      answer: "If you experience any technical problems, immediately contact the technical support team or your class teacher. Do not attempt to vote multiple times.",
    },
    {
      question: "How long do I have to complete voting?",
      answer: "You have 2 minutes to complete your ballot once you start voting. The timer will be displayed at the top of your screen.",
    },
    {
      question: "Can I vote from my mobile phone?",
      answer: "Yes, the voting system is fully responsive and works on mobile phones, tablets, and computers. Use any device with internet access.",
    },
  ]

  const troubleshooting = [
    {
      issue: "Invalid Voter ID error",
      solution: "Double-check your Voter ID for typos. Ensure you're using the correct format (e.g., V001). Contact your class teacher if the problem persists.",
      severity: "warning",
    },
    {
      issue: "Already voted message",
      solution: "This means you have already cast your vote in this election. Each student can only vote once. If you believe this is an error, contact the electoral commission.",
      severity: "info",
    },
    {
      issue: "Page won't load or is slow",
      solution: "Check your internet connection. Try refreshing the page or using a different browser. Clear your browser cache if needed.",
      severity: "warning",
    },
    {
      issue: "Timer running out",
      solution: "You have 2 minutes to complete voting. If time runs out, you'll be automatically logged out for security. Start over with your Voter ID.",
      severity: "error",
    },
  ]

  const votingSteps = [
    {
      step: 1,
      title: "Get Your Voter ID",
      description: "Obtain your unique Voter ID from your class teacher or the electoral commission.",
    },
    {
      step: 2,
      title: "Access the Voting System",
      description: "Go to the school's voting website and enter your Voter ID on the login page.",
    },
    {
      step: 3,
      title: "Review Positions",
      description: "You'll see all available positions. Read through each position and candidate information.",
    },
    {
      step: 4,
      title: "Make Your Selections",
      description: "Select one candidate for each position. You can navigate between positions using the Next/Previous buttons.",
    },
    {
      step: 5,
      title: "Review and Submit",
      description: "Review all your selections carefully, then click 'Submit My Vote' to finalize your ballot.",
    },
    {
      step: 6,
      title: "Confirmation",
      description: "You'll receive a confirmation that your vote has been recorded. Keep this for your records.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Help & Support
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get help with voting, troubleshooting, and frequently asked questions
            </p>
          </div>

          <div className="w-20"></div> {/* Spacer for centering */}
        </div>

        <Tabs defaultValue="voting-guide" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="voting-guide">Voting Guide</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="voting-guide" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Vote className="w-5 h-5" />
                  How to Vote: Step-by-Step Guide
                </CardTitle>
                <CardDescription>Follow these simple steps to cast your vote in the election</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {votingSteps.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                          {step.step}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Important Reminders
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      You have 2 minutes to complete your voting once you start.
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      You can only vote once. Make sure to review your selections before submitting.
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Your vote is secret and secure. No one can see who you voted for.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Voting Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Valid Voter ID</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Internet connection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Modern web browser</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Must be a registered student</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Common questions and answers about the voting process</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                      <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="troubleshooting" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Troubleshooting Common Issues</CardTitle>
                <CardDescription>Solutions to common problems you might encounter</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {troubleshooting.map((item, index) => (
                    <Alert key={index} className={
                      item.severity === 'error' ? 'border-red-200 bg-red-50' :
                      item.severity === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                      'border-blue-200 bg-blue-50'
                    }>
                      {item.severity === 'error' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                      {item.severity === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                      {item.severity === 'info' && <Info className="h-4 w-4 text-blue-600" />}
                      <div>
                        <h4 className="font-semibold mb-1">{item.issue}</h4>
                        <AlertDescription>{item.solution}</AlertDescription>
                      </div>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Technical Support
                  </CardTitle>
                  <CardDescription>For technical issues and voting problems</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>+256 XXX XXX XXX</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>tech.support@lubiriss.edu.ug</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-4 h-4 text-muted-foreground" />
                    <span>Available during voting hours</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Electoral Commission
                  </CardTitle>
                  <CardDescription>For election-related questions and disputes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>+256 XXX XXX XXX</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>electoral@lubiriss.edu.ug</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-4 h-4 text-muted-foreground" />
                    <span>Office hours: 8:00 AM - 5:00 PM</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Emergency Contacts</CardTitle>
                <CardDescription>In case of urgent issues during voting</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">System Administrator</h4>
                    <p className="text-sm text-red-600">Sseruwagi Sinclaire Sebastian</p>
                    <p className="text-sm text-red-600">+256 XXX XXX XXX</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Electoral Chairperson</h4>
                    <p className="text-sm text-blue-600">Available during voting</p>
                    <p className="text-sm text-blue-600">+256 XXX XXX XXX</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Head Teacher</h4>
                    <p className="text-sm text-green-600">Final authority</p>
                    <p className="text-sm text-green-600">+256 XXX XXX XXX</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="text-center py-8">
            <h3 className="text-2xl font-bold mb-4">Need Immediate Help?</h3>
            <p className="mb-6 opacity-90">
              If you're experiencing issues while voting, don't hesitate to ask for help
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="secondary" size="lg">
                <Phone className="w-4 h-4 mr-2" />
                Call Support
              </Button>
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-blue-600">
                <MessageCircle className="w-4 h-4 mr-2" />
                Live Chat
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-4 border-t">
          <p className="text-sm text-muted-foreground">
            Lubiri Secondary School Digital Election System | 
            <span className="font-semibold text-blue-600 ml-1">Help & Support Center</span>
          </p>
        </div>
      </div>
    </div>
  )
}