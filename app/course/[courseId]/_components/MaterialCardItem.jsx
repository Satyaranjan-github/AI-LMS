"use client"

import axios from "axios";
import { RefreshCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../../../../components/ui/button";

const MaterialCardItem = ({ material, studyTypeContent, course, refreshData, isFetching = false }) => {
    const [generatingLocal, setGeneratingLocal] = useState(false)

    const GenerateContent = async (e) => {
        e.preventDefault();
        toast("Generating Your Content...")
        setGeneratingLocal(true)
        let chapters = ""
        course?.courseLayout?.chapters?.forEach((chapter) => {
            chapters = chapter.chapterTitle + "," + chapters
        })

        try {
            await axios.post('/api/study-type-content', {
                courseId: course?.courseId,
                type: material.name,
                chapters: chapters
            })
            setGeneratingLocal(false)
            refreshData()
            toast.success("Your Content is Ready to view")
        } catch (err) {
            setGeneratingLocal(false)
            toast.error("Failed to generate material.")
        }
    }

    const value = studyTypeContent?.[material.type];
    const hasContent = Array.isArray(value)
        ? value.length > 0
        : Boolean(
            value?.content &&
            (typeof value.content === "object"
                ? Object.keys(value.content).length > 0
                : String(value.content).length > 0)
        );
    const isReady = value?.status === "Ready" || hasContent;
    const isGenerating = generatingLocal || (!isReady && value?.status === "Generating");

    return (
        <div className={`group relative rounded-2xl p-5 flex flex-col justify-between items-center transition-all duration-300 border bg-white ${
            isFetching || !isReady
                ? "border-slate-200 shadow-sm"
                : "border-indigo-100 hover:border-indigo-400 shadow-md hover:shadow-xl hover:-translate-y-1"
        }`}>
            {/* Top Status & Badge */}
            <div className="w-full flex justify-between items-center mb-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    {material.type}
                </span>
                {isFetching ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                        <RefreshCcw className="w-2.5 h-2.5 animate-spin text-slate-400" />
                        Loading
                    </span>
                ) : isGenerating ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <RefreshCcw className="w-2.5 h-2.5 animate-spin text-amber-600" />
                        Generating
                    </span>
                ) : !isReady ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        Not Ready
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        Ready
                    </span>
                )}
            </div>

            {/* Icon & Details */}
            <div className="flex flex-col items-center text-center w-full my-2">
                <div className="relative group-hover:scale-110 transition-transform duration-300 p-3 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/50 mb-3 shadow-inner">
                    <Image
                        src={material.icon}
                        alt={material.name}
                        width={52}
                        height={52}
                        className="w-12 h-12 object-contain drop-shadow-sm"
                    />
                </div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {material.name}
                </h3>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed line-clamp-2 min-h-[32px]">
                    {material.description}
                </p>
            </div>

            {/* Actions */}
            <div className="w-full mt-4 pt-3 border-t border-slate-100 min-h-[48px] flex items-center justify-center">
                {isFetching ? (
                    <div className="h-9 w-full bg-slate-100 animate-pulse rounded-xl" />
                ) : !isReady ? (
                    <Button
                        className="w-full text-xs font-semibold gap-2 cursor-pointer transition-all duration-300 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
                        size="sm"
                        variant="outline"
                        onClick={GenerateContent}
                        disabled={isGenerating}
                    >
                        {isGenerating ? (
                            <>
                                <RefreshCcw className="size-3.5 animate-spin text-indigo-600" />
                                Generating...
                            </>
                        ) : (
                            <>Generate Material</>
                        )}
                    </Button>
                ) : (
                    <Link href={'/course/' + course?.courseId + material.path} className="w-full block">
                        <Button className="w-full text-xs font-semibold cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-300" size="sm">
                            View Material →
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    )
}

export default MaterialCardItem
