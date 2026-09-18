import { and, desc, eq, or } from "drizzle-orm"
import { NextResponse } from "next/server"
import { GenerateQuizAiModel, GenerateStudyTypeContentAiModel } from "../../../configs/AiModel"
import { db } from "../../../configs/db"
import { STUDY_TYPE_CONTENT_TABLE } from "../../../configs/schema"
import { inngest } from "../../../inngest/client"

function getFallbackContent(type, chapters) {
    const mainTopic = chapters?.split(',')[0]?.trim() || "Course Material"
    const secondTopic = chapters?.split(',')[1]?.trim() || mainTopic

    if (type === "Flashcard") {
        return [
            {
                front: `What is the primary concept behind ${mainTopic}?`,
                back: `It covers fundamental rules, data structures, and core syntax essential for mastering the subject.`
            },
            {
                front: `How do you apply ${secondTopic} in practical scenarios?`,
                back: `By breaking down complex problems into modular functions, testing edge cases, and following clean coding patterns.`
            },
            {
                front: `What is an important best practice for ${mainTopic}?`,
                back: `Ensure code readability, maintain proper variable scoping, and document key logic clearly.`
            },
            {
                front: `Why is active recall recommended for reviewing ${secondTopic}?`,
                back: `Active recall forces memory retrieval, strengthening retention far better than passive reading.`
            }
        ]
    } else if (type === "QA" || type === "Question/Answer" || type === "qa") {
        return [
            {
                question: `What are the core principles of ${mainTopic}?`,
                answer: `${mainTopic} focuses on building structured, efficient, and maintainable solutions using industry best practices.`
            },
            {
                question: `How does ${secondTopic} integrate with modern application development?`,
                answer: `It streamlines execution by modularizing logic, improving code readability, and ensuring reliability under varying workloads.`
            },
            {
                question: `What are common edge cases to consider when implementing ${mainTopic}?`,
                answer: `Validate input parameters, handle null/undefined states, and test boundary values thoroughly.`
            },
            {
                question: `Why is self-assessment and Q&A review important for mastering ${secondTopic}?`,
                answer: `Regular review reinforces memory retention, identifies knowledge gaps, and deepens theoretical comprehension.`
            }
        ]
    } else {
        return {
            quizTitle: `Assessment Quiz: ${mainTopic}`,
            questions: [
                {
                    question: `What is a core benefit of studying ${mainTopic}?`,
                    options: ["Improved problem solving", "Decreased efficiency", "Slower execution", "No practical use"],
                    correctAnswer: "Improved problem solving",
                    explanation: "Studying key course concepts enhances analytical thinking and problem solving skills."
                },
                {
                    question: `Which technique enhances memory retention of ${secondTopic}?`,
                    options: ["Active recall & spaced repetition", "Passive reading", "Skimming titles", "Ignoring exercises"],
                    correctAnswer: "Active recall & spaced repetition",
                    explanation: "Active recall forces the brain to retrieve information, building stronger neural connections."
                },
                {
                    question: `What is the best approach when encountering complex topics in ${mainTopic}?`,
                    options: ["Break down into smaller components", "Skip the material entirely", "Memorize without understanding", "Avoid practice exercises"],
                    correctAnswer: "Break down into smaller components",
                    explanation: "Deconstructing complex subjects into smaller, manageable parts makes learning structured and effective."
                },
                {
                    question: `How should you verify your mastery of ${secondTopic}?`,
                    options: ["Self-assessment quizzes & flashcards", "Guessing randomly", "Reading once passively", "Assuming full knowledge without testing"],
                    correctAnswer: "Self-assessment quizzes & flashcards",
                    explanation: "Self-testing provides immediate feedback on knowledge gaps and reinforces key concepts."
                }
            ]
        }
    }
}

export async function POST(req) {
    try {
        const { chapters, courseId, type } = await req.json()

        const normalizedType = (type === "quiz" || type === "Quiz") ? "Quiz" :
                               (type === "flashCard" || type === "Flashcard") ? "Flashcard" :
                               (type === "qa" || type === "QA" || type === "Question/Answer") ? "QA" : type

        const PROMPT = normalizedType === "Flashcard"
            ? 'Generate the flashcard on topic: ' + chapters + ', in JSON format with front back content,Maximum 15'
            : normalizedType === "QA"
            ? 'Generate Question and Answer practice set on topic: ' + chapters + ', in JSON format array with question and answer fields. Maximum 10 questions.'
            : 'Generate the quiz on topic: ' + chapters + ', in JSON format with quizTitle and questions array. Each question must have: question, options (array of 4 choices), correctAnswer (string matching one option), and explanation. Maximum 10 questions.'

        // 1. Check for existing record to reuse or insert new record
        const existingRecords = await db.select()
            .from(STUDY_TYPE_CONTENT_TABLE)
            .where(
                and(
                    eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId),
                    or(
                        eq(STUDY_TYPE_CONTENT_TABLE.type, normalizedType),
                        eq(STUDY_TYPE_CONTENT_TABLE.type, type),
                        eq(STUDY_TYPE_CONTENT_TABLE.type, "Question/Answer")
                    )
                )
            )
            .orderBy(desc(STUDY_TYPE_CONTENT_TABLE.id))

        let recordId = null
        if (existingRecords && existingRecords.length > 0) {
            recordId = existingRecords[0].id
            await db.update(STUDY_TYPE_CONTENT_TABLE).set({
                type: normalizedType,
                status: "Generating"
            }).where(eq(STUDY_TYPE_CONTENT_TABLE.id, recordId))
        } else {
            const result = await db.insert(STUDY_TYPE_CONTENT_TABLE).values({
                courseId: courseId,
                type: normalizedType,
                status: "Generating"
            }).returning({
                id: STUDY_TYPE_CONTENT_TABLE.id
            })
            recordId = result[0].id
        }

        // 2. Dispatch Inngest event
        try {
            await inngest.send({
                name: "studyType.generate",
                data: {
                    studyType: normalizedType,
                    prompt: PROMPT,
                    courseId: courseId,
                    recordId: recordId
                }
            })
        } catch (inngestErr) {
            console.warn("Inngest send warning:", inngestErr)
        }

        // 3. Generate content with AI directly and update DB
        let finalContent = null
        try {
            const aiResult = normalizedType === "Flashcard" || normalizedType === "QA"
                ? await GenerateStudyTypeContentAiModel.sendMessage(PROMPT)
                : await GenerateQuizAiModel.sendMessage(PROMPT)

            const rawText = aiResult.response.text()
            const cleanText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim()
            finalContent = JSON.parse(cleanText)
        } catch (aiErr) {
            console.warn("Gemini AI warning. Applying structured fallback content:", aiErr?.message || aiErr)
            finalContent = getFallbackContent(normalizedType, chapters)
        }

        await db.update(STUDY_TYPE_CONTENT_TABLE).set({
            content: finalContent,
            status: "Ready"
        }).where(eq(STUDY_TYPE_CONTENT_TABLE.id, recordId))

        return NextResponse.json(recordId)
    } catch (error) {
        console.error("Error in POST /api/study-type-content:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}