"use client"

import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "../../../../components/ui/button"

function ViewNotes() {
    const { courseId } = useParams()
    const [notes, setNotes] = useState()
    const [stepCount, setStepCount] = useState(0)
    const router = useRouter()

    const GetNotes = async () => {
        const result = await axios.post('/api/study-type', {
            courseId: courseId,
            studyType: "notes"
        });

        setNotes(result.data)
    }

    useEffect(() => {
        GetNotes()
    }, [])

    return notes && (
        <div>
            <div className="flex gap-5 items-center">
                {stepCount !== 0 && <Button variant="outline" size="sm" onClick={() => setStepCount(stepCount - 1)}>
                    Previous
                </Button>
                }
                {notes?.map((note, index) => (
                    <div key={index} className={`w-full h-2 rounded-full
                    ${index < stepCount ? "bg-primary" : "bg-gray-200"}`}>
                    </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => setStepCount(stepCount + 1)}>
                    Next
                </Button>
            </div>
            <div className="mt-10">
                <div
                    dangerouslySetInnerHTML={{ __html: notes[stepCount]?.notes }} />
                {notes?.length == stepCount &&
                    <div className="flex items-center gap-10 flex-col justify-center">
                        <h2>You have reached the end</h2>
                        <Button onClick={() =>
                            router.back()
                        }>
                            Go To Course Page
                        </Button>
                    </div>
                }
            </div>
        </div>
    )
}

export default ViewNotes
