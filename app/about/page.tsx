"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  Users,
  Vote,
  BarChart3,
  Lock,
  Database,
  Smartphone,
  CheckCircle,
  Download,
  Globe,
  Server,
  Zap,
  Eye,
  UserCheck,
  FileText,
  Settings,
  TrendingUp,
} from "lucide-react"

export default function AboutPage() {
  const features = [
    {
      icon: <Vote className="w-6 h-6" />,
      title: "Digital Voting",
      description: "Secure, paperless voting system with real-time ballot casting",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Security First",
      description: "End-to-end encryption, voter verification, and audit trails",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Live Analytics",
      description: "Real-time results, turnout tracking, and comprehensive reporting",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Multi-Role Access",
      description: "Student voters, administrators, and election officials with role-based permissions",
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Responsive Design",
      description: "Works seamlessly on desktop, tablet, and mobile devices",
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Data Management",
      description: "Comprehensive voter registration, candidate management, and result storage",
    },
  ]

  const technicalSpecs = [
    { category: "Frontend", technology: "Next.js 14, React 18, TypeScript" },
    { category: "UI Framework", technology: "Tailwind CSS, shadcn/ui Components" },
    { category: "Database", technology: "Supabase (PostgreSQL)" },
    { category: "Authentication", technology: "Role-based access control" },
    { category: "Charts & Analytics", technology: "Recharts, Custom Analytics" },
    { category: "Deployment", technology: "Vercel, Edge Functions" },
  ]

  const userRoles = [
    {
      role: "Students",
      permissions: ["Cast votes", "View ballot", "Confirm selections"],
      description: "Registered students can securely cast their votes for various positions",
    },
    {
      role: "Super Admin",
      permissions: ["Full system access", "User management", "Election configuration", "Data export"],
      description: "Complete administrative control over the election system",
    },
    {
      role: "Electoral Commission Chair",
      permissions: ["View results", "Generate reports", "Monitor elections"],
      description: "Oversight of election process and result verification",
    },
    {
      role: "Headteacher",
      permissions: ["View results", "Access reports", "Monitor turnout"],
      description: "Administrative oversight and result monitoring",
    },
  ]

  const securityFeatures = [
    "Voter ID verification and authentication",
    "One-vote-per-position enforcement",
    "Encrypted data transmission and storage",
    "Audit trails for all system activities",
    "Session timeout and automatic logout",
    "Role-based access control (RBAC)",
    "Database security with row-level security",
    "Real-time monitoring and logging",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <Vote className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Digital Election System
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive, secure, and user-friendly digital voting platform designed for educational institutions
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="px-3 py-1">
              <CheckCircle className="w-4 h-4 mr-1" />
              Production Ready
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              <Shield className="w-4 h-4 mr-1" />
              Secure
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              <Zap className="w-4 h-4 mr-1" />
              Real-time
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="users">User Roles</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    System Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    The Digital Election System is a modern, web-based voting platform specifically designed for
                    educational institutions. It provides a secure, transparent, and efficient way to conduct student
                    elections with real-time results and comprehensive analytics.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Key Benefits:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Eliminates paper ballots and manual counting</li>
                      <li>• Provides instant, accurate results</li>
                      <li>• Ensures voter privacy and election integrity</li>
                      <li>• Reduces administrative overhead</li>
                      <li>• Increases student engagement and participation</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    System Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 grid-cols-2">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">100%</div>
                      <div className="text-sm text-muted-foreground">Uptime</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">&lt;2s</div>
                      <div className="text-sm text-muted-foreground">Vote Time</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">256-bit</div>
                      <div className="text-sm text-muted-foreground">Encryption</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">24/7</div>
                      <div className="text-sm text-muted-foreground">Monitoring</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Election Process Flow</CardTitle>
                <CardDescription>How the digital election system works</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <UserCheck className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold">1. Registration</h4>
                    <p className="text-sm text-muted-foreground">Students register with voter ID</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <Vote className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold">2. Voting</h4>
                    <p className="text-sm text-muted-foreground">Secure ballot casting</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                      <BarChart3 className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold">3. Counting</h4>
                    <p className="text-sm text-muted-foreground">Automatic vote tallying</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                      <FileText className="w-6 h-6 text-orange-600" />
                    </div>
                    <h4 className="font-semibold">4. Results</h4>
                    <p className="text-sm text-muted-foreground">Real-time result display</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 bg-blue-100 rounded-lg text-blue-600">{feature.icon}</div>
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Administrative Features</CardTitle>
                <CardDescription>Comprehensive tools for election management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Election Management
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Create and configure elections</li>
                      <li>• Manage candidates and positions</li>
                      <li>• Set voting periods and rules</li>
                      <li>• Import voter data via spreadsheet</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Analytics & Reporting
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Real-time vote tracking</li>
                      <li>• Turnout analytics</li>
                      <li>• Comprehensive election reports</li>
                      <li>• Data export capabilities</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Technical Specifications</CardTitle>
                <CardDescription>Built with modern, scalable technologies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {technicalSpecs.map((spec, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{spec.category}</span>
                      <Badge variant="outline">{spec.technology}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="w-5 h-5" />
                    Architecture
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Frontend</h4>
                    <p className="text-sm text-muted-foreground">
                      React-based single-page application with server-side rendering
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Backend</h4>
                    <p className="text-sm text-muted-foreground">
                      Serverless functions with Supabase for database and authentication
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Database</h4>
                    <p className="text-sm text-muted-foreground">
                      PostgreSQL with real-time subscriptions and row-level security
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Page Load Time</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      &lt; 1.5s
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Vote Processing</span>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      &lt; 500ms
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Concurrent Users</span>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700">
                      1000+
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Uptime</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      99.9%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Features
                </CardTitle>
                <CardDescription>Multi-layered security approach</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {securityFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Data Protection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Encryption</h4>
                    <p className="text-sm text-muted-foreground">
                      All data encrypted in transit (TLS 1.3) and at rest (AES-256)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Privacy</h4>
                    <p className="text-sm text-muted-foreground">
                      Voter anonymity maintained while ensuring vote integrity
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Compliance</h4>
                    <p className="text-sm text-muted-foreground">GDPR compliant with data retention policies</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Audit & Monitoring
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Activity Logging</h4>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive logs of all system activities and user actions
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Real-time Monitoring</h4>
                    <p className="text-sm text-muted-foreground">24/7 system monitoring with automated alerts</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Audit Trails</h4>
                    <p className="text-sm text-muted-foreground">
                      Immutable records for election verification and compliance
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="grid gap-6">
              {userRoles.map((user, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      {user.role}
                    </CardTitle>
                    <CardDescription>{user.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Permissions:</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.permissions.map((permission, permIndex) => (
                          <Badge key={permIndex} variant="outline">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="deployment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Requirements</CardTitle>
                <CardDescription>Minimum requirements for deployment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Server Requirements</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Node.js 18+ runtime</li>
                      <li>• PostgreSQL 14+ database</li>
                      <li>• SSL certificate for HTTPS</li>
                      <li>• 2GB RAM minimum</li>
                      <li>• 10GB storage space</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold">Client Requirements</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Modern web browser (Chrome, Firefox, Safari, Edge)</li>
                      <li>• JavaScript enabled</li>
                      <li>• Stable internet connection</li>
                      <li>• Screen resolution 1024x768+</li>
                      <li>• Mobile responsive design</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Installation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Quick Deploy</h4>
                    <p className="text-sm text-muted-foreground">
                      One-click deployment to Vercel with automatic Supabase integration
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Custom Setup</h4>
                    <p className="text-sm text-muted-foreground">
                      Full source code available for custom deployment and modifications
                    </p>
                  </div>
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Documentation
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Environment Setup</h4>
                    <p className="text-sm text-muted-foreground">
                      Configure database connections, authentication, and system settings
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Customization</h4>
                    <p className="text-sm text-muted-foreground">
                      Customize branding, colors, and institution-specific settings
                    </p>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Setup Guide
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="text-center py-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="mb-6 opacity-90">
              Transform your institution's election process with our secure, modern digital voting system
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="secondary" size="lg">
                <Download className="w-4 h-4 mr-2" />
                Download System
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-white border-white hover:bg-white hover:text-blue-600"
              >
                <FileText className="w-4 h-4 mr-2" />
                View Documentation
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Creator Credit */}
        <div className="text-center py-4 border-t">
          <p className="text-sm text-muted-foreground">
            Created by <span className="font-semibold text-blue-600">Sseruwagi Sinclaire Sebastian</span>
          </p>
        </div>
      </div>
    </div>
  )
}
