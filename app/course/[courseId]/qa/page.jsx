"use client"

import axios from "axios"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import {
    ArrowLeft,
    Check,
    ChevronDown,
    ChevronRight,
    Copy,
    HelpCircle,
    Layers,
    LayoutDashboard,
    MessageSquare,
    RefreshCcw,
    Search,
    Sparkles
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "../../../../components/ui/button"

function QAPage() {
    const { courseId } = useParams()
    const router = useRouter()

    const [qaRecord, setQaRecord] = useState(null)
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [viewMode, setViewMode] = useState("accordion") // 'accordion' vs 'cards'
    const [searchQuery, setSearchQuery] = useState("")
    const [openIndex, setOpenIndex] = useState(0) // currently open accordion
    const [copiedIndex, setCopiedIndex] = useState(null)

    const GetQA = async (showLoading = true) => {
        if (showLoading) setLoading(true)
        try {
            const result = await axios.post("/api/study-type", {
                courseId: courseId,
                studyType: "QA"
            })
            setQaRecord(result?.data || null)
        } catch (error) {
            console.error("Error fetching QA content:", error)
            toast.error("Failed to load Q&A material")
        } finally {
            if (showLoading) setLoading(false)
        }
    }

    useEffect(() => {
        if (courseId) GetQA()
    }, [courseId])

    // Poll if status is generating
    useEffect(() => {
        if (qaRecord?.status === "Generating") {
            const interval = setInterval(() => {
                GetQA(false)
            }, 3000)
            return () => clearInterval(interval)
        }
    }, [qaRecord?.status])

    // Parse QA items array from DB record
    const qaList = useMemo(() => {
        if (!qaRecord) return []
        let rawContent = qaRecord.content

        if (typeof rawContent === "string") {
            try {
                const clean = rawContent.replace(/```json/gi, "").replace(/```/g, "").trim()
                rawContent = JSON.parse(clean)
            } catch (e) {
                console.error("Failed to parse QA JSON string:", e)
            }
        }

        let rawList = []
        if (Array.isArray(rawContent)) {
            rawList = rawContent
        } else if (rawContent && typeof rawContent === "object") {
            if (Array.isArray(rawContent.questions)) rawList = rawContent.questions
            else if (Array.isArray(rawContent.content)) rawList = rawContent.content
            else if (Array.isArray(rawContent.items)) rawList = rawContent.items
            else if (Array.isArray(rawContent.qa)) rawList = rawContent.qa
        }

        return rawList.map((item, idx) => ({
            question: item?.question || item?.q || item?.front || `Question ${idx + 1}`,
            answer: item?.answer || item?.a || item?.back || "Answer detail not provided."
        }))
    }, [qaRecord])

    const filteredQAList = useMemo(() => {
        if (!searchQuery.trim()) return qaList
        const q = searchQuery.toLowerCase()
        return qaList.filter(
            (item) => item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q)
        )
    }, [qaList, searchQuery])

    const handleGenerateQA = async () => {
        setGenerating(true)
        toast("Generating AI Q&A material...")

        try {
            const courseRes = await axios.get(`/api/courses?courseId=${courseId}`)
            const course = courseRes.data?.result
            let chapters = ""
            course?.courseLayout?.chapters?.forEach((ch) => {
                chapters += (ch.chapterTitle || "") + ", "
            })

            await axios.post("/api/study-type-content", {
                courseId: courseId,
                type: "QA",
                chapters: chapters || "Core course concepts"
            })

            await GetQA(false)
            toast.success("Q&A material ready!")
        } catch (err) {
            console.error("Failed to generate QA:", err)
            toast.error("Failed to trigger Q&A generation.")
        } finally {
            setGenerating(false)
        }
    }

    const handleCopy = (text, index) => {
        navigator.clipboard.writeText(text)
        setCopiedIndex(index)
        toast.success("Copied to clipboard!")
        setTimeout(() => setCopiedIndex(null), 2000)
    }

    return (
        <div className="min-h-screen bg-slate-50/70 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] pb-16">
            {/* Sticky Glassmorphic Header */}
            <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
                    {/* Breadcrumbs */}
                    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 overflow-hidden">
                        <Link href="/dashboard" className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-100 text-slate-600 font-medium transition-colors shrink-0">
                            <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                            <span>Dashboard</span>
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        <Link href={`/course/${courseId}`} className="hover:bg-slate-100 px-2 py-1 rounded-lg text-slate-600 font-medium shrink-0 transition-colors">
                            Course
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        <span className="font-semibold text-slate-900 truncate">Q&A Sets</span>
                    </nav>

                    {/* View Switcher & Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                        {qaList.length > 0 && (
                            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                                <button
                                    onClick={() => setViewMode("accordion")}
                                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                                        viewMode === "accordion"
                                            ? "bg-white text-indigo-600 shadow-2xs"
                                            : "text-slate-600 hover:text-slate-900"
                                    }`}
                                >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Accordion View</span>
                                </button>
                                <button
                                    onClick={() => setViewMode("cards")}
                                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                                        viewMode === "cards"
                                            ? "bg-white text-indigo-600 shadow-2xs"
                                            : "text-slate-600 hover:text-slate-900"
                                    }`}
                                >
                                    <Layers className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Card Grid</span>
                                </button>
                            </div>
                        )}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.back()}
                            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 rounded-xl border-slate-200 shadow-2xs cursor-pointer transition-all"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Back</span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
                {/* Hero Title & Stats Banner */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-indigo-400/30">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />


                    <div className="relative z-10 space-y-2 max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                            <span>AI Q&A Practice Engine</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                            Question & Answer Practice
                        </h1>
                        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                            Review detailed questions and answers extracted from your course topics for exam preparation.
                        </p>
                    </div>

                    {/* Stats Pill */}
                    {qaList.length > 0 && (
                        <div className="relative z-10 flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
                            <div className="text-center px-3 py-1">
                                <span className="block text-2xl font-black text-indigo-300">{qaList.length}</span>
                                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-300">Q&A Pairs</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Skeleton Loading State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center space-y-6 py-16 animate-pulse">
                        <div className="w-full max-w-4xl h-[360px] bg-slate-200/80 rounded-3xl shadow-inner" />
                        <div className="h-4 bg-slate-200/80 rounded-full w-48" />
                    </div>
                ) : qaRecord?.status === "Generating" && qaList.length === 0 ? (
                    /* AI Generating State */
                    <div className="flex flex-col items-center justify-center py-16 text-center max-w-lg mx-auto bg-amber-50/80 border border-amber-200/80 rounded-3xl p-8 shadow-sm">
                        <div className="p-4 rounded-2xl bg-amber-100 text-amber-600 mb-4 animate-bounce">
                            <Sparkles className="size-8" />
                        </div>
                        <h3 className="font-bold text-xl text-amber-900">Generating Q&A with AI</h3>
                        <p className="text-xs sm:text-sm text-amber-700 mt-2 leading-relaxed max-w-md">
                            Formulating practice questions and comprehensive answers for your course modules. This page will update automatically!
                        </p>
                        <div className="mt-6 flex items-center gap-2.5 text-xs font-semibold text-amber-800 bg-white px-5 py-2.5 rounded-xl border border-amber-200 shadow-2xs">
                            <RefreshCcw className="size-4 animate-spin text-amber-600" />
                            <span>Building Q&A material...</span>
                        </div>
                    </div>
                ) : qaList.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-16 text-center max-w-lg mx-auto bg-white border border-slate-200 rounded-3xl p-10 shadow-xs">
                        <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600 mb-4 border border-indigo-100">
                            <Sparkles className="size-10" />
                        </div>
                        <h3 className="font-bold text-xl text-slate-900">No Q&A Material Available Yet</h3>
                        <p className="text-xs sm:text-sm text-slate-500 mt-2 mb-8 leading-relaxed max-w-md">
                            Generate interactive AI Question & Answer practice sets from your course chapters.
                        </p>
                        <Button
                            onClick={handleGenerateQA}
                            disabled={generating}
                            className="gap-2 text-sm font-semibold px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 cursor-pointer transition-all hover:scale-105"
                        >
                            {generating ? (
                                <>
                                    <RefreshCcw className="size-4 animate-spin" />
                                    <span>Generating Q&A...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="size-4" />
                                    <span>Generate Q&A Material Now</span>
                                </>
                            )}
                        </Button>
                    </div>
                ) : (
                    /* Main QA Content Views */
                    <div className="space-y-6">
                        {/* Search Filter Bar */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                            <div className="relative w-full sm:w-80">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search questions & answers..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
                                />
                            </div>

                            <span className="text-xs font-medium text-slate-500">
                                Showing {filteredQAList.length} of {qaList.length} items
                            </span>
                        </div>

                        {/* Accordion View */}
                        {viewMode === "accordion" ? (
                            <div className="space-y-4 max-w-4xl mx-auto">
                                {filteredQAList.map((item, idx) => {
                                    const isOpen = openIndex === idx
                                    const isCopied = copiedIndex === idx

                                    return (
                                        <div
                                            key={idx}
                                            className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden transition-all duration-200"
                                        >
                                            <button
                                                onClick={() => setOpenIndex(isOpen ? null : idx)}
                                                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-slate-50/80 transition-colors cursor-pointer"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <span className="shrink-0 w-7 h-7 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center mt-0.5">
                                                        Q{idx + 1}
                                                    </span>
                                                    <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                                                        {item.question}
                                                    </h3>
                                                </div>
                                                <ChevronDown
                                                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                                                        isOpen ? "transform rotate-180 text-indigo-600" : ""
                                                    }`}
                                                />
                                            </button>

                                            {isOpen && (
                                                <div className="p-5 pt-0 border-t border-slate-100 bg-slate-50/50 space-y-3 animate-in fade-in duration-200">
                                                    <div className="flex items-start gap-3 pt-4">
                                                        <span className="shrink-0 w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs flex items-center justify-center mt-0.5">
                                                            A
                                                        </span>
                                                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                                                            {item.answer}
                                                        </p>
                                                    </div>

                                                    <div className="flex justify-end pt-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleCopy(`${item.question}\n\n${item.answer}`, idx)}
                                                            className="text-xs text-slate-500 hover:text-indigo-600 gap-1.5 h-8 px-3 rounded-lg cursor-pointer"
                                                        >
                                                            {isCopied ? (
                                                                <>
                                                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                                    <span className="text-emerald-600">Copied!</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Copy className="w-3.5 h-3.5" />
                                                                    <span>Copy QA</span>
                                                                </>
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            /* Grid Cards View */
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredQAList.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold">
                                                    Q{idx + 1}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleCopy(`${item.question}\n\n${item.answer}`, idx)}
                                                    className="text-xs text-slate-400 hover:text-indigo-600 h-7 px-2 rounded-lg cursor-pointer"
                                                >
                                                    {copiedIndex === idx ? (
                                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                    ) : (
                                                        <Copy className="w-3.5 h-3.5" />
                                                    )}
                                                </Button>
                                            </div>

                                            <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-relaxed">
                                                {item.question}
                                            </h3>
                                        </div>

                                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                                            <span className="font-bold text-indigo-600 block mb-1">Answer:</span>
                                            {item.answer}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}

export default QAPage
