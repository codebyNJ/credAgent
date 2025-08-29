"use client"
import { Button } from "@/components/ui/button"
import type React from "react"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, Link, Folder, Mic, Send } from "lucide-react"
import { LiquidMetal, PulsingBorder } from "@paper-design/shaders-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { MessageFormatter } from "./message-formatter"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export function ChatInterface() {
  const [isFocused, setIsFocused] = useState(false)
  const [textValue, setTextValue] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!textValue.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: textValue,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setTextValue("")
    setLoading(true)

    try {
      console.log("Sending message:", userMessage.content)
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      })

      console.log("Response status:", res.status)
      console.log("Response headers:", Object.fromEntries(res.headers.entries()))

      let content = ""
      try {
        const data = await res.json()
        console.log("Response data:", data)
        content = JSON.stringify(data)
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError)
        const text = await res.text()
        console.log("Response text:", text)
        content = JSON.stringify({
          response: text,
          session_id: "",
          intent: "general",
          timestamp: new Date().toISOString(),
        })
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content,
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: JSON.stringify({
          response: "We hit a snag connecting to the server. Please try again.",
          session_id: "",
          intent: "error",
          timestamp: new Date().toISOString(),
        }),
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 sm:p-6 lg:p-8 w-full overflow-x-hidden">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl xl:max-w-2xl relative">
        {messages.length > 0 ? (
          <div className="mb-6 space-y-4 max-h-[65vh] sm:max-h-[70vh] overflow-y-auto overflow-x-hidden pr-2 -mr-2 scrollbar-none overscroll-contain">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] break-words formatted-content ${
                    message.role === "user"
                      ? "bg-amber-600/20 border-amber-500/40 text-amber-50 rounded-2xl p-4 border backdrop-blur-sm"
                      : "bg-transparent text-white p-0"
                  }`}
                >
                  <MessageFormatter content={message.content} isUser={message.role === "user"} />
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="text-xs text-zinc-400 italic">Crafting a response…</div>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row items-center sm:items-center mb-4 sm:mb-2 gap-3 sm:gap-0">
              <motion.div
                id="circle-ball"
                className="relative flex items-center justify-center z-10 flex-shrink-0"
                animate={{
                  y: isFocused ? 50 : 0,
                  opacity: isFocused ? 0 : 100,
                  filter: isFocused ? "blur(4px)" : "blur(0px)",
                  rotation: isFocused ? 180 : 0,
                }}
                transition={{
                  duration: 0.5,
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
              >
                <div className="z-10 absolute bg-white/5 h-9 w-9 rounded-full backdrop-blur-[3px]">
                  <div className="h-[2px] w-[2px] bg-white rounded-full absolute top-3 left-3  blur-[1px]" />
                  <div className="h-[2px] w-[2px] bg-white rounded-full absolute top-2 left-6  blur-[0.8px]" />
                  <div className="h-[2px] w-[2px] bg-white rounded-full absolute top-6 left-2  blur-[1px]" />
                  <div className="h-[2px] w-[2px] bg-white rounded-full absolute top-4 left-7 blur-[0.8px]" />
                  <div className="h-[2px] w-[2px] bg-white rounded-full absolute top-5 left-5  blur-[1px]" />
                </div>
                <LiquidMetal
                  style={{ height: 60, width: 60, filter: "blur(12px)", position: "absolute" }}
                  colorBack="hsl(0, 0%, 0%, 0)"
                  colorTint="hsl(29, 77%, 49%)"
                  repetition={4}
                  softness={0.5}
                  shiftRed={0.3}
                  shiftBlue={0.3}
                  distortion={0.1}
                  contour={1}
                  shape="circle"
                  offsetX={0}
                  offsetY={0}
                  scale={0.58}
                  rotation={50}
                  speed={5}
                />
                <LiquidMetal
                  style={{ height: 60, width: 60 }}
                  colorBack="hsl(0, 0%, 0%, 0)"
                  colorTint="hsl(29, 77%, 49%)"
                  repetition={4}
                  softness={0.5}
                  shiftRed={0.3}
                  shiftBlue={0.3}
                  distortion={0.1}
                  contour={1}
                  shape="circle"
                  offsetX={0}
                  offsetY={0}
                  scale={0.58}
                  rotation={50}
                  speed={5}
                />
              </motion.div>

              <motion.p
                className="text-white/40 text-sm sm:text-sm font-light z-10 text-center sm:text-left sm:ml-4 font-brand"
                style={{ fontFamily: "var(--font-cormorant)" }}
                animate={{
                  y: isFocused ? 50 : 0,
                  opacity: isFocused ? 0 : 100,
                  filter: isFocused ? "blur(4px)" : "blur(0px)",
                }}
                transition={{
                  duration: 0.5,
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
              >
                <em>Hey there!</em> I'm your credit intelligence companion –{" "}
                <em className="text-amber-300/60">let's make smart financial decisions together</em>
              </motion.p>
            </div>
          </>
        )}

        <div className="relative">
          <motion.div
            className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isFocused ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          >
            <PulsingBorder
              style={{ height: "100%", width: "100%" }}
              colorBack="hsl(0, 0%, 0%)"
              roundness={0.18}
              thickness={0}
              softness={0}
              intensity={0.3}
              bloom={2}
              spots={2}
              spotSize={0.25}
              pulse={0}
              smoke={0.35}
              smokeSize={0.4}
              scale={0.9}
              rotation={0}
              offsetX={0}
              offsetY={0}
              speed={1}
              colors={[
                "hsl(29, 70%, 37%)",
                "hsl(32, 100%, 83%)",
                "hsl(4, 32%, 30%)",
                "hsl(25, 60%, 50%)",
                "hsl(0, 100%, 10%)",
              ]}
            />
          </motion.div>

          <motion.div
            className="relative bg-[#040404] rounded-2xl p-3 sm:p-4 z-10 overflow-hidden"
            animate={{
              borderColor: isFocused ? "#BA9465" : "#3D3D3D",
            }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
            style={{
              borderWidth: "1px",
              borderStyle: "solid",
            }}
          >
            <div className="relative mb-4">
              <Textarea
                placeholder="What's on your financial mind? Ask about credit scores, loans, investments, or anything money-related..."
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                onKeyPress={handleKeyPress}
                aria-busy={loading}
                className={`resize-none bg-transparent border-none text-white text-base sm:text-lg placeholder:text-zinc-500 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none [&:focus]:ring-0 [&:focus]:outline-none [&:focus-visible]:ring-0 [&:focus-visible]:outline-none transition-all duration-300 ${
                  textValue.length > 100 ? "min-h-[120px]" : textValue.length > 50 ? "min-h-[80px]" : "min-h-[60px]"
                }`}
                style={{ fontFamily: "var(--font-cormorant)" }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={loading}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
              

              

              <div className="order-3">
                <Button
                  onClick={handleSend}
                  disabled={!textValue.trim() || loading}
                  size="sm"
                  className="h-7 px-3 bg-amber-600/20 hover:bg-amber-600/30 text-amber-200 border border-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-3 w-3 mr-1" />
                  {loading ? "Sending..." : "Send"}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
