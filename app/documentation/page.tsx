"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  BookOpen,
  Code,
  Database,
  Settings,
  Users,
  Shield,
  Play,
  Terminal,
  Download,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Info,
} from "lucide-react"

export default function DocumentationPage() {
  const installationSteps = [
    {
      step: 1,
      title: "Clone Repository",
      code: "git clone https://github.com/your-repo/election-system.git\ncd election-system",
    },
    {
      step: 2,
      title: "Install Dependencies",
      code: "npm install\n# or\nyarn install",
    },
    {
      step: 3,
      title: "Setup Environment",
      code: "cp .env.example .env.local\n# Configure your environment variables",
    },
    {
      step: 4,
      title: "Setup Database",
      code: "npm run db:setup\n# This will create tables and seed initial data",
    },
    {
      step: 5,
      title: "Start Development Server",
      code: "npm run dev\n# Open http://localhost:3000",
    },
  ]

  const apiEndpoints = [
    {
      method: "POST",
      endpoint: "/api/auth/login",
      description: "Authenticate user and create session",
      params: "{ voter_id: string, password?: string }",
    },
    {
      method: "GET",
      endpoint: "/api/elections/active",
      description: "Get current active election",
      params: "None",
    },
    {
      method: "POST",
      endpoint: "/api/votes",
      description: "Submit vote for a position",
      params: "{ candidate_id: string, post_id: string }",
    },
    {
      method: "GET",
      endpoint: "/api/results/:election_id",
      description: "Get election results",
      params: "election_id: string",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-slate-600 to-blue-600 rounded-full">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-600 to-blue-600 bg-clip-text text-transparent">
              System Documentation
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete guide for installation, configuration, and usage of the Digital Election System
          </p>
        </div>

        <Tabs defaultValue="getting-started" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="installation">Installation</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="api">API Reference</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
            <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
          </TabsList>

          <TabsContent value="getting-started" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Quick Start Guide
                </CardTitle>
                <CardDescription>Get up and running in 5 minutes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    This guide assumes you have Node.js 18+ and npm installed on your system.
                  </AlertDescription>
                </Alert>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Prerequisites</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Node.js 18 or higher</li>
                      <li>• npm or yarn package manager</li>
                      <li>• Git for version control</li>
                      <li>• Supabase account (free tier available)</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold">What You'll Get</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Complete voting system</li>
                      <li>• Admin dashboard</li>
                      <li>• Real-time analytics</li>
                      <li>• Secure authentication</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button>
                    <Download className="w-4 h-4 mr-2" />
                    Download Source Code
                  </Button>
                  <Button variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live Demo
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    For Administrators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Learn how to set up elections, manage candidates, and monitor voting.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Admin Guide
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    For Developers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Customize the system, integrate with existing tools, and extend functionality.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Developer Guide
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Understand security features, best practices, and compliance requirements.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Security Guide
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="installation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Installation Steps</CardTitle>
                <CardDescription>Follow these steps to install the system locally</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {installationSteps.map((step, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                        {step.step}
                      </div>
                      <h4 className="font-semibold">{step.title}</h4>
                    </div>
                    <div className="ml-11">
                      <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                        <pre>{step.code}</pre>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                After completing these steps, your development server will be running at http://localhost:3000
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="configuration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Environment Configuration
                </CardTitle>
                <CardDescription>Configure your environment variables</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{`# Database Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Optional: Email Configuration
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password`}</pre>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Never commit your .env.local file to version control. Keep your secrets secure!
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Database Setup
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    The system uses Supabase (PostgreSQL) for data storage. Follow these steps:
                  </p>
                  <ol className="space-y-2 text-sm">
                    <li>1. Create a new Supabase project</li>
                    <li>2. Copy your project URL and API keys</li>
                    <li>3. Run the database migration scripts</li>
                    <li>4. Seed initial data (optional)</li>
                  </ol>
                  <Button variant="outline" size="sm">
                    <Database className="w-4 h-4 mr-2" />
                    Database Schema
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Configure security settings for production deployment:
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li>• Enable Row Level Security (RLS)</li>
                    <li>• Configure CORS settings</li>
                    <li>• Set up SSL certificates</li>
                    <li>• Configure rate limiting</li>
                  </ul>
                  <Button variant="outline" size="sm">
                    <Shield className="w-4 h-4 mr-2" />
                    Security Checklist
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Reference</CardTitle>
                <CardDescription>Complete API documentation for developers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiEndpoints.map((endpoint, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center gap-3">
                        <Badge variant={endpoint.method === "GET" ? "default" : "secondary"}>{endpoint.method}</Badge>
                        <code className="text-sm font-mono bg-slate-100 px-2 py-1 rounded">{endpoint.endpoint}</code>
                      </div>
                      <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                      {endpoint.params !== "None" && (
                        <div className="text-sm">
                          <span className="font-medium">Parameters: </span>
                          <code className="bg-slate-100 px-2 py-1 rounded">{endpoint.params}</code>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Authentication</CardTitle>
                <CardDescription>How to authenticate API requests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  The API uses session-based authentication. Include the session token in your requests:
                </p>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{`// Example API request
fetch('/api/votes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + sessionToken
  },
  body: JSON.stringify({
    candidate_id: 'candidate-uuid',
    post_id: 'post-uuid'
  })
})`}</pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deployment" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Vercel Deployment</CardTitle>
                  <CardDescription>Deploy to Vercel in one click</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">The easiest way to deploy is using Vercel's platform:</p>
                  <ol className="space-y-2 text-sm">
                    <li>1. Connect your GitHub repository</li>
                    <li>2. Configure environment variables</li>
                    <li>3. Deploy with automatic CI/CD</li>
                  </ol>
                  <Button className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Deploy to Vercel
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Self-Hosted Deployment</CardTitle>
                  <CardDescription>Deploy on your own infrastructure</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">For more control, deploy on your own servers:</p>
                  <ol className="space-y-2 text-sm">
                    <li>1. Build the production bundle</li>
                    <li>2. Configure reverse proxy (nginx)</li>
                    <li>3. Set up SSL certificates</li>
                    <li>4. Configure monitoring</li>
                  </ol>
                  <Button variant="outline" className="w-full">
                    <Terminal className="w-4 h-4 mr-2" />
                    Self-Host Guide
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Production Checklist</CardTitle>
                <CardDescription>Ensure your deployment is production-ready</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Security</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>SSL certificate configured</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Environment variables secured</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Database security enabled</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Performance</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>CDN configured</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Database optimized</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Monitoring enabled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="troubleshooting" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Common Issues</CardTitle>
                <CardDescription>Solutions to frequently encountered problems</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-semibold text-red-700">Database Connection Error</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Check your Supabase URL and API keys in the environment variables.
                    </p>
                    <div className="mt-2 text-sm">
                      <strong>Solution:</strong> Verify SUPABASE_URL and SUPABASE_ANON_KEY are correct.
                    </div>
                  </div>

                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h4 className="font-semibold text-yellow-700">Build Errors</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      TypeScript or build compilation errors during deployment.
                    </p>
                    <div className="mt-2 text-sm">
                      <strong>Solution:</strong> Run `npm run build` locally to identify and fix issues.
                    </div>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-blue-700">Authentication Issues</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Users unable to log in or session management problems.
                    </p>
                    <div className="mt-2 text-sm">
                      <strong>Solution:</strong> Check NEXTAUTH_SECRET and NEXTAUTH_URL configuration.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Debug Mode</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">Enable debug mode for detailed error logging:</p>
                  <div className="bg-slate-900 text-slate-100 p-3 rounded font-mono text-sm">
                    <pre>DEBUG=true npm run dev</pre>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Get Help</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">Still having issues? Get help from the community:</p>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      GitHub Issues
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Discord Community
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Creator Credit */}
        <div className="text-center py-4 border-t">
          <p className="text-sm text-muted-foreground">
            Documentation by <span className="font-semibold text-blue-600">Sseruwagi Sinclaire Sebastian</span>
          </p>
        </div>
      </div>
    </div>
  )
}
