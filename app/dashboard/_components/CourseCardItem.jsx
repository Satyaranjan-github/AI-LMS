import { RefreshCcw } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "../../../components/ui/button"
import { Progress } from "../../../components/ui/progress"

const CourseCardItem = ({ course }) => {
    return (
        <div className="border rounded-lg shadow-md p-5">
            <div>
                <div className="flex justify-between items-center">
                    <Image src={"/knowledge.png"} alt="Other" width={50} height={50} />
                    <h2 className="text-[10px] p-1 px-2 rounded-full bg-primary text-white"> 20/ Dec 2024</h2>
                </div>
                <h2 className="mt-3 font-medium text-lg">{course?.courseLayout?.courseTitle}</h2>
                <p className="text-sm line-clamp-2 text-gray-500 mt-2">{course?.courseLayout
                    ?.courseSummary}</p>

                <div className="mt-3">
                    <Progress value={0} />
                </div>
                <div className="mt-3 flex justify-end">
                    {course?.status === "Generating" ? <h2 className="text-sm p-1 px-2 rounded-full bg-gray-600 text-white gap-2 flex items-center ">
                        <RefreshCcw className="size-4 animate-spin" />
                        Generating...
                    </h2> :
                        <Link href={`/course/${course.courseId}`}>
                            <Button>
                                View
                            </Button>
                        </Link>
                    }
                </div>
            </div>
        </div>
    )
}

export default CourseCardItem
