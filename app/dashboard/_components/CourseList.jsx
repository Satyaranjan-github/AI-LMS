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
    const { setTotalCourse } = useContext(CourseCountContext)

    const GetCourseList = async () => {
        setLoading(true)
        const result = await axios.post("/api/courses", { createdBy: user?.primaryEmailAddress?.emailAddress })
        setCourseList(result.data.result || [])
        setLoading(false)
        setTotalCourse(result.data.result?.length || 0)
    }

    useEffect(() => {
        user && GetCourseList()
    }, [user])

    return (
        <div className="mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h2 className="font-bold text-xl sm:text-2xl text-slate-900">Your Study Material</h2>
                <Button variant="outline" size="sm" className="gap-2 border-primary/40 text-primary hover:bg-primary/5 self-start sm:self-auto"
                    onClick={GetCourseList}>
                    <RefreshCcw className={`size-4 ${loading && "animate-spin"}`} />
                    Refresh
                </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {!loading ?
                    courseList.map((course, index) => (
                        <CourseCardItem key={index} course={course} />
                    ))
                    : [1, 2, 3, 4, 5, 6].map((item, index) =>
                        <div key={index} className="h-52 w-full bg-slate-200/80 rounded-xl animate-pulse">
                        </div>
                    )}
            </div>
        </div>
    )
}

export default CourseList
