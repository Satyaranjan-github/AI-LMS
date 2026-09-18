"use client"

import ReactCardFlip from "react-card-flip"
import { Check, CheckCircle2, HelpCircle, Lightbulb, RotateCw, Sparkles, X, XCircle } from "lucide-react"
import { Button } from "../../../../../components/ui/button"

function FlashcardItem({
    isFlipped,
    handleClick,
    flashcard,
    cardIndex,
    totalCards,
    onMarkStatus,
    cardStatus,
    compact = false
}) {
    const frontText = flashcard?.front || flashcard?.question || flashcard?.q || "No Question Available"
    const backText = flashcard?.back || flashcard?.answer || flashcard?.a || "No Answer Available"

    if (compact) {
        // Grid View Card Rendering
        return (
            <div className="w-full select-none">
                <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal" containerStyle={{ width: "100%" }}>
                    {/* Front */}
                    <div
                        onClick={handleClick}
                        className="group relative h-64 p-6 rounded-2xl cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-700 border border-indigo-500/30 text-white flex flex-col justify-between shadow-md hover:shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                    >
                        <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30 text-[10px] font-semibold">
                                Card #{cardIndex + 1}
                            </span>
                            <RotateCw className="w-3.5 h-3.5 text-blue-200 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-sm font-bold text-white text-center leading-relaxed my-auto line-clamp-4">
                            {frontText}
                        </h3>
                        <p className="text-[11px] text-blue-100 text-center font-medium">Click to see answer</p>
                    </div>

                    {/* Back */}
                    <div
                        onClick={handleClick}
                        className="group relative h-64 p-6 rounded-2xl cursor-pointer bg-white border border-slate-200 text-slate-900 flex flex-col justify-between shadow-md hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                    >
                        <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                                Answer
                            </span>
                            <RotateCw className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-slate-800 text-center leading-relaxed my-auto line-clamp-5">
                            {backText}
                        </p>
                        <p className="text-[11px] text-emerald-600 text-center font-medium">Click to flip back</p>
                    </div>
                </ReactCardFlip>
            </div>
        )
    }

    // Single Study Carousel View Card Rendering
    return (
        <div className="flex flex-col items-center justify-center p-1 sm:p-4 w-full max-w-2xl select-none">
            <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal" containerStyle={{ width: "100%" }}>
                {/* FRONT SIDE (Question) */}
                <div
                    onClick={handleClick}
                    className="group relative w-full min-h-[340px] sm:min-h-[400px] p-6 sm:p-10 rounded-3xl cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 border border-indigo-400/30 text-white flex flex-col justify-between shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 overflow-hidden"
                >

                    {/* Glowing Ambient Background Circles */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/25 rounded-full blur-3xl group-hover:bg-indigo-500/35 transition-all" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600/25 rounded-full blur-3xl group-hover:bg-purple-500/35 transition-all" />

                    {/* Top Row Badges */}
                    <div className="relative z-10 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold backdrop-blur-md">
                            <HelpCircle className="w-4 h-4 text-indigo-400" />
                            <span>Question</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                            Card {cardIndex + 1} / {totalCards}
                        </span>
                    </div>

                    {/* Question Main Text */}
                    <div className="relative z-10 my-auto py-6 text-center">
                        <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight leading-relaxed text-slate-50 max-w-xl mx-auto drop-shadow-sm">
                            {frontText}
                        </h2>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="relative z-10 flex items-center justify-center gap-2 pt-4 border-t border-slate-800 text-xs font-medium text-slate-400 group-hover:text-indigo-300 transition-colors">
                        <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Click card to reveal answer</span>
                    </div>
                </div>

                {/* BACK SIDE (Answer) */}
                <div
                    onClick={handleClick}
                    className="group relative w-full min-h-[340px] sm:min-h-[400px] p-6 sm:p-10 rounded-3xl cursor-pointer bg-white border border-slate-200/90 text-slate-900 flex flex-col justify-between shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 overflow-hidden"
                >
                    {/* Glowing Ambient Background Circles */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all" />

                    {/* Top Row Badges */}
                    <div className="relative z-10 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                            <Lightbulb className="w-4 h-4 text-emerald-600" />
                            <span>Answer Breakdown</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                            Card {cardIndex + 1} / {totalCards}
                        </span>
                    </div>

                    {/* Answer Main Text */}
                    <div className="relative z-10 my-auto py-6 text-center">
                        <p className="text-base sm:text-xl font-semibold leading-relaxed text-slate-800 max-w-xl mx-auto">
                            {backText}
                        </p>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="relative z-10 flex items-center justify-center gap-2 pt-4 border-t border-slate-100 text-xs font-medium text-slate-400 group-hover:text-emerald-600 transition-colors">
                        <RotateCw className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Click card to flip back</span>
                    </div>
                </div>
            </ReactCardFlip>

            {/* Active Recall Feedback Rating Bar */}
            <div className="w-full flex items-center justify-center gap-3 mt-6">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        onMarkStatus?.(cardIndex, "review");
                    }}
                    className={`gap-1.5 rounded-xl text-xs font-semibold px-5 py-2.5 cursor-pointer transition-all ${
                        cardStatus === "review"
                            ? "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20"
                            : "border-slate-200 hover:border-amber-300 text-slate-600 hover:text-amber-700 hover:bg-amber-50"
                    }`}
                >
                    <XCircle className="w-4 h-4 text-amber-500" />
                    <span>Need Review</span>
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        onMarkStatus?.(cardIndex, "mastered");
                    }}
                    className={`gap-1.5 rounded-xl text-xs font-semibold px-5 py-2.5 cursor-pointer transition-all ${
                        cardStatus === "mastered"
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20"
                            : "border-slate-200 hover:border-emerald-300 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"
                    }`}
                >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Got It Right!</span>
                </Button>
            </div>
        </div>
    )
}

export default FlashcardItem
