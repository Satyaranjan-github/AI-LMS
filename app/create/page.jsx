"use client"

import { useUser } from "@clerk/nextjs"
import axios from "axios"
import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"
import { Button } from "../../components/ui/button"
import SelectOptions from "./_components/SelectOptions"
import TopicInput from "./_components/TopicInput"

function Create() {
    // to get authUser
    const { user } = useUser()
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(0)
    const [formData, setFormData] = useState([])

    const router = useRouter()

    const handleUserInput = (fieldName, fieldValue) => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: fieldValue
        })
        )
    }

    //Used to save user input and generate AI course layout using ai
    const GenerateCourseOutline = async () => {
        const courseId = uuidv4();
        setLoading(true)
        const result = await axios.post("/api/generate-course-outline", {
            courseId: courseId,
            ...formData,
            createdBy: user?.primaryEmailAddress?.emailAddress
        })
        setLoading(false)
        router.replace("/dashboard")
        // Toast Notification
        toast("Your Course Content is generating, Click on Refresh Button")
        console.log("Result from create page=>", result.data.result.resp)
    }


    
    return (
        <div className="flex flex-col items-center p-5 md:px-24 lg:px-36 mt-20">
            <h2 className="font-bold text-4xl text-primary">Start Building Your Personal Study Material</h2>
            <p className="text-gray-500 text-lg">Fill All details in order to generate study material for your next project</p>
            <div className="mt-10 ">
                {step == 0 ?
                    <SelectOptions selectCourseType={(value) => handleUserInput("courseType", value)} /> : <TopicInput setTopic={(value) => handleUserInput("topic", value)}
                        setDifficultyLevel={(value) => handleUserInput("difficultyLevel", value)}
                    />
                }
            </div>
            <div className="w-full flex  justify-between mt-32">
                {step !== 0 ?
                    <Button variant="outline" onClick={() => setStep(step - 1)}>
                        Previous
                    </Button> : "."
                }
                {step == 0 ?
                    <Button onClick={() => setStep(step + 1)}>
                        Next
                    </Button>
                    :
                    <Button onClick={GenerateCourseOutline}
                        disabled={loading}
                    >
                        {loading ? <Loader className="animate-spin" /> : "Generate"}
                    </Button>
                }
            </div>
        </div>
    )
}

export default Create
