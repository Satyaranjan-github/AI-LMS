"use client"

import { useState } from "react"
import { Check, CheckCircle2, HelpCircle, Lightbulb, Sparkles, X, XCircle } from "lucide-react"
import { Button } from "../../../../../components/ui/button"

function QuizCardItem({
    quizData,
    userSelectedOption,
    selectedOption,
    questionIndex = 0,
    totalQuestions = 1,
    compact = false
}) {
    const questionText = quizData?.question || "No Question Available"
    const options = quizData?.options || []
    const correctAnswer = quizData?.correctAnswer
    const optionLetters = ["A", "B", "C", "D", "E", "F"]

    const isAnswered = selectedOption !== undefined && selectedOption !== null
    const isCorrect = isAnswered && selectedOption === correctAnswer

    if (compact) {
        // Grid Overview View Card
        return (
            <div className="w-full bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-bold">
                        Q{questionIndex + 1}
                    </span>

                    {isAnswered ? (
                        isCorrect ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Correct</span>
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-semibold">
                                <XCircle className="w-3 h-3" />
                                <span>Incorrect</span>
                            </span>
                        )
                    ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">
                            <HelpCircle className="w-3 h-3 text-slate-400" />
                            <span>Unanswered</span>
                        </span>
                    )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-3">
                    {questionText}
                </h3>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                    {options.map((option, idx) => {
                        const letter = optionLetters[idx] || `${idx + 1}`
                        const isThisSelected = selectedOption === option
                        const isThisCorrect = option === correctAnswer

                        let optionStyle = "bg-slate-50 text-slate-700 border-slate-200"
                        if (isAnswered) {
                            if (isThisCorrect) {
                                optionStyle = "bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold"
                            } else if (isThisSelected && !isThisCorrect) {
                                optionStyle = "bg-rose-50 text-rose-900 border-rose-300 line-through opacity-80"
                            }
                        }

                        return (
                            <div
                                key={idx}
                                className={`flex items-center gap-2 p-2 rounded-xl border text-[11px] truncate ${optionStyle}`}
                            >
                                <span className="shrink-0 w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                                    {letter}
                                </span>
                                <span className="truncate">{option}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    // Single Interactive Quiz Card Mode
    return (
        <div className="w-full max-w-3xl mx-auto space-y-6 select-none">
            {/* Main Question Card Container */}
            <div className="relative bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden space-y-8">
                {/* Background Ambient Glow */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

                {/* Top Header Row */}
                <div className="relative z-10 flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
                        <HelpCircle className="w-4 h-4 text-indigo-600" />
                        <span>Question Assessment</span>
                    </div>

                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        Question {questionIndex + 1} of {totalQuestions}
                    </span>
                </div>

                {/* Question Text */}
                <div className="relative z-10 py-2">
                    <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 leading-relaxed tracking-tight text-center sm:text-left">
                        {questionText}
                    </h2>
                </div>

                {/* Options List */}
                <div className="relative z-10 grid grid-cols-1 gap-3 sm:gap-4">
                    {options.map((item, index) => {
                        const letter = optionLetters[index] || `${index + 1}`
                        const isThisSelected = selectedOption === item
                        const isThisCorrect = item === correctAnswer

                        let buttonVariant = "outline"
                        let styleClasses = "border-slate-200 bg-slate-50/50 text-slate-800 hover:border-indigo-300 hover:bg-indigo-50/60"

                        if (isAnswered) {
                            if (isThisCorrect) {
                                styleClasses = "border-emerald-500 bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                            } else if (isThisSelected && !isThisCorrect) {
                                styleClasses = "border-rose-500 bg-rose-600 text-white shadow-md shadow-rose-600/20"
                            } else {
                                styleClasses = "border-slate-200 bg-slate-100/60 text-slate-400 opacity-60"
                            }
                        }

                        return (
                            <Button
                                key={index}
                                variant={buttonVariant}
                                onClick={() => userSelectedOption(item)}
                                className={`w-full justify-start text-left p-4 sm:p-5 rounded-2xl min-h-[60px] text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer border ${styleClasses}`}
                            >
                                <span className={`shrink-0 w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs mr-3 transition-colors ${
                                    isAnswered && (isThisCorrect || (isThisSelected && !isThisCorrect))
                                        ? "bg-white/20 text-white"
                                        : "bg-white text-slate-700 border border-slate-200 shadow-2xs"
                                }`}>
                                    {letter}
                                </span>

                                <span className="flex-1 leading-normal whitespace-normal">{item}</span>

                                {/* Feedback icon inside option button */}
                                {isAnswered && isThisCorrect && (
                                    <CheckCircle2 className="w-5 h-5 text-white shrink-0 ml-2" />
                                )}
                                {isAnswered && isThisSelected && !isThisCorrect && (
                                    <XCircle className="w-5 h-5 text-white shrink-0 ml-2" />
                                )}
                            </Button>
                        )
                    })}
                </div>

                {/* Instant Feedback Alert Box */}
                {isAnswered && (
                    <div className="relative z-10 pt-2 animate-in fade-in duration-300">
                        {isCorrect ? (
                            <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3 text-emerald-900">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <h4 className="font-bold text-sm text-emerald-900">Correct Answer! 🎉</h4>
                                    <p className="text-xs text-emerald-700 leading-relaxed">
                                        Great job! You picked the right option.
                                    </p>
                                    {quizData?.explanation && (
                                        <div className="mt-2 pt-2 border-t border-emerald-200/60 text-xs text-emerald-800">
                                            <span className="font-semibold">Explanation: </span>
                                            {quizData.explanation}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3 text-rose-900">
                                <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <h4 className="font-bold text-sm text-rose-900">Incorrect Answer</h4>
                                    <p className="text-xs text-rose-700 leading-relaxed">
                                        The correct answer is <span className="font-bold underline">{correctAnswer}</span>.
                                    </p>
                                    {quizData?.explanation && (
                                        <div className="mt-2 pt-2 border-t border-rose-200/60 text-xs text-rose-800">
                                            <span className="font-semibold">Explanation: </span>
                                            {quizData.explanation}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default QuizCardItem

