"use client"

import { Note } from "@/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreVertical, Trash2, Edit, Calendar } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDate, truncate } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface NoteCardProps {
  note: Note
  onDelete: (id: string) => void
}

export function NoteCard({ note, onDelete }: NoteCardProps) {
  const router = useRouter()

  const handleEdit = () => {
    router.push(`/notes/${note.id}`)
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this note?")) {
      onDelete(note.id)
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader onClick={handleEdit}>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl line-clamp-1">{note.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="flex items-center gap-1 text-xs">
          <Calendar className="h-3 w-3" />
          {formatDate(note.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent onClick={handleEdit}>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {truncate(note.content, 150)}
        </p>
      </CardContent>
      {note.tags && note.tags.length > 0 && (
        <CardFooter onClick={handleEdit}>
          <div className="flex flex-wrap gap-1">
            {note.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {note.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{note.tags.length - 3}
              </Badge>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  )
}