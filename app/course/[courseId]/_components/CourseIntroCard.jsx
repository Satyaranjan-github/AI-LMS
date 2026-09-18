"use client"

import Image from "next/image"
import { BookOpen, Sparkles, Trophy, Clock, CheckCircle2, Layers } from "lucide-react"
import { Progress } from "../../../../components/ui/progress"

const CourseIntroCard = ({ course }) => {
    const chaptersCount = course?.courseLayout?.chapters?.length || 0
    const courseTitle = course?.courseLayout?.courseTitle || course?.topic || "Course Overview"
    const courseSummary = course?.courseLayout?.courseSummary || "Comprehensive study guide generated tailored to your learning goals."
    const difficultyLevel = course?.courseLayout?.difficultyLevel || course?.difficultyLevel || "Standard"
    const courseType = course?.courseType || "Exam Prep"

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 sm:p-8 shadow-xl border border-indigo-400/30">
            {/* Ambient Background Glow Effects */}
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />


            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Course Icon Badge */}
                <div className="relative group shrink-0">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-md opacity-50 group-hover:opacity-75 transition duration-500" />
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-md p-4 flex items-center justify-center shadow-inner">
                        <Image
                            src={"/knowledge.png"}
                            width={80}
                            height={80}
                            alt="Course Icon"
                            className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-md"
                        />
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 w-full space-y-3">
                    {/* Header Pills */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium flex items-center gap-1.5 backdrop-blur-xs">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                            AI Generated Course
                        </span>
                        {courseType && (
                            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium flex items-center gap-1.5 backdrop-blur-xs">
                                <Layers className="w-3.5 h-3.5 text-purple-400" />
                                {courseType}
                            </span>
                        )}
                        {difficultyLevel && (
                            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium flex items-center gap-1.5">
                                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                                {difficultyLevel}
                            </span>
                        )}
                    </div>

                    {/* Course Title & Description */}
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                            {courseTitle}
                        </h1>
                        <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed max-w-3xl">
                            {courseSummary}
                        </p>
                    </div>

                    {/* Footer Stats & Progress */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs border-t border-white/10">
                        <div className="flex items-center gap-6 text-slate-300">
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-indigo-400" />
                                <span><strong className="text-white font-semibold">{chaptersCount}</strong> {chaptersCount === 1 ? 'Chapter' : 'Chapters'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <span>Status: <strong className="text-emerald-400 font-semibold">{course?.status || "Ready"}</strong></span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <span className="text-slate-400 text-xs font-medium">Course Progress</span>
                            <div className="w-32 bg-slate-800 rounded-full h-2 overflow-hidden border border-white/10">
                                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full w-[0%] transition-all duration-500" />
                            </div>
                            <span className="text-slate-300 font-semibold text-xs">0%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseIntroCard
