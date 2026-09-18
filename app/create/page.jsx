"use client"

import { useUser } from "@clerk/nextjs"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowLeft, ArrowRight, ChevronRight, LayoutDashboard, Loader, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"
import { Button } from "../../components/ui/button"
import SelectOptions from "./_components/SelectOptions"
import TopicInput from "./_components/TopicInput"

function Create() {
    const { user } = useUser()
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(0)
    const [formData, setFormData] = useState({
        courseType: "Exam",
        difficultyLevel: "Easy"
    })

    const router = useRouter()

    const handleUserInput = (fieldName, fieldValue) => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: fieldValue
        }))
    }

    const GenerateCourseOutline = async () => {
        if (!formData.topic || !formData.topic.trim()) {
            toast.error("Please enter a topic or study content before generating!")
            return
        }

        const courseId = uuidv4()
        setLoading(true)
        toast("Generating your AI course material...")

        try {
            await axios.post("/api/generate-course-outline", {
                courseId: courseId,
                ...formData,
                createdBy: user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || "user"
            })
            setLoading(false)
            router.replace("/dashboard")
            toast.success("Course layout is generating! Click refresh on your dashboard.")
        } catch (error) {
            console.error("Error generating course:", error)
            setLoading(false)
            toast.error("Failed to generate course outline.")
        }
    }

    return (
        <div className="min-h-screen bg-slate-50/70 pb-16">
            {/* Sticky Glassmorphic Header */}
            <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
                    {/* Breadcrumbs */}
                    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 overflow-hidden">
                        <Link href="/dashboard" className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-100 text-slate-600 font-medium transition-colors shrink-0">
                            <LayoutDashboard className="w-4 h-4 text-primary" />
                            <span>Dashboard</span>
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        <span className="font-semibold text-slate-900 truncate">Create New Course</span>
                    </nav>

                    {/* Quick Back Action */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.back()}
                        className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-primary rounded-xl border-slate-200 shadow-2xs cursor-pointer transition-all"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back</span>
                    </Button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 flex flex-col items-center w-full">
                {/* Page Title & Header (No Banner as requested) */}
                <div className="text-center max-w-2xl space-y-2 mb-8 sm:mb-10">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                        <Sparkles className="size-3.5" />
                        <span>AI Course Builder</span>
                    </div>
                    <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight">
                        Start Building Your Personal Study Material
                    </h1>
                    <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
                        Fill in the details below to generate tailored study materials with AI.
                    </p>
                </div>

                {/* Form Step Component Wrapper */}
                <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 shadow-xs space-y-8">
                    {step === 0 ? (
                        <SelectOptions selectCourseType={(value) => handleUserInput("courseType", value)} />
                    ) : (
                        <TopicInput
                            setTopic={(value) => handleUserInput("topic", value)}
                            setDifficultyLevel={(value) => handleUserInput("difficultyLevel", value)}
                        />
                    )}

                    {/* Step Action Buttons */}
                    <div className="w-full flex justify-between items-center pt-6 border-t border-slate-100">
                        {step !== 0 ? (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setStep(step - 1)}
                                className="gap-2 text-xs font-semibold rounded-xl cursor-pointer"
                            >
                                <ArrowLeft className="size-4" /> Previous
                            </Button>
                        ) : (
                            <div />
                        )}

                        {step === 0 ? (
                            <Button
                                size="sm"
                                onClick={() => setStep(step + 1)}
                                className="gap-2 text-xs font-semibold rounded-xl cursor-pointer"
                            >
                                Next Step <ArrowRight className="size-4" />
                            </Button>
                        ) : (
                            <Button
                                size="sm"
                                onClick={GenerateCourseOutline}
                                disabled={loading}
                                className="gap-2 text-xs font-semibold rounded-xl cursor-pointer"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="size-4 animate-spin" />
                                        <span>Generating Course...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="size-4" />
                                        <span>Generate Course</span>
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Create
