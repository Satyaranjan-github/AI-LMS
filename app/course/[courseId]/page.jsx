"use client"

import axios from "axios"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft, ChevronRight, LayoutDashboard, RefreshCcw, Sparkles } from "lucide-react"
import { toast } from "sonner"
import CourseIntroCard from "./_components/CourseIntroCard"
import StudyMaterialSection from "./_components/StudyMaterialSection"
import { Button } from "../../../components/ui/button"


const Course = () => {
    const { courseId } = useParams()
    const router = useRouter()
    const [course, setCourse] = useState()
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const GetCourse = async (showToast = false) => {
        if (showToast) setRefreshing(true)
        else setLoading(true)

        try {
            const result = await axios.get("/api/courses?courseId=" + courseId)
            setCourse(result.data.result)
            if (showToast) toast.success("Course details updated")
        } catch (error) {
            console.error("Error fetching course:", error)
            toast.error("Failed to load course details")
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useEffect(() => {
        GetCourse()
    }, [courseId])

    return (
        <div className="min-h-screen bg-slate-50/70 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] pb-16">
            {/* Sticky Glassmorphic Top Header Navigation Bar */}
            <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
                    {/* Breadcrumbs */}
                    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 overflow-hidden">
                        <Link href="/dashboard" className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-100 text-slate-600 font-medium transition-colors shrink-0">
                            <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                            <span>Dashboard</span>
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        <span className="text-slate-400 font-medium shrink-0">Courses</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        <span className="font-semibold text-slate-900 truncate max-w-[150px] sm:max-w-[280px] md:max-w-[400px]">
                            {course?.courseLayout?.courseTitle || course?.topic || "Course Overview"}
                        </span>
                    </nav>

                    {/* Quick Action Controls */}
                    <div className="flex items-center gap-2 shrink-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => GetCourse(true)}
                            disabled={refreshing || loading}
                            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/80 rounded-xl cursor-pointer"
                        >
                            <RefreshCcw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-indigo-600" : ""}`} />
                            Refresh
                        </Button>

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
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
                {loading ? (
                    <div className="space-y-8 animate-pulse">
                        <div className="h-56 bg-slate-200/80 rounded-2xl w-full shadow-inner" />
                        <div className="h-8 bg-slate-200/80 rounded-lg w-56" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-48 bg-slate-200/80 rounded-2xl w-full" />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-10 transition-all duration-500">
                        {/* Course Intro Card */}
                        <CourseIntroCard course={course} />

                        {/* Study Material Options */}
                        <StudyMaterialSection courseId={courseId} course={course} />
                    </div>
                )}
            </main>
        </div>
    )
}

export default Course

