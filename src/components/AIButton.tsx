"use client"

import { useState } from "react"
import { Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

interface AIButtonProps {
  content: string
  onResult: (result: string, action: string) => void
  disabled?: boolean
}

export function AIButton({ content, onResult, disabled = false }: AIButtonProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleAIAction = async (action: "summarize" | "improve" | "tags") => {
    if (!content || content.trim().length === 0) {
      toast({
        title: "Error",
        description: "Please add some content first",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, action }),
      })

      if (!response.ok) {
        throw new Error("AI request failed")
      }

      const data = await response.json()

      if (data.success) {
        onResult(data.result, action)
        toast({
          title: "Success",
          description: `AI ${action} completed successfully`,
        })
      } else {
        throw new Error(data.error || "AI request failed")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process AI request",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled || loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          AI Features
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleAIAction("summarize")}>
          Summarize Note
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAIAction("improve")}>
          Improve Content
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAIAction("tags")}>
          Generate Tags
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}