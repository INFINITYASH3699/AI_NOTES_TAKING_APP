import { getSession } from "@/lib/auth/session"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { User, Mail, Calendar } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default async function ProfilePage() {
  const session = await getSession()

  if (!session) {
    return null
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <User className="h-6 w-6" />
            </div>
            <div>
              <Label className="text-muted-foreground">Name</Label>
              <p className="text-lg font-medium">{session.user.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <p className="text-lg font-medium">{session.user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <Label className="text-muted-foreground">Member Since</Label>
              <p className="text-lg font-medium">
                {formatDate(session.user.createdAt)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}