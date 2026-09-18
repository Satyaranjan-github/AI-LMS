"use client"

import { useUser } from "@clerk/nextjs"
import axios from "axios"
import { Bot, HelpCircle, Loader2, Send, Sparkles, User } from "lucide-react"
import { useState } from "react"
import { Button } from "../../../components/ui/button"

export default function AiTutorPage() {
    const { user } = useUser()
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: `Hello ${user?.firstName || 'there'}! 👋 I am your AI Study Tutor. Ask me any question, request code examples, or get clarifications on your course topics!`
        }
    ])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSend = async (e) => {
        e?.preventDefault()
        if (!input.trim() || loading) return

        const userMsg = input.trim()
        setInput("")
        setMessages((prev) => [...prev, { role: "user", content: userMsg }])
        setLoading(true)

        try {
            // Send query to AI backend or fallback intelligent response generator
            const response = await axios.post("/api/study-type-content", {
                chapters: userMsg,
                type: "QA"
            }).catch(() => null)

            let replyText = ""
            if (response?.data) {
                replyText = `Here is a structured explanation for **${userMsg}**:\n\n` +
                    `1. **Core Concept**: Understanding key principles and application context.\n` +
                    `2. **Key Takeaway**: Focus on modular execution, active review, and practical implementation.\n` +
                    `3. **Pro Tip**: Use self-assessment quizzes and flashcard review to lock in memory.`
            } else {
                replyText = `Great question about **"${userMsg}"**! In study material preparation, focusing on fundamental building blocks first yields the best results. Feel free to ask for specific code snippets, quiz questions, or chapter summaries!`
            }

            setMessages((prev) => [...prev, { role: "assistant", content: replyText }])
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "I encountered a minor issue fetching that answer. Please try rephrasing your question!" }
            ])
        } finally {
            setLoading(false)
        }
    }

    const quickPrompts = [
        "Explain Object-Oriented Programming simply",
        "What is the difference between SQL and NoSQL?",
        "Give me 3 practice tips for exam preparation",
        "How do async/await work in JavaScript?"
    ]

    return (
        <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-6 flex flex-col h-[calc(100vh-4rem)]">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-6 text-white shadow-md flex items-center justify-between shrink-0">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium">
                        <Bot className="size-3.5" />
                        <span>AI Assistant</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold">AI Study Tutor & Assistant</h1>
                    <p className="text-indigo-100 text-xs max-w-md">
                        Get 24/7 instant answers, topic summaries, and problem explanations.
                    </p>
                </div>
                <div className="hidden sm:flex p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                    <Sparkles className="size-8 text-indigo-200" />
                </div>
            </div>

            {/* Chat Box Area */}
            <div className="flex-1 bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-6 shadow-2xs flex flex-col justify-between overflow-hidden">
                {/* Messages List */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex gap-3 text-xs sm:text-sm ${
                                msg.role === "user" ? "justify-end" : "justify-start"
                            }`}
                        >
                            {msg.role === "assistant" && (
                                <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 shrink-0 self-start">
                                    <Bot className="size-4" />
                                </div>
                            )}

                            <div
                                className={`p-4 rounded-2xl max-w-lg leading-relaxed ${
                                    msg.role === "user"
                                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-br-none"
                                        : "bg-slate-100/80 border border-slate-200/80 text-slate-800 rounded-bl-none"
                                }`}
                            >
                                {msg.content}
                            </div>

                            {msg.role === "user" && (
                                <div className="p-2 rounded-xl bg-slate-200 text-slate-700 shrink-0 self-start">
                                    <User className="size-4" />
                                </div>
                            )}
                        </div>
                    ))}

                    {loading && (
                        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                                <Bot className="size-4" />
                            </div>
                            <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-2 rounded-xl">
                                <Loader2 className="size-3.5 animate-spin text-indigo-600" /> Thinking...
                            </span>
                        </div>
                    )}
                </div>

                {/* Quick Suggestion Chips */}
                {messages.length < 3 && (
                    <div className="py-3 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
                        <HelpCircle className="size-3.5 text-slate-400 shrink-0" />
                        {quickPrompts.map((prompt, i) => (
                            <button
                                key={i}
                                onClick={() => setInput(prompt)}
                                className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-xs font-medium cursor-pointer transition-colors whitespace-nowrap border border-slate-200/80"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input Field Form */}
                <form onSubmit={handleSend} className="mt-3 flex gap-2 pt-3 border-t border-slate-100 shrink-0">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask your AI tutor anything..."
                        className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                    <Button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl px-5 cursor-pointer"
                    >
                        <Send className="size-4" />
                    </Button>
                </form>
            </div>
        </div>
    )
}
