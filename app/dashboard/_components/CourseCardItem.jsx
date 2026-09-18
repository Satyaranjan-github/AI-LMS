import { RefreshCcw } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "../../../components/ui/button"
import { Progress } from "../../../components/ui/progress"

const CourseCardItem = ({ course }) => {
    return (
        <div className="border border-slate-200 rounded-xl shadow-xs hover:shadow-md transition-shadow p-5 bg-white flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-center gap-2">
                    <Image src={"/knowledge.png"} alt="Course Icon" width={44} height={44} className="shrink-0" />
                    <span className="text-[10px] font-medium p-1 px-2.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        Recent
                    </span>
                </div>
                <h2 className="mt-3 font-semibold text-base sm:text-lg text-slate-900 line-clamp-1">
                    {course?.courseLayout?.courseTitle}
                </h2>
                <p className="text-xs sm:text-sm line-clamp-2 text-slate-500 mt-1.5 leading-relaxed">
                    {course?.courseLayout?.courseSummary}
                </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
                <Progress value={0} className="h-1.5 mb-3" />
                <div className="flex justify-end items-center">
                    {course?.status === "Generating" && !course?.courseLayout?.chapters?.length ? (
                        <span className="text-xs font-medium py-1 px-3 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center gap-2">
                            <RefreshCcw className="size-3.5 animate-spin" />
                            Generating...
                        </span>
                    ) : (
                        <Link href={`/course/${course.courseId}`} className="w-full sm:w-auto">
                            <Button size="sm" className="w-full sm:w-auto font-medium cursor-pointer">
                                View Course
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CourseCardItem
