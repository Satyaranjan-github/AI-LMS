"use client"

import axios from "axios"
import Link from "next/link"
import { useEffect, useState } from "react"
import MaterialCardItem from "./MaterialCardItem"

const StudyMaterialSection = ({ courseId }) => {
    const [studyTypeContent, setStudyTypeContent] = useState()

    const materialList = [
        {
            name: "Notes/Chapters",
            description: "Read Notes To Prepare it",
            icon: "/notes.png",
            path: "/notes",
            type: "notes"
        },
        {
            name: "Flashcard",
            description: "Flashcard help to remember the concepts",
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
            description: "Help to practice your knowledge",
            icon: "/qa.png",
            path: "/qa",
            type: "qa"
        },
    ]

    const GetStudyMaterial = async () => {
        const result = await axios.post('/api/study-type', {
            courseId: courseId,
            studyType: "ALL"
        })

        console.log("Result from Get Study Material=", result?.data)
        setStudyTypeContent(result.data)
    }

    useEffect(() => {
        GetStudyMaterial()
    }, [])

    return (
        <div className="mt-5">
            <h2 className="font-medium text-2xl ">Study Material</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-5">
                {materialList.map((material, index) => (
                    <Link key={index} href={'/course/' + courseId + material.path}>
                        <MaterialCardItem material={material}
                            studyTypeContent={studyTypeContent} />
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default StudyMaterialSection
