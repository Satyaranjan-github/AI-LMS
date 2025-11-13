"use client"

import axios from "axios";
import { RefreshCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../../../../components/ui/button";

const MaterialCardItem = ({ material, studyTypeContent, course, refreshData }) => {
    const [loading, setLoading] = useState(false)
    const GenerateContent = async () => {
        toast("Generating Your Content....")
        setLoading(true)
        let chapters = ""
        course?.courseLayout.chapters.forEach((chapter) => {
            chapters = chapter.chapterTitle
                + "," + chapters
        })

        const result = await axios.post('/api/study-type-content', {
            courseId: course?.courseId,
            type: material.name,
            chapters: chapters
        })
        setLoading(false)
        refreshData(true)
        toast("Your Content is Ready to view")
    }
    console.log("Course Id=", course?.courseId)
    return (
        <Link href={'/course/' + course?.courseId + material.path}>
            <div className={`border shadow-md rounded-lg p-5 flex flex-col items-center ${studyTypeContent?.[material.type] === null ? "grayscale" : ""
                }`}>
                {studyTypeContent?.[material.type] === null ?
                    (
                        <h2 className="p-1 px-2 bg-gray-500 text-white rounded-full text-[10px] mb-2">Generate</h2>
                    ) :
                    (
                        <h2 className="p-1 px-2 bg-green-500 text-white rounded-full text-[10px] mb-2">Ready</h2>
                    )
                }
                <Image
                    src={material.icon}
                    alt={material.name}
                    width={50}
                    height={50}
                />
                <h2 className="font-medium mt-3">{material.name}</h2>
                <p className="text-gray-500 text-sm text-center">{material.description}</p>
                {
                    studyTypeContent?.[material.type] === null ?
                        <Button className="mt-3 w-full" variant="outline" onClick={() => GenerateContent()}>
                            {loading && <RefreshCcw className="animate-spin" />}
                            Generate
                        </Button>
                        :
                        <Button className="mt-3 w-full" variant="outline">
                            View Only
                        </Button>
                }
            </div >
        </Link>
    )
}

export default MaterialCardItem
