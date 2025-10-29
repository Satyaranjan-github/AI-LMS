"use client"

import { useUser } from "@clerk/nextjs"
import axios from "axios"
import { useEffect, useState } from "react"
import CourseCardItem from "./CourseCardItem"

function CourseList() {
    const { user } = useUser()
    const [courseList, setCourseList] = useState([])

    const GetCourseList = async () => {

        const result = await axios.post("/api/courses", { createdBy: user?.primaryEmailAddress?.emailAddress })
        setCourseList(result.data.result)
    }

    useEffect(() => {
        user && GetCourseList()
    }, [user])


    return (
        <div>
            <h2 className="font-bold text-2xl mt-10">Your Study Material</h2>
            <div className="grid sm:grid-cols-1 md:grid-cols-2  lg:grid-cols-3 mt-2 gap-5">
                {courseList.map((course, index) => (
                    <CourseCardItem key={index} course={course} />
                ))}
            </div>
        </div>
    )
}

export default CourseList
