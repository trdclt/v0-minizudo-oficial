"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Message {
  id: string
  text: string
  sender: "user" | "agent"
  timestamp: Date
}

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAgentConnected, setIsAgentConnected] = useState(false)
  const [sessionId, setSessionId] = useState<string>("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const storedSessionId = localStorage.getItem("chat_session_id")
    if (storedSessionId) {
      setSessionId(storedSessionId)
      console.log("[v0] Restored session ID:", storedSessionId)
    } else {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
      setSessionId(newSessionId)
      localStorage.setItem("chat_session_id", newSessionId)
      console.log("[v0] Created new session ID:", newSessionId)
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const sendMessageToWebhook = async (message: string) => {
    try {
      console.log("[v0] Sending message to /api/chat")
      console.log("[v0] Message:", message)
      console.log("[v0] Session ID:", sessionId)

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          timestamp: new Date().toISOString(),
          sessionId: sessionId,
        }),
      })

      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response ok:", response.ok)

      if (!response.ok) {
        console.error("[v0] Response not ok, status:", response.status)
        const errorText = await response.text().catch(() => "Unknown error")
        throw new Error(`Failed to send message: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log("[v0] Response data:", data)

      return data.response || "Desculpe, não consegui processar sua mensagem."
    } catch (error) {
      console.error("[v0] Error sending message:", error instanceof Error ? error.message : String(error))
      return "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente."
    }
  }

  const calculateTypingDuration = (messageLength: number): number => {
    const baseDuration = messageLength * 50
    const duration = Math.min(15000, Math.max(2000, baseDuration))
    return duration
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    if (!isAgentConnected) {
      setTimeout(() => {
        const connectionMessage: Message = {
          id: `agent_connection_${Date.now()}`,
          text: "Gabrielle se conectou ao chat ao vivo",
          sender: "agent",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, connectionMessage])
        setIsAgentConnected(true)
      }, 500)
    }

    const agentResponse = await sendMessageToWebhook(userMessage.text)

    const delayBeforeTyping = Math.floor(Math.random() * 5000) + 3000

    setTimeout(() => {
      setIsLoading(true)

      const typingDuration = calculateTypingDuration(agentResponse.length)

      setTimeout(() => {
        const agentMessage: Message = {
          id: `agent_${Date.now()}`,
          text: agentResponse,
          sender: "agent",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, agentMessage])
        setIsLoading(false)
      }, typingDuration)
    }, delayBeforeTyping)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 z-50 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Abrir chat"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </button>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {isOpen && (
        <Card className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-6 z-50 w-auto sm:w-80 h-[500px] sm:h-[350px] max-h-[85vh] flex flex-col shadow-2xl border-0 overflow-hidden rounded-lg">
          <div className="bg-[#075E54] text-white p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                <span className="text-[#075E54] font-semibold text-lg">G</span>
              </div>
              <div>
                <h3 className="font-medium text-[15px]">Gabrielle</h3>
                <p className="text-xs text-gray-200">{isAgentConnected ? "online" : "offline"}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-[#128C7E] rounded-full p-1.5 transition-colors"
              aria-label="Fechar chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#E5DDD5]">
            {messages.length === 0 && (
              <div className="text-center text-gray-600 text-sm mt-8 bg-white/80 rounded-lg p-4 mx-auto max-w-[80%]">
                <p>Olá! Como posso ajudar você hoje?</p>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-lg px-3 py-2 shadow-sm ${
                    message.sender === "user"
                      ? "bg-[#DCF8C6] text-gray-800"
                      : message.text === "Gabrielle se conectou ao chat ao vivo"
                        ? "bg-[#FFF4CE] text-gray-700 text-center w-full text-xs py-1.5"
                        : "bg-white text-gray-800"
                  }`}
                  style={{
                    borderRadius: message.sender === "user" ? "7.5px 7.5px 0px 7.5px" : "7.5px 7.5px 7.5px 0px",
                  }}
                >
                  <p className="text-[14px] leading-relaxed break-words">{message.text}</p>
                  <p
                    className={`text-[11px] mt-1 text-right ${message.sender === "user" ? "text-gray-600" : "text-gray-500"}`}
                  >
                    {message.timestamp.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div
                  className="bg-white rounded-lg px-4 py-3 shadow-sm"
                  style={{ borderRadius: "7.5px 7.5px 7.5px 0px" }}
                >
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-2 bg-[#F0F0F0] border-t border-gray-200">
            <div className="flex gap-2 items-center">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Mensagem"
                className="flex-1 px-4 py-2.5 border-0 rounded-full focus:outline-none bg-white text-base"
                style={{ fontSize: "16px" }}
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full w-10 h-10 p-0 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  )
}
