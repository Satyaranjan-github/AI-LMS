import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { courseOutline, generateNotesAiModel } from "../../../configs/AiModel"
import { db } from "../../../configs/db"
import { CHAPTER_NOTES_TABLE, STUDY_MATERIAL_TABLE } from "../../../configs/schema"
import { inngest } from "../../../inngest/client"

export async function POST(req) {
    try {
        const { courseId, topic, difficultyLevel, courseType, createdBy } = await req.json()
        const selectedDifficulty = difficultyLevel || "Easy"
        const PROMPT = `Generate a study material for ${topic} for ${courseType} and level of difficulty will be ${selectedDifficulty} with summary of course, List of Chapters along with summary and emoji icon for each chapter, for each chapter, Topic list in each chapter in JSON format.`

        let aiResult;
        try {
            // Generate Course Layout using AI
            const aiResponse = await courseOutline.sendMessage(PROMPT)
            const rawText = aiResponse.response.text()
            const cleanText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim()
            aiResult = JSON.parse(cleanText)
        } catch (aiErr) {
            console.warn("Gemini API warning in generate-course-outline. Using fallback layout:", aiErr?.message || aiErr)
            aiResult = {
                courseTitle: topic || "Study Course",
                summary: `Comprehensive study guide for ${topic || 'the selected subject'} (${selectedDifficulty} level).`,
                chapters: [
                    {
                        chapterTitle: `Introduction to ${topic || 'Topic'}`,
                        summary: `Fundamental concepts and principles of ${topic || 'this subject'}.`,
                        emoji: "📚",
                        topics: ["Core Principles", "Basic Terminology", "Overview"]
                    },
                    {
                        chapterTitle: `Advanced Concepts & Application`,
                        summary: `In-depth analysis, problem-solving, and practical exercises.`,
                        emoji: "💡",
                        topics: ["Practical Scenarios", "Best Practices", "Summary & Review"]
                    }
                ]
            }
        }

        // 1. Save to DB with difficultyLevel included
        const dbResult = await db.insert(STUDY_MATERIAL_TABLE).values({
            courseId: courseId,
            courseType: courseType || "Exam",
            createdBy: createdBy || "user",
            topic: topic || "Study Course",
            difficultyLevel: selectedDifficulty,
            courseLayout: aiResult,
            status: "Generating"
        }).returning()

        const savedCourse = dbResult[0]

        // 2. Generate Chapter Notes directly to ensure status becomes Ready and notes are saved
        const chapters = aiResult?.chapters || []
        let index = 0
        for (const chapterItem of chapters) {
            const chapterPrompt = `Generate exam material details content for chapter: ${JSON.stringify(chapterItem)} of topic ${topic} in HTML format (do not include html/head/body/title tags).`
            let noteHtml = ""
            try {
                const noteResult = await generateNotesAiModel.sendMessage(chapterPrompt)
                const rawNote = noteResult.response.text()
                noteHtml = rawNote.replace(/```html/gi, "").replace(/```/g, "").trim()
            } catch (noteErr) {
                console.warn("Gemini note generation warning, using fallback note HTML:", noteErr?.message || noteErr)
                noteHtml = `<h2>${chapterItem?.chapterTitle || 'Chapter ' + (index + 1)}</h2><p>${chapterItem?.summary || 'Detailed study notes and key principles for ' + topic}.</p><ul>${(chapterItem?.topics || ['Core Principles', 'Key Takeaways']).map(t => `<li><strong>${t}</strong>: Key concepts and practical applications.</li>`).join('')}</ul>`
            }

            await db.insert(CHAPTER_NOTES_TABLE).values({
                chapterId: index,
                courseId: courseId,
                notes: noteHtml
            })
            index++
        }

        // 3. Update status to Ready
        await db.update(STUDY_MATERIAL_TABLE).set({
            status: "Ready"
        }).where(eq(STUDY_MATERIAL_TABLE.courseId, courseId))

        // 4. Trigger Inngest function as fallback event
        try {
            await inngest.send({
                name: "notes.generate",
                data: {
                    course: savedCourse
                }
            })
        } catch (inngestErr) {
            console.warn("Inngest send warning in generate-course-outline:", inngestErr)
        }

        return NextResponse.json({ result: { ...savedCourse, status: "Ready" } })
    } catch (err) {
        console.error("Error in generate-course-outline API:", err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}