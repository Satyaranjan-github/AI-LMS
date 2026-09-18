"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import MaterialCardItem from "./MaterialCardItem"
import { Sparkles } from "lucide-react"

const StudyMaterialSection = ({ courseId, course }) => {
    const [studyTypeContent, setStudyTypeContent] = useState()
    const [loading, setLoading] = useState(true)

    const materialList = [
        {
            name: "Notes/Chapters",
            description: "Read structured notes to prepare",
            icon: "/notes.png",
            path: "/notes",
            type: "notes"
        },
        {
            name: "Flashcard",
            description: "Remember concepts with interactive cards",
            icon: "/flashcard.png",
            path: "/flashCard",
            type: "flashCard"
        },
        {
            name: "Quiz",
            description: "Great way to test your knowledge",
            icon: "/quiz.png",
            path: "/quiz",
            type: "quiz"
        },
        {
            name: "Question/Answer",
            description: "Practice questions & answer sets",
            icon: "/qa.png",
            path: "/qa",
            type: "qa"
        },
    ]

    const GetStudyMaterial = async () => {
        setLoading(true)
        try {
            const result = await axios.post('/api/study-type', {
                courseId: courseId,
                studyType: "ALL"
            })
            setStudyTypeContent(result.data)
        } catch (error) {
            console.error("Error fetching study materials:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (courseId) GetStudyMaterial()
    }, [courseId])

    return (
        <div className="mt-10">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <h2 className="font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">Study Material</h2>
                    </div>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">
                        Select a study module below to start reviewing and testing your knowledge.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {materialList.map((material, index) => (
                    <MaterialCardItem
                        key={index}
                        material={material}
                        studyTypeContent={studyTypeContent}
                        course={course}
                        refreshData={GetStudyMaterial}
                        isFetching={loading}
                    />
                ))}
            </div>
        </div>
    )
}

export default StudyMaterialSection
