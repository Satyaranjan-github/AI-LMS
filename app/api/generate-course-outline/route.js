import { NextResponse } from "next/server"
import { courseOutline } from "../../../configs/AiModel"
import { db } from "../../../configs/db"
import { STUDY_MATERIAL_TABLE } from "../../../configs/schema"
import { inngest } from "../../../inngest/client"

export async function POST(req) {
    const { courseId, topic, difficultyLevel, courseType, createdBy } = await req.json()
    const PROMPT = `Generate a study material for ${topic} for ${courseType} and level of difficulty will be ${difficultyLevel} with summery of course, List of Chapters along with summery and emoji icon for each chapter, for each chapter, Topic list in each chapter in JSON format.`

    //  Generate Course Layout using AI
    const aiResponse = await courseOutline.sendMessage(PROMPT)

    const aiResult = JSON.parse(aiResponse.response.text())

    //  Save to DB
    const dbResult = await db.insert(STUDY_MATERIAL_TABLE).values({
        courseId: courseId,
        courseType: courseType,
        createdBy: createdBy,
        topic: topic,
        courseLayout: aiResult
    }).returning({ resp: STUDY_MATERIAL_TABLE })

    //  Trigger The Inngest function to generate chapter notes
    const result = await inngest.send({
        name: "notes.generate",
        data: {
            course: dbResult[0].resp
        }
    })

    return NextResponse.json({ result: dbResult[0] })
}