import { eq } from "drizzle-orm";
import { generateNotesAiModel, GenerateStudyTypeContentAiModel } from "../configs/AiModel";
import { db } from "../configs/db";
import { CHAPTER_NOTES_TABLE, STUDY_MATERIAL_TABLE, STUDY_TYPE_CONTENT_TABLE, USER_TABLE } from "../configs/schema";
import { inngest } from "./client";


export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event, step }) => {
        await step.sleep("wait-a-moment", "1s");
        return { event, body: "Hello world!" };
    },
);

export const CreateNewUser = inngest.createFunction(
    { id: "create-user" },
    { event: "user.create" },
    async ({ event, step }) => {
        const { user } = event.data
        const result = await step.run("Check User and create New if not in DB", async () => {
            const result = await db.select().from(USER_TABLE).where(eq(USER_TABLE.email, user?.primaryEmailAddress?.emailAddress))

            if (result?.length == 0) {
                // Insert New User if not exist
                const userResponse = await db.insert(USER_TABLE).values({
                    name: user?.fullName,
                    email: user?.primaryEmailAddress?.emailAddress,
                    isMember: false
                }).returning({ id: USER_TABLE.id })
                return userResponse
            }
            return result
        })
        return "Success"
    }

    // Step to send welcome email notification

    // step to send email notification After 3 Days once user join it
)

export const GenerateNotes = inngest.createFunction(
    { id: "generate-course" },
    { event: "notes.generate" },
    async ({ event, step }) => {
        const { course } = event.data

        // Generate Notes for each chapter with AI
        const notesResult = await step.run("Generate Chapter Notes ", async () => {
            const Chapters = course?.courseLayout?.chapters;

            let index = 0
            Chapters.forEach(async (element) => {
                const PROMPT = `Generate exam material details content for each chapter, Make sure to includes all topic point in the content, make sure to give content in hTML format (Do not Add HTMLL,Head,Body,Title tag). The Chapters: ${JSON.stringify(element)}`

                const result = await generateNotesAiModel.sendMessage(PROMPT)

                const aiResponse = result.response.text();

                await db.insert(CHAPTER_NOTES_TABLE).values({
                    // after project complete instead of add chapter number and remove index . because in courseLayout there is chapter number .
                    chapterId: index,
                    courseId: course?.courseId,
                    notes: aiResponse
                })
                index = index + 1
            });

            return "Completed"
        })

        // Update status to Ready
        const updateCourseStatusResult = await step.run("Update Course Status to Ready",
            async () => {
                const result = await db.update(STUDY_MATERIAL_TABLE).set({ status: "Ready" }).where(eq(STUDY_MATERIAL_TABLE.courseId, course?.courseId))

                return "Success";
            }
        )
    }
)

// Used to generate different study type content like flashcards, quizzes etc.
export const GenerateStudyTypeContent = inngest.createFunction(
    { id: "Generate Study Type Content" },
    { event: "studyType.generate" },
    async ({ event, step }) => {
        const { prompt, studyType, courseId, recordId } = event.data

        // Generate content based on study type
        const FlashCardAiResult = await step.run("Generating Flash Card Using AI", async () => {
            const result = await GenerateStudyTypeContentAiModel.sendMessage(prompt)

            const AIResult = JSON.parse(result.response.text());
            return AIResult;
        })
        const DbResult = await step.run("Save Result in DB", async () => {
            const result = await db.update(STUDY_TYPE_CONTENT_TABLE).set({
                content: FlashCardAiResult,
                status: "Ready"
            }).where(eq(STUDY_TYPE_CONTENT_TABLE.id, recordId))
            return "Data Inserted Successfully";
        }
        )
    }
)
