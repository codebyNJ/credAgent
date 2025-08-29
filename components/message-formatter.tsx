"use client"

import { Badge } from "@/components/ui/badge"
import { TrendingUp, Calendar, Hash } from "lucide-react"

interface ApiResponse {
  response: string
  session_id: string
  intent: string
  timestamp: string
}

interface MessageFormatterProps {
  content: string
  isUser: boolean
}

export function MessageFormatter({ content, isUser }: MessageFormatterProps) {
  // Try to parse as JSON API response
  let apiResponse: ApiResponse | null = null
  try {
    apiResponse = JSON.parse(content)
  } catch {
    // Not JSON, treat as regular text
  }

  if (isUser) {
    // increase contrast for user text on amber bubble and enforce wrapping
    return <div className="text-sm text-amber-50 leading-relaxed whitespace-pre-wrap break-words">{content}</div>
  }

  if (apiResponse) {
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2 mb-1">
          <Badge variant="outline" className="text-xs bg-white/5 border-white/10 text-white/80">
            <Hash className="w-3 h-3 mr-1" />
            {apiResponse.session_id.slice(0, 8)}...
          </Badge>
          <Badge variant="outline" className="text-xs bg-blue-500/10 border-blue-500/20 text-blue-300">
            <TrendingUp className="w-3 h-3 mr-1" />
            {apiResponse.intent.replace("_", " ")}
          </Badge>
          <Badge variant="outline" className="text-xs bg-white/5 border-white/10 text-white/80">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(apiResponse.timestamp).toLocaleString()}
          </Badge>
        </div>

        <div className="formatted-content overflow-x-auto scrollbar-none">
          <div
            className="prose prose-invert prose-sm max-w-none
              prose-headings:text-white prose-headings:font-brand
              prose-p:text-white prose-p:leading-relaxed
              prose-strong:text-white prose-strong:font-semibold
              prose-a:text-white
              prose-table:text-white prose-th:text-white prose-td:text-white
              prose-td:border-white/10 prose-th:border-white/20
              prose-ul:text-white prose-li:text-white"
            dangerouslySetInnerHTML={{ __html: formatMarkdownContent(apiResponse.response) }}
          />
        </div>
      </div>
    )
  }

  // Regular text message
  // improve contrast and wrapping for plain assistant text
  return <div className="text-sm text-white leading-relaxed whitespace-pre-wrap break-words">{content}</div>
}

function formatMarkdownContent(content: string): string {
  // Convert markdown tables to HTML with safe cell padding and fixed layout
  content = content.replace(/\|(.+)\|/g, (match, row) => {
    const cells = row
      .split("|")
      .map((cell: string) => cell.trim())
      .filter((cell: string) => cell)
    return `<tr>${cells.map((cell: string) => `<td class="px-3 py-2 align-top">${cell}</td>`).join("")}</tr>`
  })

  // Wrap tables
  content = content.replace(
    /(<tr>.*<\/tr>)/gs,
    '<table class="w-full table-fixed border-collapse border border-white/10 rounded-lg overflow-hidden my-4"><tbody>$1</tbody></table>',
  )

  // Convert markdown headers
  content = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
  content = content.replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-6 mb-3 text-white font-brand">$1</h3>')
  content = content.replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-6 mb-4 text-white font-brand">$1</h2>')
  content = content.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-6 mb-4 text-white font-brand">$1</h1>')

  // Convert bullet points
  content = content.replace(/^\* (.*$)/gm, '<li class="ml-4 mb-1">• $1</li>')
  content = content.replace(/(<li.*<\/li>)/gs, '<ul class="space-y-1 my-3">$1</ul>')

  // Convert line breaks
  content = content.replace(/\n\n/g, '</p><p class="mb-3">')
  content = `<p class="mb-3">${content}</p>`

  return content
}
