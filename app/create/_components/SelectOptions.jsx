"use client"

import Image from "next/image"
import { useState } from "react"


function SelectOptions({ selectCourseType }) {
    const Options = [
        {
            name: "Exam",
            icon: "/exam_1.png"
        },
        {
            name: "Job Interview",
            icon: "/job.png"
        },
        {
            name: "Practice",
            icon: "/practice.png"
        },
        {
            name: "Coding Prep",
            icon: "/code.png"
        },
        {
            name: "Others",
            icon: "/knowledge.png"
        }
    ]

    const [selectedOptions, setSelectedOptions] = useState()
    return (
        <div>
            <h2 className="text-center mb-2 text-lg">
                For which you want to create your personal study material ?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                {Options.map((option, index) => (
                    <div key={index} className={`p-4 mt-5 flex flex-col items-center justify-center border rounded-xl hover:border-primary cursor-pointer ${selectedOptions === option.name ? "border-primary" : ""}`}
                        onClick={() => {
                            setSelectedOptions(option.name)
                            selectCourseType(option.name)
                            selectCourseType(option.name)
                        }}
                    >
                        <Image alt={option.name} src={option.icon} width={50} height={50} />
                        <h2 className="text-sm mt-2">{option.name}</h2>
                    </div>
                ))}
            </div>
        </div >
    )
}

export default SelectOptions
