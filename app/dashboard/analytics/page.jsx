"use client"

import { useUser } from "@clerk/nextjs"
import { Award, BarChart3, CheckCircle2, Flame, Target, TrendingUp, Trophy } from "lucide-react"

export default function AnalyticsPage() {
    const { user } = useUser()

    const stats = [
        {
            title: "Total Study Time",
            value: "14.5 Hours",
            change: "+2.4 hrs this week",
            icon: TrendingUp,
            color: "from-blue-500 to-indigo-600"
        },
        {
            title: "Completed Flashcards",
            value: "128 Cards",
            change: "88% recall accuracy",
            icon: CheckCircle2,
            color: "from-emerald-500 to-teal-600"
        },
        {
            title: "Quiz Average Score",
            value: "92%",
            change: "Top 5% among learners",
            icon: Award,
            color: "from-amber-500 to-orange-600"
        },
        {
            title: "Current Study Streak",
            value: "7 Days 🔥",
            change: "Personal best record!",
            icon: Flame,
            color: "from-rose-500 to-pink-600"
        },
    ]

    const subjectBreakdown = [
        { name: "Computer Science & Programming", score: 94, progress: 85, color: "bg-indigo-600" },
        { name: "Data Structures & Algorithms", score: 88, progress: 70, color: "bg-blue-600" },
        { name: "Web Development (React & Node)", score: 96, progress: 92, color: "bg-teal-600" },
        { name: "Database Design & SQL", score: 85, progress: 65, color: "bg-amber-600" },
    ]

    return (
        <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-medium">
                    <BarChart3 className="size-3.5" />
                    <span>Learning Insights</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Analytics & Study Progress</h1>
                <p className="text-indigo-100 text-xs sm:text-sm max-w-lg">
                    Track your retention metrics, quiz performance, and study consistency over time.
                </p>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, i) => {
                    const Icon = stat.icon
                    return (
                        <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.title}</span>
                                <div className={`p-2 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-xs`}>
                                    <Icon className="size-4" />
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                                <div className="text-xs font-medium text-emerald-600 mt-1">{stat.change}</div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Subject Mastery & Goals */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Subject Performance */}
                <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-bold text-lg text-slate-900">Subject Mastery & Accuracy</h2>
                            <p className="text-slate-500 text-xs mt-0.5">Average score across quizzes and practice sets</p>
                        </div>
                        <Trophy className="size-5 text-amber-500" />
                    </div>

                    <div className="space-y-5">
                        {subjectBreakdown.map((subj, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex justify-between items-center text-xs font-semibold">
                                    <span className="text-slate-800">{subj.name}</span>
                                    <span className="text-slate-600">{subj.score}% Score ({subj.progress}% Completed)</span>
                                </div>
                                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${subj.color} transition-all duration-500 rounded-full`}
                                        style={{ width: `${subj.progress}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Daily Goal Card */}
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-6 flex flex-col justify-between shadow-md">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-indigo-200">
                            <Target className="size-3.5" />
                            <span>Daily Goal</span>
                        </div>
                        <h3 className="font-bold text-xl">Daily Target: 30 Mins</h3>
                        <p className="text-slate-300 text-xs leading-relaxed">
                            Consistent daily practice improves concept retention by up to 70% compared to cramming.
                        </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl space-y-2 border border-white/10">
                        <div className="flex justify-between text-xs font-medium text-slate-200">
                            <span>Today&apos;s Progress</span>
                            <span className="text-indigo-300 font-bold">22 / 30 mins</span>
                        </div>
                        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-400 w-[73%] rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
