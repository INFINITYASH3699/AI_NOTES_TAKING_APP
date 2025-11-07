import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, FileText, Tags, Zap } from "lucide-react"
import { getSession } from "@/lib/auth/session"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const session = await getSession()
  
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Your Notes, <span className="text-primary">Supercharged</span> with AI
          </h1>
          <p className="text-xl text-muted-foreground">
            Take better notes with AI-powered summaries, improvements, and smart tagging.
            Simple, fast, and intelligent note-taking for everyone.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg" asChild>
              <Link href="/register">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-muted-foreground">Everything you need for smart note-taking</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Sparkles className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>AI Summaries</CardTitle>
              <CardDescription>
                Get instant summaries of your long notes with AI
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Smart Editor</CardTitle>
              <CardDescription>
                Beautiful, distraction-free writing experience
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Tags className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Auto-Tagging</CardTitle>
              <CardDescription>
                AI automatically generates relevant tags for your notes
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Improve Content</CardTitle>
              <CardDescription>
                Enhance grammar and clarity with AI assistance
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <CardTitle className="text-3xl">Ready to get started?</CardTitle>
            <CardDescription className="text-lg">
              Join thousands of users taking smarter notes with AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" asChild>
              <Link href="/register">Create Free Account</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 AI Note-Taking App. Built with Next.js, Hono.js, and OpenAI.</p>
        </div>
      </footer>
    </div>
  )
}