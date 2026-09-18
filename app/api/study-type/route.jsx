import { and, desc, eq, or } from "drizzle-orm"
import { NextResponse } from "next/server"
import { db } from "../../../configs/db"
import { CHAPTER_NOTES_TABLE, STUDY_TYPE_CONTENT_TABLE } from "../../../configs/schema"

export async function POST(req) {
    try {
        const { courseId, studyType } = await req.json()

        if (!courseId) {
            return NextResponse.json({ error: "Missing courseId" }, { status: 400 })
        }

        const normalizeRecord = (item) => {
            if (!item) return null
            if (item.content && (typeof item.content === "object" ? Object.keys(item.content).length > 0 : String(item.content).length > 0)) {
                return { ...item, status: "Ready" }
            }
            return item
        }

        if (studyType === "ALL") {
            const notes = await db.select().from(CHAPTER_NOTES_TABLE).where(eq(CHAPTER_NOTES_TABLE.courseId, courseId))

            const contentList = await db.select()
                .from(STUDY_TYPE_CONTENT_TABLE)
                .where(eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId))
                .orderBy(desc(STUDY_TYPE_CONTENT_TABLE.id))

            const result = {
                notes: notes,
                flashCard: normalizeRecord(contentList?.find(item => item.type === "Flashcard" || item.type === "flashCard")),
                quiz: normalizeRecord(contentList?.find(item => item.type === "Quiz" || item.type === "quiz")),
                qa: normalizeRecord(contentList?.find(item => item.type === "QA" || item.type === "qa" || item.type === "Question/Answer"))
            }

            return NextResponse.json(result)
        } else if (studyType === "notes") {
            const notes = await db.select().from(CHAPTER_NOTES_TABLE).where(eq(CHAPTER_NOTES_TABLE.courseId, courseId))

            return NextResponse.json(notes)
        } else {
            const targetType = (studyType === "quiz" || studyType === "Quiz") ? "Quiz" :
                               (studyType === "flashCard" || studyType === "Flashcard") ? "Flashcard" :
                               (studyType === "qa" || studyType === "QA" || studyType === "Question/Answer") ? "QA" : studyType

            const result = await db.select()
                .from(STUDY_TYPE_CONTENT_TABLE)
                .where(
                    and(
                        eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId),
                        or(
                            eq(STUDY_TYPE_CONTENT_TABLE.type, targetType),
                            eq(STUDY_TYPE_CONTENT_TABLE.type, studyType),
                            eq(STUDY_TYPE_CONTENT_TABLE.type, "Question/Answer")
                        )
                    )
                )
                .orderBy(desc(STUDY_TYPE_CONTENT_TABLE.id))

            return NextResponse.json(normalizeRecord(result[0]) ?? null)
        }
    } catch (error) {
        console.error("Error in POST /api/study-type:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}