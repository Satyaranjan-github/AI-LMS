"use client"

import { useUser } from "@clerk/nextjs"
import axios from "axios"
import { BookOpen, Compass, Filter, Plus, Search, Sparkles } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "../../../components/ui/button"
import CourseCardItem from "../_components/CourseCardItem"

export default function ExploreCoursesPage() {
    const { user } = useUser()
    const [courseList, setCourseList] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("ALL")

    const categories = [
        { name: "ALL", label: "All Subjects" },
        { name: "Programming", label: "Programming & Code" },
        { name: "Exam", label: "Exam Preparation" },
        { name: "Job Interview", label: "Job Interviews" },
        { name: "General", label: "General Knowledge" },
    ]

    const GetAllCourses = async () => {
        setLoading(true)
        try {
            const userEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress
            if (userEmail) {
                const result = await axios.post("/api/courses", { createdBy: userEmail })
                setCourseList(result.data?.result || [])
            }
        } catch (err) {
            console.error("Error fetching courses for explore page:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) GetAllCourses()
    }, [user])

    const filteredCourses = courseList.filter((course) => {
        const matchesSearch =
            course?.courseLayout?.courseTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course?.topic?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory =
            selectedCategory === "ALL" ||
            course?.courseType?.toLowerCase() === selectedCategory.toLowerCase()
        return matchesSearch && matchesCategory
    })

    return (
        <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
            {/* Header Banner matching unified dashboard styling */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-medium mb-1">
                        <Compass className="size-3.5" />
                        <span>Explore Library</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Explore Courses</h1>
                    <p className="text-indigo-100 text-xs sm:text-sm max-w-lg">
                        Discover, filter, and access your generated study materials across all topics and subjects.
                    </p>
                </div>
                <Link href="/create">
                    <Button className="bg-white text-indigo-600 hover:bg-slate-100 font-semibold shadow-md rounded-xl cursor-pointer gap-2 shrink-0">
                        <Plus className="size-4" /> Create Course
                    </Button>
                </Link>
            </div>

            {/* Search & Category Filter Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by title or topic..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
                    <Filter className="size-4 text-slate-400 shrink-0" />
                    {categories.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => setSelectedCategory(cat.name)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all shrink-0 ${
                                selectedCategory === cat.name
                                    ? "bg-indigo-600 text-white shadow-2xs"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Course Cards Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="h-48 bg-slate-100 animate-pulse rounded-2xl border border-slate-200/80" />
                    ))}
                </div>
            ) : filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course, index) => (
                        <CourseCardItem key={course.courseId || index} course={course} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white border border-slate-200/80 rounded-3xl p-8 space-y-4">
                    <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600 inline-block">
                        <Sparkles className="size-8" />
                    </div>
                    <h3 className="font-bold text-xl text-slate-900">No Courses Available</h3>
                    <p className="text-slate-500 text-xs sm:text-sm max-w-sm mx-auto">
                        {searchQuery
                            ? "No course matched your search query or category filter."
                            : "Explore your study library by generating a new AI course!"}
                    </p>
                    <Link href="/create" className="inline-block">
                        <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl gap-2 mt-2">
                            <Plus className="size-4" /> Generate New Course
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    )
}
