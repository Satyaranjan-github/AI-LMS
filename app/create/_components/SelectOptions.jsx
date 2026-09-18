"use client"

import Image from "next/image"
import { useState } from "react"
import { CheckCircle2 } from "lucide-react"

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

    const [selectedOption, setSelectedOption] = useState()

    return (
        <div className="w-full space-y-5">
            <h3 className="text-center text-sm sm:text-base font-semibold text-slate-700">
                What do you want to create personal study material for?
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {Options.map((option, index) => {
                    const isSelected = selectedOption === option.name

                    return (
                        <div
                            key={index}
                            onClick={() => {
                                setSelectedOption(option.name)
                                selectCourseType(option.name)
                            }}
                            className={`group relative p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center space-y-2 bg-white ${
                                isSelected
                                    ? "border-2 border-primary bg-primary/5 shadow-xs font-semibold"
                                    : "border-slate-200 hover:border-primary hover:shadow-xs hover:-translate-y-0.5"
                            }`}
                        >
                            {isSelected && (
                                <div className="absolute top-2.5 right-2.5 text-primary">
                                    <CheckCircle2 className="size-4 text-primary" />
                                </div>
                            )}

                            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 group-hover:scale-105 transition-transform">
                                <Image
                                    alt={option.name}
                                    src={option.icon}
                                    width={44}
                                    height={44}
                                    className="w-10 h-10 object-contain"
                                />
                            </div>

                            <h4 className={`text-xs sm:text-sm font-medium transition-colors ${
                                isSelected ? "text-primary font-semibold" : "text-slate-800 group-hover:text-primary"
                            }`}>
                                {option.name}
                            </h4>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default SelectOptions
