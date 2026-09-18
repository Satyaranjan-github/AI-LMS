"use client"

import axios from "axios"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import {
    ArrowLeft,
    CheckCircle2,
    ChevronRight,
    Grid,
    HelpCircle,
    Layers,
    LayoutDashboard,
    Lightbulb,
    RefreshCcw,
    RotateCcw,
    Shuffle,
    Sparkles,
    Trophy,
    XCircle
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "../../../../components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../../../components/ui/carousel"
import FlashcardItem from "./_components/FlashcardItem"

function FlashCard() {
    const { courseId } = useParams()
    const router = useRouter()
    const [flashCardRecord, setFlashCardRecord] = useState(null)
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [isFlipped, setIsFlipped] = useState(false)
    const [api, setApi] = useState()
    const [currentCardIndex, setCurrentCardIndex] = useState(0)

    // View Mode Toggle: 'single' (carousel) vs 'grid' (all cards overview)
    const [viewMode, setViewMode] = useState("single")

    // Active recall mastery tracking state: map of card index -> 'mastered' | 'review'
    const [cardMastery, setCardMastery] = useState({})

    // Grid mode flipped state map: map of index -> boolean
    const [gridFlippedState, setGridFlippedState] = useState({})

    // Deck cards array (supports live shuffle)
    const [shuffledCards, setShuffledCards] = useState(null)

    const GetFlashCards = async (showLoading = true) => {
        if (showLoading) setLoading(true)
        try {
            const result = await axios.post("/api/study-type", {
                courseId: courseId,
                studyType: "Flashcard"
            })
            setFlashCardRecord(result?.data || null)
        } catch (error) {
            console.error("Error fetching flashcards:", error)
            toast.error("Failed to load flashcards")
        } finally {
            if (showLoading) setLoading(false)
        }
    }

    useEffect(() => {
        if (courseId) GetFlashCards()
    }, [courseId])

    // Poll if background generation is in progress
    useEffect(() => {
        if (flashCardRecord?.status === "Generating") {
            const interval = setInterval(() => {
                GetFlashCards(false)
            }, 3000)
            return () => clearInterval(interval)
        }
    }, [flashCardRecord?.status])

    useEffect(() => {
        if (!api) return;
        api.on("select", () => {
            setIsFlipped(false)
            setCurrentCardIndex(api.selectedScrollSnap())
        })
    }, [api])

    // Extract raw flashcard array from DB record
    const baseCardList = useMemo(() => {
        if (!flashCardRecord) return []
        let rawContent = flashCardRecord.content

        if (typeof rawContent === "string") {
            try {
                rawContent = JSON.parse(rawContent)
            } catch (e) {
                console.error("Failed to parse raw flashcards JSON string:", e)
            }
        }

        if (Array.isArray(rawContent)) return rawContent
        if (rawContent && typeof rawContent === "object") {
            if (Array.isArray(rawContent.flashcards)) return rawContent.flashcards
            if (Array.isArray(rawContent.content)) return rawContent.content
            if (Array.isArray(rawContent.cards)) return rawContent.cards
            if (Array.isArray(rawContent.questions)) return rawContent.questions
        }
        return []
    }, [flashCardRecord])

    const cardList = shuffledCards || baseCardList

    // Keyboard navigation bindings (Space to flip, Left/Right arrows to scroll)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
            if (e.code === "Space") {
                e.preventDefault()
                setIsFlipped((prev) => !prev)
            } else if (e.code === "ArrowRight" && api && viewMode === "single") {
                api.scrollNext()
            } else if (e.code === "ArrowLeft" && api && viewMode === "single") {
                api.scrollPrev()
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [api, viewMode])

    const handleGenerateFlashcards = async () => {
        setGenerating(true)
        toast("Generating AI flashcards...")

        try {
            const courseRes = await axios.get(`/api/courses?courseId=${courseId}`)
            const course = courseRes.data?.result
            let chapters = ""
            course?.courseLayout?.chapters?.forEach((ch) => {
                chapters += (ch.chapterTitle || "") + ", "
            })

            await axios.post("/api/study-type-content", {
                courseId: courseId,
                type: "Flashcard",
                chapters: chapters || "Core course concepts"
            })

            await GetFlashCards(false)
            toast.success("Flashcards ready!")
        } catch (err) {
            console.error("Failed to generate flashcards:", err)
            toast.error("Failed to trigger flashcard generation.")
        } finally {
            setGenerating(false)
        }
    }

    const handleClick = () => {
        setIsFlipped(!isFlipped)
    }

    const handleGridCardClick = (index) => {
        setGridFlippedState((prev) => ({
            ...prev,
            [index]: !prev[index]
        }))
    }

    const handleShuffleDeck = () => {
        if (cardList.length <= 1) return;
        const shuffled = [...cardList].sort(() => Math.random() - 0.5)
        setShuffledCards(shuffled)
        setIsFlipped(false)
        if (api) api.scrollTo(0)
        toast.success("Deck shuffled!")
    }

    const handleMarkStatus = (index, status) => {
        setCardMastery((prev) => ({
            ...prev,
            [index]: prev[index] === status ? undefined : status
        }))
        if (status === "mastered") {
            toast.success("Card marked as Mastered! 🎉")
        }
        // Auto advance in single view mode
        if (api && currentCardIndex < cardList.length - 1) {
            setTimeout(() => {
                api.scrollNext()
            }, 300)
        }
    }

    const handleResetProgress = () => {
        setCardMastery({})
        setShuffledCards(null)
        setGridFlippedState({})
        setIsFlipped(false)
        if (api) api.scrollTo(0)
        toast.info("Progress reset")
    }

    // Calculations for progress bar
    const masteredCount = Object.values(cardMastery).filter((s) => s === "mastered").length
    const reviewCount = Object.values(cardMastery).filter((s) => s === "review").length
    const progressPercent = cardList.length > 0 ? Math.round((masteredCount / cardList.length) * 100) : 0

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
                        <span className="font-semibold text-slate-900 truncate">Flashcards</span>
                    </nav>

                    {/* View Switcher & Action Controls */}
                    <div className="flex items-center gap-2 shrink-0">
                        {cardList.length > 0 && (
                            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                                <button
                                    onClick={() => setViewMode("single")}
                                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                                        viewMode === "single"
                                            ? "bg-white text-indigo-600 shadow-2xs"
                                            : "text-slate-600 hover:text-slate-900"
                                    }`}
                                >
                                    <Layers className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Deck Mode</span>
                                </button>
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                                        viewMode === "grid"
                                            ? "bg-white text-indigo-600 shadow-2xs"
                                            : "text-slate-600 hover:text-slate-900"
                                    }`}
                                >
                                    <Grid className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Grid Overview</span>
                                </button>
                            </div>
                        )}

                        {cardList.length > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleShuffleDeck}
                                className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 border-slate-200 rounded-xl cursor-pointer"
                            >
                                <Shuffle className="w-3.5 h-3.5" />
                                <span>Shuffle</span>
                            </Button>
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
                            <span>AI Active Recall Engine</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                            Interactive Flashcards
                        </h1>
                        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                            Practice active recall to fix concepts in long-term memory. Flip cards, mark your confidence, or toggle to Grid View.
                        </p>
                    </div>

                    {/* Mastery Stats Pill */}
                    {cardList.length > 0 && (
                        <div className="relative z-10 flex flex-wrap items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
                            <div className="text-center px-3 py-1">
                                <span className="block text-2xl font-black text-emerald-400">{masteredCount}</span>
                                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-300">Mastered</span>
                            </div>
                            <div className="h-8 w-px bg-white/20" />
                            <div className="text-center px-3 py-1">
                                <span className="block text-2xl font-black text-amber-400">{reviewCount}</span>
                                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-300">Review</span>
                            </div>
                            <div className="h-8 w-px bg-white/20" />
                            <div className="text-center px-3 py-1">
                                <span className="block text-2xl font-black text-indigo-300">{cardList.length}</span>
                                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-300">Cards</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Skeleton Loading State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center space-y-6 py-16 animate-pulse">
                        <div className="w-full max-w-2xl h-[360px] bg-slate-200/80 rounded-3xl shadow-inner" />
                        <div className="h-4 bg-slate-200/80 rounded-full w-48" />
                    </div>
                ) : flashCardRecord?.status === "Generating" && flashCards.length === 0 ? (
                    /* AI Generating State */
                    <div className="flex flex-col items-center justify-center py-16 text-center max-w-lg mx-auto bg-amber-50/80 border border-amber-200/80 rounded-3xl p-8 shadow-sm">
                        <div className="p-4 rounded-2xl bg-amber-100 text-amber-600 mb-4 animate-bounce">
                            <Sparkles className="size-8" />
                        </div>
                        <h3 className="font-bold text-xl text-amber-900">Generating Flashcards with AI</h3>
                        <p className="text-xs sm:text-sm text-amber-700 mt-2 leading-relaxed max-w-md">
                            Analyzing your course chapters to extract active recall questions. This deck will refresh automatically!
                        </p>
                        <div className="mt-6 flex items-center gap-2.5 text-xs font-semibold text-amber-800 bg-white px-5 py-2.5 rounded-xl border border-amber-200 shadow-2xs">
                            <RefreshCcw className="size-4 animate-spin text-amber-600" />
                            <span>Building flashcard deck...</span>
                        </div>
                    </div>
                ) : cardList.length === 0 ? (
                    /* Empty State (Not Generated Yet) */
                    <div className="flex flex-col items-center justify-center py-16 text-center max-w-lg mx-auto bg-white border border-slate-200 rounded-3xl p-10 shadow-xs">
                        <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600 mb-4 border border-indigo-100">
                            <Sparkles className="size-10" />
                        </div>
                        <h3 className="font-bold text-xl text-slate-900">No Flashcards Available Yet</h3>
                        <p className="text-xs sm:text-sm text-slate-500 mt-2 mb-8 leading-relaxed max-w-md">
                            Generate interactive AI flashcards from your course layout to start testing your memory.
                        </p>
                        <Button
                            onClick={handleGenerateFlashcards}
                            disabled={generating}
                            className="gap-2 text-sm font-semibold px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 cursor-pointer transition-all hover:scale-105"
                        >
                            {generating ? (
                                <>
                                    <RefreshCcw className="size-4 animate-spin" />
                                    <span>Generating Deck...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="size-4" />
                                    <span>Generate Flashcards Now</span>
                                </>
                            )}
                        </Button>
                    </div>
                ) : viewMode === "grid" ? (
                    /* Grid Overview View */
                    <div className="space-y-6">
                        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 text-xs font-medium text-slate-600">
                            <span>Showing all {cardList.length} flashcards in Grid View</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleShuffleDeck}
                                className="text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 gap-1.5 h-8 px-3 rounded-lg cursor-pointer font-semibold"
                            >
                                <Shuffle className="w-3.5 h-3.5" />
                                <span>Shuffle Cards</span>
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {cardList.map((flashcard, index) => (
                                <FlashcardItem
                                    key={index}
                                    isFlipped={gridFlippedState[index] || false}
                                    handleClick={() => handleGridCardClick(index)}
                                    flashcard={flashcard}
                                    cardIndex={index}
                                    totalCards={cardList.length}
                                    compact={true}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Single Card Study Carousel View */
                    <div className="flex flex-col items-center space-y-6">
                        {/* Overall Deck Progress & Controls Bar */}
                        <div className="w-full max-w-2xl bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
                            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                                <span>Mastery Progress ({progressPercent}%)</span>
                                <span>{masteredCount} of {cardList.length} Mastered</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                <div
                                    className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>

                            <div className="flex items-center justify-between pt-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleResetProgress}
                                    className="text-xs text-slate-500 hover:text-slate-900 gap-1.5 h-8 px-2.5 rounded-lg cursor-pointer"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>Reset Session</span>
                                </Button>

                                {/* Keyboard Shortcut Legend */}
                                <div className="hidden md:flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                                    <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-600 font-mono">
                                        [Space]
                                    </span>
                                    <span>Flip</span>
                                    <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-600 font-mono">
                                        [←] [→]
                                    </span>
                                    <span>Navigate</span>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Carousel */}
                        <div className="w-full flex flex-col items-center">
                            <Carousel setApi={setApi} className="w-full max-w-2xl">
                                <CarouselContent>
                                    {cardList.map((flashcard, index) => (
                                        <CarouselItem key={index} className="flex items-center justify-center">
                                            <FlashcardItem
                                                isFlipped={isFlipped}
                                                handleClick={handleClick}
                                                flashcard={flashcard}
                                                cardIndex={index}
                                                totalCards={cardList.length}
                                                onMarkStatus={handleMarkStatus}
                                                cardStatus={cardMastery[index]}
                                            />
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>

                                {/* Navigation Arrows & Counter */}
                                <div className="flex items-center justify-between w-full max-w-2xl px-4 mt-6">
                                    <CarouselPrevious className="static translate-y-0 shadow-sm border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 cursor-pointer" />

                                    <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200">
                                        Card {currentCardIndex + 1} / {cardList.length}
                                    </div>

                                    <CarouselNext className="static translate-y-0 shadow-sm border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 cursor-pointer" />
                                </div>
                            </Carousel>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

export default FlashCard
