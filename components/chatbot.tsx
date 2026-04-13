"use client"
import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello! I am Crop Dr.'s AI assistant. How can I help you with your agriculture needs today?" }
  ])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    
    setMessages(prev => [...prev, { role: "user", content: input }])
    const userMessage = input.toLowerCase()
    setInput("")

    setTimeout(() => {
      let botReply = "I am a helpful assistant. I recommend consulting an agronomist for severe crop issues."
      if (userMessage.includes("blight")) {
        botReply = "Blight is a fungal disease. Ensure proper spacing between plants and avoid overhead watering. Copper-based fungicides can help."
      } else if (userMessage.includes("yellow") || userMessage.includes("leaves")) {
        botReply = "Yellowing leaves can be a sign of nitrogen deficiency or overwatering. Check soil moisture and consider a balanced fertilizer."
      } else if (userMessage.includes("hello") || userMessage.includes("hi")) {
        botReply = "Hello there! How's your crop doing?"
      }
      setMessages(prev => [...prev, { role: "bot", content: botReply }])
    }, 1000)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-[#1B5E20] text-white shadow-lg shadow-green-900/30 hover:scale-110 hover:shadow-xl transition-all z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageCircle size={28} />
      </button>

      <div className={`fixed bottom-6 right-6 w-[350px] shadow-2xl rounded-2xl bg-white border border-gray-100 overflow-hidden transition-all duration-300 z-50 flex flex-col ${isOpen ? 'scale-100 opacity-100 h-[500px]' : 'scale-95 opacity-0 pointer-events-none h-0'}`}>
        <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Bot size={24} className="text-green-100" />
            <h3 className="font-bold tracking-wide">Crop Dr. AI</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-green-100 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-gray-50/50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'bot' && <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 shadow-sm"><Bot size={16} className="text-[#1B5E20]" /></div>}
              <div className={`p-3 rounded-2xl text-sm max-w-[80%] shadow-sm ${msg.role === 'user' ? 'bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] text-white rounded-br-sm' : 'bg-white border text-gray-800 rounded-bl-sm'}`}>
                {msg.content}
              </div>
              {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 shadow-sm"><User size={16} className="text-blue-600" /></div>}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-3 bg-white border-t flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..." 
            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/50 transition-all focus:bg-white"
          />
          <button type="submit" disabled={!input.trim()} className="bg-[#1B5E20] text-white p-2 rounded-full disabled:opacity-50 disabled:scale-100 hover:scale-105 transition-transform flex items-center justify-center shadow-md shadow-green-900/20">
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  )
}
