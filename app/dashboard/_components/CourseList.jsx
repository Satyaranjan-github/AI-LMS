"use client"

import { useUser } from "@clerk/nextjs"
import axios from "axios"
import { RefreshCcw } from "lucide-react"
import { useContext, useEffect, useState } from "react"
import { Button } from "../../../components/ui/button"
import { CourseCountContext } from "../../_context/CourseCountContext"
import CourseCardItem from "./CourseCardItem"

function CourseList() {
    const { user } = useUser()
    const [courseList, setCourseList] = useState([])
    const [loading, setLoading] = useState(false)
    const { totalCourse, setTotalCourse } = useContext(CourseCountContext)

    const GetCourseList = async () => {
        setLoading(true)
        const result = await axios.post("/api/courses", { createdBy: user?.primaryEmailAddress?.emailAddress })
        setCourseList(result.data.result)
        setLoading(false)
        setTotalCourse(result.data.result?.length)
    }

    useEffect(() => {
        user && GetCourseList()
    }, [user])

    return (
        <div>
            <h2 className="font-bold text-2xl mt-10 flex justify-between items-center">Your Study Material
                <Button variant="outline" className="gap-2 border-primary"
                    onClick={GetCourseList}>
                    <RefreshCcw className={`${loading && "animate-spin"} text-primary`} />
                    Refresh
                </Button>
            </h2>
            <div className="grid sm:grid-cols-1 md:grid-cols-2  lg:grid-cols-3 mt-2 gap-5">
                {loading === false ?
                    courseList.map((course, index) => (
                        <CourseCardItem key={index} course={course} />
                    ))
                    : [1, 2, 3, 4, 5, 6].map((item, index) =>
                        <div key={index} className="h-56 w-full bg-slate-200 rounded-lg animate-pulse">

                        </div>
                    )}
            </div>
        </div>
    )
}

export default CourseList
