"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { NoteCard } from "@/components/NoteCard"
import { SearchBar } from "@/components/SearchBar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Plus, FileText } from "lucide-react"
import Link from "next/link"
import { Note } from "@/types"

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchNotes()
  }, [search])

  const fetchNotes = async () => {
    try {
      const url = search
        ? `/api/notes?search=${encodeURIComponent(search)}`
        : "/api/notes"

      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed to fetch notes")

      const data = await response.json()
      setNotes(data.notes)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load notes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete note")

      setNotes(notes.filter((note) => note.id !== id))
      toast({
        title: "Success",
        description: "Note deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Notes</h1>
          <p className="text-muted-foreground">
            Manage and organize your notes with AI
          </p>
        </div>
        <Button asChild>
          <Link href="/notes/new">
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Link>
        </Button>
      </div>

      <SearchBar value={search} onChange={setSearch} />

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No notes yet</h3>
          <p className="text-muted-foreground mb-4">
            {search ? "No notes found matching your search" : "Create your first note to get started"}
          </p>
          {!search && (
            <Button asChild>
              <Link href="/notes/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Note
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}