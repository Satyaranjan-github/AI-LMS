import { BookOpen, ListOrdered } from "lucide-react"

const ChapterList = ({ course }) => {
    const chapters = course?.courseLayout?.chapters

    return (
        <div className="mt-10 mb-12">
            <div className="flex items-center gap-2 mb-5">
                <div className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600">
                    <ListOrdered className="w-4 h-4" />
                </div>
                <div>
                    <h2 className="font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
                        Course Curriculum
                    </h2>
                </div>
            </div>

            <div className="space-y-4">
                {chapters?.map((chapter, index) => (
                    <div
                        key={index}
                        className="group relative bg-white border border-slate-200/80 hover:border-indigo-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 overflow-hidden"
                    >
                        {/* Left accent indicator on hover */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Chapter Icon & Number Badge */}
                        <div className="flex items-center gap-3 shrink-0">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/80 flex items-center justify-center text-xl shadow-xs group-hover:scale-105 transition-transform duration-300">
                                {chapter?.emoji || "📖"}
                            </div>
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                                Ch {index + 1}
                            </span>
                        </div>

                        {/* Chapter Details & Topics */}
                        <div className="flex-1 w-full space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                                    {chapter?.chapterTitle}
                                </h3>
                                {chapter?.topics?.length > 0 && (
                                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                        <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                                        {chapter.topics.length} Topics
                                    </span>
                                )}
                            </div>

                            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                                {chapter?.chapterSummary}
                            </p>

                            {/* Topics List Chips */}
                            {chapter?.topics && chapter.topics.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-1.5">
                                    {chapter.topics.map((topic, tIdx) => (
                                        <span
                                            key={tIdx}
                                            className="px-2.5 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200 text-[11px] font-medium"
                                        >
                                            • {topic}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ChapterList
