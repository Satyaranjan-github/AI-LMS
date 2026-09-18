"use client"

import { Bookmark, FileText, HelpCircle, Layers, Trash2 } from "lucide-react"
import { useState } from "react"
import { Button } from "../../../components/ui/button"

export default function BookmarksPage() {
    const [savedItems, setSavedItems] = useState([
        {
            id: 1,
            title: "What is the difference between Synchronous and Asynchronous execution?",
            type: "Flashcard",
            course: "JavaScript Deep Dive",
            snippet: "Synchronous blocks execution until task finishes; Asynchronous delegates tasks and continues executing instructions.",
            icon: Layers,
            color: "text-indigo-600 bg-indigo-50"
        },
        {
            id: 2,
            title: "Explain the ACID properties in SQL databases",
            type: "Question/Answer",
            course: "Database Systems",
            snippet: "Atomicity, Consistency, Isolation, and Durability ensure reliable transaction processing.",
            icon: HelpCircle,
            color: "text-blue-600 bg-blue-50"
        },
        {
            id: 3,
            title: "Chapter 3 Summary: Array Methods & Functional Patterns",
            type: "Notes",
            course: "Modern Web Architecture",
            snippet: "Map, filter, and reduce allow non-mutating data transformations adhering to functional principles.",
            icon: FileText,
            color: "text-purple-600 bg-purple-50"
        }
    ])

    const handleDelete = (id) => {
        setSavedItems((prev) => prev.filter((item) => item.id !== id))
    }

    return (
        <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-medium">
                    <Bookmark className="size-3.5" />
                    <span>Saved Repository</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Saved & Bookmarks</h1>
                <p className="text-indigo-100 text-xs sm:text-sm max-w-lg">
                    Quickly review bookmarked notes, flashcard concepts, and key Q&A pairs.
                </p>
            </div>

            {/* Bookmarks List */}
            {savedItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <div
                                key={item.id}
                                className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                                            {item.course}
                                        </span>
                                        <div className={`p-2 rounded-xl ${item.color}`}>
                                            <Icon className="size-4" />
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                                        {item.title}
                                    </h3>

                                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        {item.snippet}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                    <span className="text-xs font-medium text-slate-500">{item.type}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(item.id)}
                                        className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl p-2 cursor-pointer transition-colors"
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center py-16 bg-white border border-slate-200/80 rounded-3xl p-8 space-y-4">
                    <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600 inline-block">
                        <Bookmark className="size-8" />
                    </div>
                    <h3 className="font-bold text-xl text-slate-900">No Bookmarks Saved Yet</h3>
                    <p className="text-slate-500 text-xs sm:text-sm max-w-sm mx-auto">
                        While reviewing flashcards, notes, or Q&A sets, click the bookmark icon to save items here for fast revision!
                    </p>
                </div>
            )}
        </div>
    )
}
