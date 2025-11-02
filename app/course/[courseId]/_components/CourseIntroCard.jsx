"use client"
import Image from "next/image"
import { Progress } from "../../../../components/ui/progress"

const CourseIntroCard = ({ course }) => {
    console.log(course)
    return (
        <div className="flex gap-5 items-center p-10 border shadow-md rounded-lg">
            <Image
                src={"/knowledge.png"}
                width={100}
                height={100}
                alt="Course Image"
            />
            <div>
                <h2 className="font-bold text-2xl">{course?.courseLayout?.courseTitle}</h2>
                <p>{course?.courseLayout?.courseSummary}</p>
                <Progress className="mt-3" />

                <h2 className="mt-3 text-lg text-primary">Total Chapters: {course?.courseLayout?.chapters?.length}</h2>
            </div>
        </div>
    )
}

export default CourseIntroCard
