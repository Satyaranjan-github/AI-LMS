"use client"
import { useState } from "react";
import { Button } from "../../../../../components/ui/button";

function QuizCardItem({ quizData, userSelectedOption }) {

    const [selectedOption, setSelectedOption] = useState();

    return quizData && (
        <div>
            <h2 className="font-medium text-3xl mt-10 p-5 text-center">{quizData?.question}</h2>
            <div className="grid grid-cols-2 gap-5">
                {quizData?.options?.map((item, index) => (
                    <Button key={index}
                        variant="outline"
                        className={`w-full border rounded-full p-4 text-lg hover:bg-gray-300 cursor-pointer ${selectedOption === item ? "bg-primary text-white" : ""}`}
                        onClick={() => {
                            setSelectedOption(item)
                            userSelectedOption(item)
                        }}>
                        {item}
                    </Button>
                ))}
            </div>
        </div>
    )
}

export default QuizCardItem
