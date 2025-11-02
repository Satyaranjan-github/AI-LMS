"use client"

import axios from "axios"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardHeader from "../../dashboard/_components/DashboardHeader"
import ChapterList from "./_components/ChapterList"
import CourseIntroCard from "./_components/CourseIntroCard"
import StudyMaterialSection from "./_components/StudyMaterialSection"

const Course = () => {
    const { courseId } = useParams()
    const [course, setCourse] = useState()

    const GetCourse = async () => {
        const result = await axios.get("/api/courses?courseId=" + courseId,)
        setCourse(result.data.result)
        console.log("Result =>", course)
    }

    useEffect(() => {
        GetCourse()
    }, [])

    return (
        <div>
            <DashboardHeader />
            <div className="mx-10 md:mx-36 lg:mx-60 mt-10">
                {/* Course Intro */}
                <CourseIntroCard course={course} />
                {/* Study Material Options */}
                <StudyMaterialSection />
                {/* Chapter List */}
                <ChapterList course={course} />
            </div>
        </div>
    )
}

export default Course
