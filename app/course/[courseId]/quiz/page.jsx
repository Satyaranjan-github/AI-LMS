"use client"

import axios from "axios"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import {
    ArrowLeft,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Grid,
    HelpCircle,
    Layers,
    LayoutDashboard,
    RefreshCcw,
    RotateCcw,
    Sparkles,
    Trophy,
    XCircle
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "../../../../components/ui/button"
import QuizCardItem from "./_components/QuizCardItem"
import QuizSummary from "./_components/QuizSummary"

function QuizPage() {
    const { courseId } = useParams()
    const router = useRouter()

    const [quizRecord, setQuizRecord] = useState(null)
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [stepCount, setStepCount] = useState(0)

    // User response tracking map: map of index -> selected option string
    const [userAnswers, setUserAnswers] = useState({})

    // View Modes: 'single' (question-by-question) vs 'grid' (overview) vs 'summary' (completion score report)
    const [viewMode, setViewMode] = useState("single")

    const GetQuiz = async (showLoading = true) => {
        if (showLoading) setLoading(true)
        try {
            const result = await axios.post("/api/study-type", {
                courseId: courseId,
                studyType: "Quiz"
            })
            setQuizRecord(result?.data || null)
        } catch (error) {
            console.error("Error fetching quiz:", error)
            toast.error("Failed to load quiz content")
        } finally {
            if (showLoading) setLoading(false)
        }
    }

    useEffect(() => {
        if (courseId) GetQuiz()
    }, [courseId])

    // Poll status if background generation is in progress
    useEffect(() => {
        if (quizRecord?.status === "Generating") {
            const interval = setInterval(() => {
                GetQuiz(false)
            }, 3000)
            return () => clearInterval(interval)
        }
    }, [quizRecord?.status])

    // Extract & normalize raw questions array from DB record safely
    const quizQuestions = useMemo(() => {
        if (!quizRecord) return []
        let rawContent = quizRecord.content

        if (typeof rawContent === "string") {
            try {
                const clean = rawContent.replace(/```json/gi, "").replace(/```/g, "").trim()
                rawContent = JSON.parse(clean)
            } catch (e) {
                console.error("Failed to parse raw quiz JSON string:", e)
            }
        }

        let rawList = []
        if (Array.isArray(rawContent)) {
            rawList = rawContent
        } else if (rawContent && typeof rawContent === "object") {
            if (Array.isArray(rawContent.questions)) rawList = rawContent.questions
            else if (Array.isArray(rawContent.content)) rawList = rawContent.content
            else if (Array.isArray(rawContent.quiz)) rawList = rawContent.quiz
            else if (Array.isArray(rawContent.items)) rawList = rawContent.items
            else if (rawContent.content && typeof rawContent.content === "object") {
                if (Array.isArray(rawContent.content.questions)) rawList = rawContent.content.questions
            }
        }


        // Resilient normalizer: ensures every item has valid question, 4 options, and correctAnswer
        return rawList.map((item, idx) => {
            const questionText = item?.question || item?.front || item?.q || `Question ${idx + 1}`
            const rightAnswer = item?.correctAnswer || item?.answer || item?.back || item?.a || "Correct Concept"

            let opts = Array.isArray(item?.options) && item.options.length >= 2 ? [...item.options] : []

            if (opts.length < 2) {
                // Generate fallback options if DB item was missing options array (e.g. legacy flashcard record)
                const defaultDistractors = [
                    "Opposite concept or invalid syntax",
                    "Alternative theoretical approach",
                    "Outdated practice / Deprecated methodology",
                    "None of the above"
                ]
                opts = [rightAnswer]
                defaultDistractors.forEach((d) => {
                    if (opts.length < 4 && !opts.includes(d)) {
                        opts.push(d)
                    }
                })
                // Simple deterministic shuffle
                opts.sort((a, b) => ((a.length + idx) % 2 === 0 ? 1 : -1))
            }

            // Ensure correctAnswer exists inside options
            if (!opts.includes(rightAnswer)) {
                opts[0] = rightAnswer
            }

            return {
                ...item,
                question: questionText,
                correctAnswer: rightAnswer,
                options: opts,
                explanation: item?.explanation || ""
            }
        })
    }, [quizRecord])


    const handleGenerateQuiz = async () => {
        setGenerating(true)
        toast("Generating AI assessment quiz...")

        try {
            const courseRes = await axios.get(`/api/courses?courseId=${courseId}`)
            const course = courseRes.data?.result
            let chapters = ""
            course?.courseLayout?.chapters?.forEach((ch) => {
                chapters += (ch.chapterTitle || "") + ", "
            })

            await axios.post("/api/study-type-content", {
                courseId: courseId,
                type: "Quiz",
                chapters: chapters || "Core course concepts"
            })

            await GetQuiz(false)
            toast.success("Assessment quiz ready!")
        } catch (err) {
            console.error("Failed to generate quiz:", err)
            toast.error("Failed to trigger quiz generation.")
        } finally {
            setGenerating(false)
        }
    }

    const handleSelectOption = (option) => {
        setUserAnswers((prev) => ({
            ...prev,
            [stepCount]: option
        }))
    }

    const handleResetQuiz = () => {
        setUserAnswers({})
        setStepCount(0)
        setViewMode("single")
        toast.info("Quiz reset")
    }

    // Keyboard navigation (1-4 to select option, Left/Right arrows or Enter to navigate)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

            const currentQ = quizQuestions[stepCount]
            if (!currentQ || viewMode !== "single") return;

            if (["1", "2", "3", "4"].includes(e.key)) {
                const optIndex = parseInt(e.key, 10) - 1
                if (currentQ.options && currentQ.options[optIndex]) {
                    handleSelectOption(currentQ.options[optIndex])
                }
            } else if (e.code === "ArrowRight") {
                if (stepCount < quizQuestions.length - 1) {
                    setStepCount((prev) => prev + 1)
                }
            } else if (e.code === "ArrowLeft") {
                if (stepCount > 0) {
                    setStepCount((prev) => prev - 1)
                }
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [stepCount, quizQuestions, viewMode])

    // Live Metrics calculations
    const answeredCount = Object.keys(userAnswers).length
    let correctCount = 0
    let incorrectCount = 0

    Object.entries(userAnswers).forEach(([idxStr, selectedOpt]) => {
        const qIdx = parseInt(idxStr, 10)
        const q = quizQuestions[qIdx]
        if (q && q.correctAnswer === selectedOpt) {
            correctCount++
        } else if (q) {
            incorrectCount++
        }
    })

    const progressPercent = quizQuestions.length > 0 ? Math.round((answeredCount / quizQuestions.length) * 100) : 0

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
                        <span className="font-semibold text-slate-900 truncate">Quiz</span>
                    </nav>

                    {/* View Switcher & Action Controls */}
                    <div className="flex items-center gap-2 shrink-0">
                        {quizQuestions.length > 0 && (
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
                                    <span className="hidden sm:inline">Interactive Quiz</span>
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
                                <button
                                    onClick={() => setViewMode("summary")}
                                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                                        viewMode === "summary"
                                            ? "bg-white text-indigo-600 shadow-2xs"
                                            : "text-slate-600 hover:text-slate-900"
                                    }`}
                                >
                                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                                    <span className="hidden sm:inline">Results</span>
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
                            <span>AI Assessment Engine</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                            Self-Assessment Quiz
                        </h1>
                        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                            Test your comprehension with AI-generated questions. Get instant feedback and monitor your progress.
                        </p>
                    </div>

                    {/* Quiz Live Stats Pill */}
                    {quizQuestions.length > 0 && (
                        <div className="relative z-10 flex flex-wrap items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
                            <div className="text-center px-3 py-1">
                                <span className="block text-2xl font-black text-emerald-400">{correctCount}</span>
                                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-300">Correct</span>
                            </div>
                            <div className="h-8 w-px bg-white/20" />
                            <div className="text-center px-3 py-1">
                                <span className="block text-2xl font-black text-rose-400">{incorrectCount}</span>
                                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-300">Incorrect</span>
                            </div>
                            <div className="h-8 w-px bg-white/20" />
                            <div className="text-center px-3 py-1">
                                <span className="block text-2xl font-black text-indigo-300">{quizQuestions.length}</span>
                                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-300">Questions</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Skeleton Loading State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center space-y-6 py-16 animate-pulse">
                        <div className="w-full max-w-3xl h-[380px] bg-slate-200/80 rounded-3xl shadow-inner" />
                        <div className="h-4 bg-slate-200/80 rounded-full w-48" />
                    </div>
                ) : quizRecord?.status === "Generating" && quizQuestions.length === 0 ? (
                    /* AI Generating State */
                    <div className="flex flex-col items-center justify-center py-16 text-center max-w-lg mx-auto bg-amber-50/80 border border-amber-200/80 rounded-3xl p-8 shadow-sm">
                        <div className="p-4 rounded-2xl bg-amber-100 text-amber-600 mb-4 animate-bounce">
                            <Sparkles className="size-8" />
                        </div>
                        <h3 className="font-bold text-xl text-amber-900">Generating Quiz with AI</h3>
                        <p className="text-xs sm:text-sm text-amber-700 mt-2 leading-relaxed max-w-md">
                            Analyzing your course modules to formulate comprehensive assessment questions. This page will update automatically!
                        </p>
                        <div className="mt-6 flex items-center gap-2.5 text-xs font-semibold text-amber-800 bg-white px-5 py-2.5 rounded-xl border border-amber-200 shadow-2xs">
                            <RefreshCcw className="size-4 animate-spin text-amber-600" />
                            <span>Building quiz assessment...</span>
                        </div>
                    </div>
                ) : quizQuestions.length === 0 ? (
                    /* Empty State (Not Generated Yet) */
                    <div className="flex flex-col items-center justify-center py-16 text-center max-w-lg mx-auto bg-white border border-slate-200 rounded-3xl p-10 shadow-xs">
                        <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600 mb-4 border border-indigo-100">
                            <Sparkles className="size-10" />
                        </div>
                        <h3 className="font-bold text-xl text-slate-900">No Assessment Quiz Available Yet</h3>
                        <p className="text-xs sm:text-sm text-slate-500 mt-2 mb-8 leading-relaxed max-w-md">
                            Generate interactive AI assessment questions from your course layout to start testing your knowledge.
                        </p>
                        <Button
                            onClick={handleGenerateQuiz}
                            disabled={generating}
                            className="gap-2 text-sm font-semibold px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 cursor-pointer transition-all hover:scale-105"
                        >
                            {generating ? (
                                <>
                                    <RefreshCcw className="size-4 animate-spin" />
                                    <span>Generating Assessment...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="size-4" />
                                    <span>Generate Assessment Quiz Now</span>
                                </>
                            )}
                        </Button>
                    </div>
                ) : viewMode === "summary" ? (
                    /* Results Summary Screen */
                    <QuizSummary
                        quizQuestions={quizQuestions}
                        userAnswers={userAnswers}
                        onResetQuiz={handleResetQuiz}
                        onSwitchViewMode={setViewMode}
                        courseId={courseId}
                    />
                ) : viewMode === "grid" ? (
                    /* Grid Overview Mode */
                    <div className="space-y-6">
                        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 text-xs font-medium text-slate-600">
                            <span>Showing all {quizQuestions.length} quiz questions in Grid View</span>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleResetQuiz}
                                    className="text-xs text-slate-600 hover:text-slate-900 gap-1.5 h-8 px-3 rounded-lg cursor-pointer"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>Reset Answers</span>
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => setViewMode("summary")}
                                    className="text-xs bg-indigo-600 text-white hover:bg-indigo-700 gap-1.5 h-8 px-3 rounded-lg cursor-pointer font-semibold"
                                >
                                    <Trophy className="w-3.5 h-3.5 text-amber-300" />
                                    <span>View Score</span>
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {quizQuestions.map((question, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        setStepCount(index)
                                        setViewMode("single")
                                    }}
                                    className="cursor-pointer"
                                >
                                    <QuizCardItem
                                        quizData={question}
                                        selectedOption={userAnswers[index]}
                                        userSelectedOption={(option) => {
                                            setUserAnswers((prev) => ({ ...prev, [index]: option }))
                                        }}
                                        questionIndex={index}
                                        totalQuestions={quizQuestions.length}
                                        compact={true}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Single Question Interactive View */
                    <div className="flex flex-col items-center space-y-6">
                        {/* Quiz Progress & Navigation Bar */}
                        <div className="w-full max-w-3xl bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
                            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                                <span>Quiz Progress ({progressPercent}%)</span>
                                <span>
                                    {answeredCount} of {quizQuestions.length} Answered
                                </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                <div
                                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>

                            <div className="flex items-center justify-between pt-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleResetQuiz}
                                    className="text-xs text-slate-500 hover:text-slate-900 gap-1.5 h-8 px-2.5 rounded-lg cursor-pointer"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>Reset Quiz</span>
                                </Button>

                                {/* Keyboard Shortcut Legend */}
                                <div className="hidden md:flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                                    <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-600 font-mono">
                                        [1-4]
                                    </span>
                                    <span>Select Option</span>
                                    <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-600 font-mono">
                                        [←] [→]
                                    </span>
                                    <span>Navigate</span>
                                </div>

                                <Button
                                    size="sm"
                                    onClick={() => setViewMode("summary")}
                                    className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 gap-1.5 h-8 px-3 rounded-lg cursor-pointer font-semibold"
                                >
                                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                                    <span>Finish & Score</span>
                                </Button>
                            </div>
                        </div>

                        {/* Interactive Quiz Question Card */}
                        <QuizCardItem
                            quizData={quizQuestions[stepCount]}
                            selectedOption={userAnswers[stepCount]}
                            userSelectedOption={handleSelectOption}
                            questionIndex={stepCount}
                            totalQuestions={quizQuestions.length}
                            compact={false}
                        />

                        {/* Bottom Navigation Step Controls */}
                        <div className="flex items-center justify-between w-full max-w-3xl px-2 pt-2">
                            <Button
                                variant="outline"
                                disabled={stepCount === 0}
                                onClick={() => setStepCount((prev) => Math.max(0, prev - 1))}
                                className="flex items-center gap-2 rounded-xl text-xs font-semibold px-5 py-2.5 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer disabled:opacity-40"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span>Previous</span>
                            </Button>

                            {/* Step Indicators */}
                            <div className="hidden sm:flex items-center gap-1.5">
                                {quizQuestions.map((_, idx) => {
                                    const isCurrent = idx === stepCount
                                    const isAnsweredItem = userAnswers[idx] !== undefined

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setStepCount(idx)}
                                            className={`h-2.5 rounded-full transition-all cursor-pointer ${
                                                isCurrent
                                                    ? "w-7 bg-indigo-600"
                                                    : isAnsweredItem
                                                    ? "w-2.5 bg-emerald-500"
                                                    : "w-2.5 bg-slate-300 hover:bg-slate-400"
                                            }`}
                                            title={`Go to question ${idx + 1}`}
                                        />
                                    )
                                })}
                            </div>

                            {stepCount < quizQuestions.length - 1 ? (
                                <Button
                                    onClick={() => setStepCount((prev) => Math.min(quizQuestions.length - 1, prev + 1))}
                                    className="flex items-center gap-2 rounded-xl text-xs font-semibold px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 cursor-pointer"
                                >
                                    <span>Next Question</span>
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => setViewMode("summary")}
                                    className="flex items-center gap-2 rounded-xl text-xs font-semibold px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 cursor-pointer"
                                >
                                    <Trophy className="w-4 h-4 text-amber-300" />
                                    <span>Complete Quiz</span>
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

export default QuizPage
