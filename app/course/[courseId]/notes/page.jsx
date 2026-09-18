"use client"

import axios from "axios"
import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    Check,
    CheckCircle2,
    Copy,
    HelpCircle,
    Layers,
    ListFilter,
    Maximize2,
    Minimize2,
    Search,
    Sparkles,
    X
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { Button } from "../../../../components/ui/button"

function ViewNotes() {
    const { courseId } = useParams()
    const router = useRouter()

    const [notes, setNotes] = useState([])
    const [course, setCourse] = useState(null)
    const [stepCount, setStepCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [completedChapters, setCompletedChapters] = useState([])
    const [fontSize, setFontSize] = useState("base") // sm, base, lg, xl
    const [focusMode, setFocusMode] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    // Load completed chapters from localStorage
    useEffect(() => {
        if (!courseId) return
        try {
            const saved = localStorage.getItem(`notes_completed_${courseId}`)
            if (saved) {
                setCompletedChapters(JSON.parse(saved))
            }
        } catch (e) {
            console.error("Failed to load progress:", e)
        }
    }, [courseId])

    // Save completed chapters to localStorage
    const toggleChapterCompleted = (index) => {
        setCompletedChapters((prev) => {
            const next = prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
            try {
                localStorage.setItem(`notes_completed_${courseId}`, JSON.stringify(next))
            } catch (e) {
                console.error("Failed to save progress:", e)
            }
            return next
        })
    }

    // Fetch Notes & Course Info
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const [notesRes, courseRes] = await Promise.all([
                    axios.post("/api/study-type", {
                        courseId: courseId,
                        studyType: "notes"
                    }),
                    axios.get(`/api/courses?courseId=${courseId}`)
                ])

                const sortedNotes = (notesRes.data || []).sort((a, b) => (a.chapterId ?? 0) - (b.chapterId ?? 0))
                setNotes(sortedNotes)
                setCourse(courseRes.data?.result || null)
            } catch (err) {
                console.error("Failed to fetch notes:", err)
                toast.error("Could not load chapter notes.")
            } finally {
                setLoading(false)
            }
        }

        if (courseId) {
            fetchData()
        }
    }, [courseId])

    const chaptersList = useMemo(() => {
        return course?.courseLayout?.chapters || []
    }, [course])

    const currentChapterInfo = chaptersList[stepCount] || null
    const currentNoteContent = notes[stepCount]?.notes || ""

    // Calculate reading time
    const readingTimeMinutes = useMemo(() => {
        if (!currentNoteContent) return 1
        const words = currentNoteContent.replace(/<[^>]*>?/gm, "").split(/\s+/).length
        return Math.max(1, Math.round(words / 180))
    }, [currentNoteContent])

    // Font size classes
    const fontSizeClass = {
        sm: "text-sm leading-relaxed",
        base: "text-base leading-relaxed",
        lg: "text-lg leading-loose",
        xl: "text-xl leading-loose"
    }[fontSize]

    const progressPercentage = chaptersList.length > 0
        ? Math.round((completedChapters.length / chaptersList.length) * 100)
        : 0

    // Filtered chapters for search
    const filteredChapters = useMemo(() => {
        if (!searchQuery.trim()) return chaptersList
        return chaptersList.filter((ch) =>
            ch.chapterTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ch.chapterSummary?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [chaptersList, searchQuery])

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="h-10 bg-slate-200/80 rounded-xl animate-pulse mb-8 w-1/3" />
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="hidden lg:block lg:col-span-1 h-[650px] bg-slate-200/70 rounded-2xl animate-pulse" />
                    <div className="lg:col-span-3 h-[650px] bg-slate-200/70 rounded-2xl animate-pulse" />
                </div>
            </div>
        )
    }

    if (!notes || notes.length === 0) {
        return (
            <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 text-center">
                <div className="size-20 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-sm">
                    <BookOpen className="size-10" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">No Chapter Notes Found</h2>
                <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
                    Notes for this course are still generating or have not been created yet.
                </p>
                <Button onClick={() => router.push(`/course/${courseId}`)} className="cursor-pointer">
                    Back to Course Overview
                </Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50/70 text-slate-800 pb-16">
            {/* Sticky Reading Navigation Toolbar */}
            <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 py-3 shadow-2xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
                    {/* Left: Back Link & Course Title */}
                    <div className="flex items-center gap-3 min-w-0">
                        <Link href={`/course/${courseId}`}>
                            <Button variant="ghost" size="sm" className="gap-2 shrink-0 cursor-pointer font-medium hover:bg-slate-100/80">
                                <ArrowLeft className="size-4" />
                                <span className="hidden sm:inline text-xs">Course Overview</span>
                            </Button>
                        </Link>
                        <div className="h-4 w-px bg-slate-300/60 hidden sm:block shrink-0" />
                        <div className="min-w-0">
                            <h1 className="text-sm font-bold truncate max-w-[200px] sm:max-w-[400px] md:max-w-[600px] text-slate-900">
                                {course?.courseLayout?.courseTitle || "Course Notes"}
                            </h1>
                            <p className="text-[11px] text-slate-500 hidden md:block">
                                Chapter {stepCount + 1} of {notes.length} • {readingTimeMinutes} min read
                            </p>
                        </div>
                    </div>

                    {/* Right: Reading Controls & Toolbar */}
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                        {/* Mobile Chapter Drawer Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden gap-1.5 text-xs font-medium rounded-xl cursor-pointer"
                        >
                            <ListFilter className="size-3.5" />
                            <span>Index</span>
                        </Button>

                        {/* Font Size Selector */}
                        <div className="hidden sm:flex items-center border border-slate-200/80 rounded-xl p-0.5 bg-slate-100/70">
                            <button
                                onClick={() => setFontSize("sm")}
                                className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${fontSize === "sm" ? "bg-white text-indigo-600 shadow-2xs" : "text-slate-500 hover:text-slate-900"
                                    }`}
                                title="Small Text"
                            >
                                A-
                            </button>
                            <button
                                onClick={() => setFontSize("base")}
                                className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${fontSize === "base" ? "bg-white text-indigo-600 shadow-2xs" : "text-slate-500 hover:text-slate-900"
                                    }`}
                                title="Default Text"
                            >
                                A
                            </button>
                            <button
                                onClick={() => setFontSize("lg")}
                                className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${fontSize === "lg" ? "bg-white text-indigo-600 shadow-2xs" : "text-slate-500 hover:text-slate-900"
                                    }`}
                                title="Large Text"
                            >
                                A+
                            </button>
                        </div>
                        {/* Focus / Distraction-Free Mode */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setFocusMode(!focusMode)}
                            className={`size-8 p-0 rounded-xl cursor-pointer transition-all ${focusMode ? "bg-indigo-500/20 text-indigo-600" : ""

                                }`}
                            title={focusMode ? "Exit Focus Mode" : "Focus Mode"}
                        >
                            {focusMode ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
                        </Button>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-200/40">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                        style={{ width: `${((stepCount + 1) / notes.length) * 100}%` }}
                    />
                </div>
            </header>

            {/* Main Content Layout */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                    {/* Desktop Chapter Index Sidebar */}
                    {!focusMode && (
                        <aside className="hidden lg:block lg:col-span-1 border border-slate-200/90 bg-white text-slate-900 rounded-2xl p-5 shadow-xs sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
                            <div className="mb-4 pb-3 border-b border-slate-200/60">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="font-bold text-sm flex items-center gap-2">
                                        <BookOpen className="size-4 text-indigo-600" />
                                        <span>Curriculum</span>
                                    </h2>
                                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                                        {completedChapters.length}/{chaptersList.length} Done
                                    </span>
                                </div>

                                {/* Completion Progress Bar */}
                                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-3">
                                    <div
                                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                                        style={{ width: `${progressPercentage}%` }}
                                    />
                                </div>
                            </div>
                            {/* Chapter List */}
                            <div className="space-y-1.5">
                                {filteredChapters.map((chapter, index) => {
                                    const actualIndex = chaptersList.findIndex((c) => c.chapterNumber === chapter.chapterNumber)
                                    const targetIndex = actualIndex === -1 ? index : actualIndex
                                    const isCurrent = targetIndex === stepCount
                                    const isDone = completedChapters.includes(targetIndex)

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                if (targetIndex < notes.length) {
                                                    setStepCount(targetIndex)
                                                    window.scrollTo({ top: 0, behavior: "smooth" })
                                                }
                                            }}
                                            className={`w-full text-left p-3 rounded-xl text-xs font-medium transition-all duration-200 flex items-start gap-3 cursor-pointer group relative overflow-hidden ${isCurrent
                                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                                                : "hover:bg-indigo-50/50 opacity-90 hover:opacity-100"
                                                }`}
                                        >
                                            <span className="text-base shrink-0 mt-0.5">
                                                {chapter.emojiIcon || chapter.emoji || "📖"}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-1">
                                                    <span className={`text-[10px] uppercase font-bold tracking-wider ${isCurrent ? "text-white/80" : "text-slate-400"}`}>
                                                        Ch {chapter.chapterNumber || targetIndex + 1}
                                                    </span>
                                                    {isDone && (
                                                        <CheckCircle2 className={`size-3.5 shrink-0 ${isCurrent ? "text-white" : "text-emerald-500"}`} />
                                                    )}
                                                </div>
                                                <p className={`line-clamp-2 mt-0.5 ${isCurrent ? "text-white font-semibold" : "font-medium text-slate-800"}`}>
                                                    {chapter.chapterTitle}
                                                </p>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </aside>
                    )}

                    {/* Mobile Drawer Navigation */}
                    {sidebarOpen && (
                        <div className="fixed inset-0 z-50 lg:hidden flex">
                            <div
                                className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
                                onClick={() => setSidebarOpen(false)}
                            />
                            <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="size-5 text-indigo-600" />
                                            <h3 className="font-bold text-slate-900 text-sm">Course Curriculum</h3>
                                        </div>
                                        <button
                                            onClick={() => setSidebarOpen(false)}
                                            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                                        >
                                            <X className="size-5" />
                                        </button>
                                    </div>

                                    <div className="space-y-1.5">
                                        {chaptersList.map((chapter, index) => {
                                            const isCurrent = index === stepCount
                                            const isDone = completedChapters.includes(index)

                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => {
                                                        if (index < notes.length) {
                                                            setStepCount(index)
                                                            setSidebarOpen(false)
                                                            window.scrollTo({ top: 0, behavior: "smooth" })
                                                        }
                                                    }}
                                                    className={`w-full text-left p-3 rounded-xl text-xs font-medium transition-all flex items-start gap-3 ${isCurrent
                                                        ? "bg-indigo-600 text-white shadow-xs"
                                                        : "text-slate-700 hover:bg-slate-100"
                                                        }`}
                                                >
                                                    <span className="text-lg shrink-0">{chapter.emojiIcon || chapter.emoji || "📖"}</span>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between">
                                                            <span className={`text-[10px] uppercase font-semibold ${isCurrent ? "text-white/80" : "text-slate-400"}`}>
                                                                Chapter {index + 1}
                                                            </span>
                                                            {isDone && (
                                                                <CheckCircle2 className={`size-4 ${isCurrent ? "text-white" : "text-emerald-500"}`} />
                                                            )}
                                                        </div>
                                                        <p className="line-clamp-2 mt-0.5 font-medium">{chapter.chapterTitle}</p>
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div className="pt-4 mt-6 border-t border-slate-100">
                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <span>Progress: {progressPercentage}%</span>
                                        <span>{completedChapters.length} of {chaptersList.length} read</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Reading Canvas */}
                    <div className={`${focusMode ? "lg:col-span-4" : "lg:col-span-3"} w-full space-y-6`}>
                        {/* Chapter Hero Header Card */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 sm:p-8 shadow-xl border border-indigo-400/30">
                            {/* Ambient Glows */}
                            <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />


                            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-md p-3 flex items-center justify-center text-3xl shadow-inner shrink-0">
                                        {currentChapterInfo?.emojiIcon || currentChapterInfo?.emoji || "📖"}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold uppercase tracking-wide">
                                                Chapter {stepCount + 1} of {notes.length}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                ⏱️ {readingTimeMinutes} min read
                                            </span>
                                        </div>
                                        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight">
                                            {currentChapterInfo?.chapterTitle || `Chapter ${stepCount + 1}`}
                                        </h2>
                                        {currentChapterInfo?.chapterSummary && (
                                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl pt-1">
                                                {currentChapterInfo.chapterSummary}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Complete Chapter Action */}
                                <Button
                                    size="sm"
                                    onClick={() => toggleChapterCompleted(stepCount)}
                                    className={`gap-2 shrink-0 text-xs font-semibold cursor-pointer self-start sm:self-center transition-all duration-300 rounded-xl px-4 py-2 ${completedChapters.includes(stepCount)
                                        ? "bg-emerald-500 hover:bg-emerald-600 text-white border border-emerald-400/30 shadow-md shadow-emerald-500/20"
                                        : "bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md shadow-xs hover:shadow-md"
                                        }`}
                                >
                                    <Check className={`size-3.5 transition-transform duration-300 ${completedChapters.includes(stepCount) ? "scale-110 text-white" : "text-slate-300"}`} />
                                    <span>{completedChapters.includes(stepCount) ? "Completed" : "Mark as Read"}</span>
                                </Button>
                            </div>
                        </div>

                        {/* Rendered HTML Note Document */}
                        <article className="rounded-2xl p-6 sm:p-10 border bg-white border-slate-200/90 shadow-sm text-slate-800">
                            <div
                                className={`notes-content ${fontSizeClass}`}
                                dangerouslySetInnerHTML={{ __html: currentNoteContent }}
                            />
                        </article>

                        {/* Bottom Chapter Pagination Card */}
                        <div className="rounded-2xl p-5 border bg-white border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                            {/* Previous Chapter Button */}
                            {stepCount > 0 ? (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setStepCount(stepCount - 1)
                                        window.scrollTo({ top: 0, behavior: "smooth" })
                                    }}
                                    className="w-full sm:w-auto gap-3.5 text-xs font-medium cursor-pointer py-5 hover:border-indigo-300"
                                >
                                    <ArrowLeft className="size-4 text-indigo-600" />
                                    <div className="text-left">
                                        <div className="text-[10px] uppercase font-bold text-slate-400">Previous Chapter</div>
                                        <span className="line-clamp-1 max-w-[180px] font-semibold text-slate-800">
                                            {chaptersList[stepCount - 1]?.chapterTitle || `Chapter ${stepCount}`}
                                        </span>
                                    </div>
                                </Button>
                            ) : (
                                <div className="hidden sm:block" />
                            )}

                            {/* Mark As Read Checkbox Action */}
                            <button
                                onClick={() => toggleChapterCompleted(stepCount)}
                                className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-2 cursor-pointer transition-colors"
                            >
                                <span className={`size-5 rounded-full border flex items-center justify-center transition-all ${completedChapters.includes(stepCount) ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300"
                                    }`}>
                                    {completedChapters.includes(stepCount) && <Check className="size-3.5 stroke-[3]" />}
                                </span>
                                {completedChapters.includes(stepCount) ? "Chapter Completed" : "Mark Chapter as Completed"}
                            </button>

                            {/* Next Chapter Button */}
                            {stepCount < notes.length - 1 ? (
                                <Button
                                    onClick={() => {
                                        if (!completedChapters.includes(stepCount)) {
                                            toggleChapterCompleted(stepCount)
                                        }
                                        setStepCount(stepCount + 1)
                                        window.scrollTo({ top: 0, behavior: "smooth" })
                                    }}
                                    className="w-full sm:w-auto gap-3.5 text-xs font-medium cursor-pointer py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md"
                                >
                                    <div className="text-right">
                                        <div className="text-[10px] uppercase font-bold text-white/80">Next Chapter</div>
                                        <span className="line-clamp-1 max-w-[180px] font-semibold text-white">
                                            {chaptersList[stepCount + 1]?.chapterTitle || `Chapter ${stepCount + 2}`}
                                        </span>
                                    </div>
                                    <ArrowRight className="size-4" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => {
                                        if (!completedChapters.includes(stepCount)) {
                                            toggleChapterCompleted(stepCount)
                                        }
                                    }}
                                    className="w-full sm:w-auto gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-5 cursor-pointer shadow-md"
                                >
                                    <Check className="size-4" /> Finished Course Notes
                                </Button>
                            )}
                        </div>

                        {/* Completion Celebration Card */}
                        {stepCount === notes.length - 1 && (
                            <div className="mt-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl p-6 sm:p-8 text-center shadow-xl border border-indigo-400/30">
                                <div className="inline-flex p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-indigo-400 mb-3">

                                    <Sparkles className="size-7 text-amber-400 animate-pulse" />
                                </div>
                                <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
                                    You've Completed All Chapter Notes! 🎉
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mb-6 leading-relaxed">
                                    Test your memory with interactive Flashcards or take the practice Quiz to lock in your knowledge.
                                </p>

                                <div className="flex flex-wrap items-center justify-center gap-3">
                                    <Link href={`/course/${courseId}/flashCard`}>
                                        <Button size="sm" className="gap-2 text-xs font-bold bg-white text-indigo-900 hover:bg-slate-100 cursor-pointer shadow-md">
                                            <Layers className="size-4 text-indigo-600" />
                                            Practice Flashcards
                                        </Button>
                                    </Link>
                                    <Link href={`/course/${courseId}/quiz`}>
                                        <Button size="sm" className="gap-2 text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-600 cursor-pointer shadow-md">
                                            <HelpCircle className="size-4 text-white" />
                                            Take Chapter Quiz
                                        </Button>
                                    </Link>
                                    <Link href={`/course/${courseId}`}>
                                        <Button size="sm" variant="outline" className="gap-2 text-xs font-semibold border-white/30 text-white hover:bg-white/10 cursor-pointer">
                                            Course Home
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main >

            {/* Custom Styles for Rendered Notes Content */}
            < style jsx global > {`
                .notes-content h2 {
                    font-size: 1.5rem;
                    font-weight: 800;
                    letter-spacing: -0.025em;
                    margin-top: 2rem;
                    margin-bottom: 0.85rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid currentColor;
                    opacity: 0.95;
                }
                .notes-content h3 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin-top: 1.6rem;
                    margin-bottom: 0.6rem;
                    opacity: 0.9;
                }
                .notes-content h4 {
                    font-size: 1.05rem;
                    font-weight: 600;
                    margin-top: 1.3rem;
                    margin-bottom: 0.5rem;
                    opacity: 0.85;
                }
                .notes-content p {
                    margin-bottom: 1.1rem;
                    line-height: 1.75;
                    opacity: 0.9;
                }
                .notes-content ul {
                    list-style-type: disc;
                    padding-left: 1.6rem;
                    margin-top: 0.5rem;
                    margin-bottom: 1.2rem;
                }
                .notes-content ol {
                    list-style-type: decimal;
                    padding-left: 1.6rem;
                    margin-top: 0.5rem;
                    margin-bottom: 1.2rem;
                }
                .notes-content li {
                    margin-bottom: 0.4rem;
                    line-height: 1.65;
                }
                .notes-content li > ul,
                .notes-content li > ol {
                    margin-top: 0.25rem;
                    margin-bottom: 0.25rem;
                }
                .notes-content strong {
                    font-weight: 700;
                    opacity: 1;
                }
                .notes-content code {
                    background-color: rgba(99, 102, 241, 0.1);
                    color: inherit;
                    padding: 0.2rem 0.4rem;
                    border-radius: 0.375rem;
                    font-size: 0.875em;
                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                    border: 1px solid rgba(99, 102, 241, 0.2);
                }
                .notes-content pre {
                    background-color: #0f172a;
                    color: #f8fafc;
                    padding: 1.2rem;
                    border-radius: 0.85rem;
                    overflow-x: auto;
                    margin-top: 1.2rem;
                    margin-bottom: 1.2rem;
                    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
                }
                .notes-content pre code {
                    background-color: transparent;
                    color: inherit;
                    padding: 0;
                    border: none;
                }
                .notes-content blockquote {
                    border-left: 4px solid #6366f1;
                    padding-left: 1.25rem;
                    margin-top: 1.2rem;
                    margin-bottom: 1.2rem;
                    font-style: italic;
                    background: rgba(99, 102, 241, 0.05);
                    padding-top: 0.6rem;
                    padding-bottom: 0.6rem;
                    border-radius: 0 0.5rem 0.5rem 0;
                }
                .notes-content table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 1.2rem;
                    margin-bottom: 1.2rem;
                    border-radius: 0.5rem;
                    overflow: hidden;
                }
                .notes-content th,
                .notes-content td {
                    border: 1px solid rgba(148, 163, 184, 0.3);
                    padding: 0.65rem 0.85rem;
                    text-align: left;
                }
                .notes-content th {
                    background-color: rgba(148, 163, 184, 0.15);
                    font-weight: 700;
                }
            `}</style >
        </div >
    )
}

export default ViewNotes
