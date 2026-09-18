import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "../../../configs/db";
import { STUDY_MATERIAL_TABLE } from "../../../configs/schema";

export async function POST(req) {
    try {
        const { createdBy } = await req.json()

        const result = await db.select().from(STUDY_MATERIAL_TABLE).where(eq(STUDY_MATERIAL_TABLE.createdBy, createdBy))
            .orderBy(desc(STUDY_MATERIAL_TABLE.id))

        return NextResponse.json({ result: result })
    } catch (error) {
        console.error("Error in POST /api/courses:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function GET(req) {
    try {
        const reqUrl = req.url
        const { searchParams } = new URL(reqUrl)
        const courseId = searchParams.get('courseId')

        if (!courseId) {
            return NextResponse.json({ error: "Missing courseId parameter" }, { status: 400 })
        }

        const course = await db.select().from(STUDY_MATERIAL_TABLE).where(eq(STUDY_MATERIAL_TABLE.courseId, courseId))

        return NextResponse.json({ result: course[0] || null })
    } catch (error) {
        console.error("Error in GET /api/courses:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}