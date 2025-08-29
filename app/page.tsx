"use client"
import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { ChatInterface } from "@/components/chat-interface"
import { ChatHeader } from "@/components/chat-header"
import { IntroScreen } from "@/components/intro-screen"

export default function Home() {
  const [showIntro, setShowIntro] = useState(true)

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <IntroScreen key="intro" onComplete={() => setShowIntro(false)} />
        ) : (
          <div key="chat" className="min-h-screen bg-black">
            <div className="pt-4 sm:pt-6 lg:pt-8">
              <ChatHeader />
              <ChatInterface />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
