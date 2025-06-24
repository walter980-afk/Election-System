import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield, Users, BarChart3, Vote, Database, Smartphone, Globe, Lock, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Lubiri Secondary School Election System</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive digital voting platform designed for modern student government elections, combining
              security, transparency, and ease of use.
            </p>
          </div>
        </div>

        {/* Key Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <Vote className="h-8 w-8 text-blue-500 mb-2" />
              <CardTitle className="text-lg">Secure Voting</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Encrypted ballot storage with unique voter ID authentication and one-vote-per-student enforcement.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle className="text-lg">Real-time Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Live vote tracking and instant result compilation with comprehensive analytics and reporting.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <Users className="h-8 w-8 text-purple-500 mb-2" />
              <CardTitle className="text-lg">Role-based Access</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Multi-level administrative access for Super Admin, Electoral Commission, and Headteacher roles.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <Smartphone className="h-8 w-8 text-orange-500 mb-2" />
              <CardTitle className="text-lg">Mobile Responsive</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Optimized for all devices with clean, intuitive interface that works on phones, tablets, and desktops.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <Database className="h-8 w-8 text-red-500 mb-2" />
              <CardTitle className="text-lg">Data Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Comprehensive student data import, candidate management, and automated voter ID generation.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-indigo-500">
            <CardHeader>
              <Shield className="h-8 w-8 text-indigo-500 mb-2" />
              <CardTitle className="text-lg">Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Complete activity logging and audit capabilities for transparency and compliance verification.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* System Overview */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Globe className="mr-3 h-6 w-6" />
              System Overview
            </CardTitle>
            <CardDescription>How the Lubiri Election System works for students and administrators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  For Students
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Secure login with unique voter ID</li>
                  <li>• Clean, organized ballot interface</li>
                  <li>• Vote for multiple positions in one session</li>
                  <li>• Instant vote confirmation and receipt</li>
                  <li>• Mobile-friendly voting experience</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Lock className="mr-2 h-5 w-5 text-blue-500" />
                  For Administrators
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Real-time election monitoring dashboard</li>
                  <li>• Candidate and voter management tools</li>
                  <li>• Comprehensive analytics and reporting</li>
                  <li>• Live vote tallying and results</li>
                  <li>• Audit logs and security oversight</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Specifications */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Technical Specifications</CardTitle>
            <CardDescription>Built with modern web technologies for reliability and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Frontend</h4>
                <div className="space-y-1">
                  <Badge variant="secondary">Next.js 14</Badge>
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                  <Badge variant="secondary">Tailwind CSS</Badge>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Backend</h4>
                <div className="space-y-1">
                  <Badge variant="secondary">Supabase</Badge>
                  <Badge variant="secondary">PostgreSQL</Badge>
                  <Badge variant="secondary">Server Actions</Badge>
                  <Badge variant="secondary">API Routes</Badge>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Deployment</h4>
                <div className="space-y-1">
                  <Badge variant="secondary">Vercel</Badge>
                  <Badge variant="secondary">CDN</Badge>
                  <Badge variant="secondary">SSL/TLS</Badge>
                  <Badge variant="secondary">Auto-scaling</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Election Positions */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Supported Election Positions</CardTitle>
            <CardDescription>Comprehensive coverage of student government positions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "Head Boy",
                "Head Girl",
                "Deputy Head Boy",
                "Deputy Head Girl",
                "Senior Prefect Boy",
                "Senior Prefect Girl",
                "Sports Prefect",
                "Academics Prefect",
                "Discipline Prefect",
                "Entertainment Prefect",
                "Health Prefect",
                "Environment Prefect",
              ].map((position) => (
                <div key={position} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Vote className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="text-sm font-medium">{position}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Creator Section */}
        <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">System Creator</h2>
            <p className="text-lg mb-2">
              <strong>Sseruwagi Sinclaire Sebastian</strong>
            </p>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Designed and developed as a comprehensive solution for modern educational institutions seeking to digitize
              their democratic processes. This system combines best practices in web development, security, and user
              experience design to create a reliable and trustworthy voting platform.
            </p>
            <div className="mt-6">
              <Badge variant="secondary" className="text-blue-600">
                Full-Stack Developer
              </Badge>
              <Badge variant="secondary" className="text-blue-600 ml-2">
                System Architect
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600">
          <p>© 2024 Lubiri Secondary School Election System. All rights reserved.</p>
          <p className="text-sm mt-2">Built with security, transparency, and user experience in mind.</p>
        </div>
      </div>
    </div>
  )
}
