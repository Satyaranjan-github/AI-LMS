"use client"
import axios from "axios"
import { XCircle } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import StateProgress from "../_components/StateProgress"
import QuizCardItem from "./_components/QuizCardItem"

const page = () => {
    const { courseId } = useParams()
    const [quiz, setQuiz] = useState()
    const [quizData, setQuizData] = useState([])
    const [stepCount, setStepCount] = useState(0)
    const [isCorrectAnswer, setIsCorrectAnswer] = useState(null)
    const [correctAnswer, setCorrectAnswer] = useState(null)

    const GetQuiz = async () => {
        const result = await axios.post("/api/study-type", {
            courseId: courseId,
            studyType: "Quiz"
        })
        setQuiz(result?.data)
        setQuizData(result?.data?.content?.questions)
    }

    const checkAnswer = (userAnswer, currentQuestions) => {

        if (userAnswer == currentQuestions?.correctAnswer
        ) {
            setIsCorrectAnswer(true)
            setCorrectAnswer(currentQuestions?.correctAnswer)
            return;
        }
        setIsCorrectAnswer(false)
    }

    useEffect(() => {
        GetQuiz()
    }, [])

    useEffect(() => {
        setCorrectAnswer(null)
        setIsCorrectAnswer(null)
    }, [stepCount])

    return (

        <div>
            <h2 className="font-bold text-2xl">Quiz</h2>

            <StateProgress data={quizData} stepCount={stepCount} setStepCount={(value) => setStepCount(value)} />

            <div>
                {/* {quizData && quizData.map((item, index) => ( */}
                <QuizCardItem
                    quizData={quizData[stepCount]}
                    userSelectedOption={(value) => checkAnswer(value, quizData[stepCount])}
                />
                {/* ))} */}
            </div>

            {isCorrectAnswer == false && (
                <div className="bg-red-200 rounded-lg p-4 mt-4">
                    <h2 class="text-2xl font-semibold text-red-700">
                        <XCircle className="mr-2 inline-block" />
                        Incorrect Answer
                    </h2>
                </div>
            )}
            {isCorrectAnswer == true && (
                <div className="bg-green-200 rounded-lg p-4 mt-4">
                    <h2 className="font-bold text-2xl">Correct Answer</h2>
                </div>
            )}
        </div >
    )
}

export default page
