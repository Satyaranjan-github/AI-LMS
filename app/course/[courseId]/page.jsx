"use client"

import axios from "axios"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import ChapterList from "./_components/ChapterList"
import CourseIntroCard from "./_components/CourseIntroCard"
import StudyMaterialSection from "./_components/StudyMaterialSection"

const Course = () => {
    const { courseId } = useParams()
    const [course, setCourse] = useState()

    const GetCourse = async () => {
        const result = await axios.get("/api/courses?courseId=" + courseId,)
        setCourse(result.data.result)
    }

    useEffect(() => {
        GetCourse()
    }, [])

    return (
        <div>
            <div>
                {/* Course Intro */}
                <CourseIntroCard course={course} />
                {/* Study Material Options */}
                <StudyMaterialSection courseId={courseId} />
                {/* Chapter List */}
                <ChapterList course={course} />
            </div>
        </div>
    )
}

export default Course
