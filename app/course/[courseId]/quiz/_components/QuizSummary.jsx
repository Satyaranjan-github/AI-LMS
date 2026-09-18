"use client"

import React from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, HelpCircle, RefreshCcw, RotateCcw, Sparkles, Trophy, XCircle } from "lucide-react"
import { Button } from "../../../../../components/ui/button"

function QuizSummary({
    quizQuestions = [],
    userAnswers = {},
    onResetQuiz,
    onSwitchViewMode,
    courseId
}) {
    let correctCount = 0
    let incorrectCount = 0
    let unansweredCount = 0

    quizQuestions.forEach((q, idx) => {
        const userChoice = userAnswers[idx]
        if (!userChoice) {
            unansweredCount++
        } else if (userChoice === q.correctAnswer) {
            correctCount++
        } else {
            incorrectCount++
        }
    })

    const totalQuestions = quizQuestions.length
    const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0

    // Grade feedback configuration
    let gradeTitle = "Keep Practicing!"
    let gradeSubtitle = "Review the course materials and try again to improve your score."
    let gradeBadgeColor = "bg-amber-500/20 text-amber-300 border-amber-400/30"
    let scoreRingColor = "stroke-amber-400"

    if (scorePercentage >= 80) {
        gradeTitle = "Outstanding Performance! 🎉"
        gradeSubtitle = "You have mastered the core concepts of this quiz module."
        gradeBadgeColor = "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
        scoreRingColor = "stroke-emerald-400"
    } else if (scorePercentage >= 50) {
        gradeTitle = "Good Effort! 👍"
        gradeSubtitle = "You passed, but reviewing a few concepts will help lock in your understanding."
        gradeBadgeColor = "bg-indigo-500/20 text-indigo-300 border-indigo-400/30"
        scoreRingColor = "stroke-indigo-400"
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Score Overview Hero Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden border border-indigo-400/30 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

                <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-3 text-center md:text-left max-w-xl">
                    <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold backdrop-blur-md ${gradeBadgeColor}`}>
                        <Trophy className="w-4 h-4" />
                        <span>Quiz Assessment Complete</span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                        {gradeTitle}
                    </h2>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                        {gradeSubtitle}
                    </p>

                    {/* Action Buttons inside Hero */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-4">
                        <Button
                            onClick={onResetQuiz}
                            className="gap-2 text-xs font-semibold px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 cursor-pointer transition-all hover:scale-105"
                        >
                            <RotateCcw className="w-4 h-4" />
                            <span>Retake Quiz</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => onSwitchViewMode("grid")}
                            className="gap-2 text-xs font-semibold px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border-white/20 cursor-pointer transition-all"
                        >
                            <HelpCircle className="w-4 h-4" />
                            <span>Review Grid</span>
                        </Button>
                        <Link href={`/course/${courseId}`}>
                            <Button
                                variant="outline"
                                className="gap-2 text-xs font-semibold px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 cursor-pointer transition-all"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back to Course</span>
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Score Circular Ring Visual */}
                <div className="relative z-10 flex flex-col items-center shrink-0">
                    <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center bg-slate-800/60 rounded-full border border-slate-700 shadow-inner">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="42"
                                className="stroke-slate-700"
                                strokeWidth="8"
                                fill="transparent"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r="42"
                                className={`${scoreRingColor} transition-all duration-1000 ease-out`}
                                strokeWidth="8"
                                strokeDasharray={264}
                                strokeDashoffset={264 - (264 * scorePercentage) / 100}
                                strokeLinecap="round"
                                fill="transparent"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center text-center">
                            <span className="text-3xl sm:text-4xl font-black text-white drop-shadow-sm">
                                {scorePercentage}%
                            </span>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">
                                Overall Score
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Stats Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-2xs flex flex-col items-center text-center">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Questions</span>
                    <span className="text-3xl font-black text-slate-900 mt-2">{totalQuestions}</span>
                </div>
                <div className="bg-emerald-50/60 border border-emerald-200/80 p-5 rounded-2xl shadow-2xs flex flex-col items-center text-center">
                    <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Correct Answers</span>
                    <span className="text-3xl font-black text-emerald-600 mt-2">{correctCount}</span>
                </div>
                <div className="bg-rose-50/60 border border-rose-200/80 p-5 rounded-2xl shadow-2xs flex flex-col items-center text-center">
                    <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">Incorrect Answers</span>
                    <span className="text-3xl font-black text-rose-600 mt-2">{incorrectCount}</span>
                </div>
                <div className="bg-amber-50/60 border border-amber-200/80 p-5 rounded-2xl shadow-2xs flex flex-col items-center text-center">
                    <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Unanswered</span>
                    <span className="text-3xl font-black text-amber-600 mt-2">{unansweredCount}</span>
                </div>
            </div>

            {/* Question-by-Question Detailed Review List */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Detailed Question Breakdown</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Review your responses and correct answers below</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        {totalQuestions} Items
                    </span>
                </div>

                <div className="space-y-4">
                    {quizQuestions.map((q, idx) => {
                        const userChoice = userAnswers[idx]
                        const isCorrect = userChoice === q.correctAnswer
                        const isUnanswered = !userChoice

                        return (
                            <div
                                key={idx}
                                className={`p-5 rounded-2xl border transition-all ${
                                    isUnanswered
                                        ? "bg-slate-50 border-slate-200"
                                        : isCorrect
                                        ? "bg-emerald-50/30 border-emerald-200"
                                        : "bg-rose-50/30 border-rose-200"
                                }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                        <span className="shrink-0 w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center mt-0.5">
                                            {idx + 1}
                                        </span>
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-sm sm:text-base text-slate-900">
                                                {q.question}
                                            </h4>

                                            {/* Answer Details */}
                                            <div className="text-xs space-y-1.5 pt-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-slate-500">Your Answer:</span>
                                                    {isUnanswered ? (
                                                        <span className="font-semibold text-amber-600 italic">Not Answered</span>
                                                    ) : isCorrect ? (
                                                        <span className="font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-300">
                                                            {userChoice}
                                                        </span>
                                                    ) : (
                                                        <span className="font-semibold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded border border-rose-300">
                                                            {userChoice}
                                                        </span>
                                                    )}
                                                </div>

                                                {!isCorrect && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-slate-500">Correct Answer:</span>
                                                        <span className="font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-300">
                                                            {q.correctAnswer}
                                                        </span>
                                                    </div>
                                                )}

                                                {q.explanation && (
                                                    <p className="text-slate-600 bg-white p-3 rounded-xl border border-slate-200/80 text-xs mt-2 leading-relaxed">
                                                        <span className="font-semibold text-indigo-600">Explanation: </span>
                                                        {q.explanation}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="shrink-0">
                                        {isUnanswered ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                                                <HelpCircle className="w-3.5 h-3.5" />
                                                <span>Skipped</span>
                                            </span>
                                        ) : isCorrect ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                <span>Correct</span>
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold">
                                                <XCircle className="w-3.5 h-3.5" />
                                                <span>Incorrect</span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default QuizSummary
