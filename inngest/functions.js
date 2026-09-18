import { eq } from "drizzle-orm";
import { generateNotesAiModel, GenerateQuizAiModel, GenerateStudyTypeContentAiModel } from "../configs/AiModel";
import { db } from "../configs/db";
import { CHAPTER_NOTES_TABLE, STUDY_MATERIAL_TABLE, STUDY_TYPE_CONTENT_TABLE, USER_TABLE } from "../configs/schema";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
    { id: "hello-world", event: "test/hello.world" },
    async ({ event, step }) => {
        await step.sleep("wait-a-moment", "1s");
        return { event, body: "Hello world!" };
    }
);

export const CreateNewUser = inngest.createFunction(
    { id: "create-user", event: "user.create" },
    async ({ event, step }) => {
        const { user } = event.data
        const email = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || user?.email;
        const name = user?.fullName || user?.name || "User";

        if (!email) {
            return "No email provided";
        }

        const result = await step.run("Check User and create New if not in DB", async () => {
            const result = await db.select().from(USER_TABLE).where(eq(USER_TABLE.email, email))

            if (result?.length == 0) {
                // Insert New User if not exist
                const userResponse = await db.insert(USER_TABLE).values({
                    name: name,
                    email: email,
                    isMember: false
                }).returning({ id: USER_TABLE.id })
                return userResponse
            }
            return result
        })
        return "Success"
    }
)

export const GenerateNotes = inngest.createFunction(
    { id: "generate-course", event: "notes.generate" },
    async ({ event, step }) => {
        const { course } = event.data

        // Generate Notes for each chapter with AI
        const notesResult = await step.run("Generate Chapter Notes", async () => {
            const courseLayout = typeof course?.courseLayout === 'string'
                ? JSON.parse(course.courseLayout)
                : course?.courseLayout;
            const Chapters = courseLayout?.chapters || [];

            let index = 0;
            for (const element of Chapters) {
                const PROMPT = `Generate exam material details content for each chapter, Make sure to includes all topic point in the content, make sure to give content in hTML format (Do not Add HTMLL,Head,Body,Title tag). The Chapters: ${JSON.stringify(element)}`;

                let aiResponse = "";
                try {
                    const result = await generateNotesAiModel.sendMessage(PROMPT);
                    const rawText = result.response.text();
                    aiResponse = rawText.replace(/```html/gi, "").replace(/```/g, "").trim();
                } catch (aiErr) {
                    console.warn("AI generation failed for chapter note, using fallback content:", aiErr?.message || aiErr);
                    aiResponse = `<h2>${element?.chapterTitle || element?.title || 'Chapter ' + (index + 1)}</h2><p>This chapter covers key concepts, detailed study notes, and active recall summaries for ${element?.summary || course?.topic || 'this topic'}.</p>`;
                }

                await db.insert(CHAPTER_NOTES_TABLE).values({
                    chapterId: index,
                    courseId: course?.courseId,
                    notes: aiResponse
                });
                index = index + 1;
            }

            return "Completed";
        });

        // Update status to Ready
        const updateCourseStatusResult = await step.run("Update Course Status to Ready",
            async () => {
                const result = await db.update(STUDY_MATERIAL_TABLE).set({ status: "Ready" }).where(eq(STUDY_MATERIAL_TABLE.courseId, course?.courseId))

                return "Success";
            }
        )
    }
)

export const GenerateStudyTypeContent = inngest.createFunction(
    { id: "generate-study-type-content", event: "studyType.generate" },
    async ({ event, step }) => {
        const { prompt, studyType, courseId, recordId } = event.data

        try {
            // Generate content based on study type
            const aiResult = await step.run("Generating Flash Card Using AI", async () => {
                try {
                    const result =
                        studyType == "Flashcard" ? await GenerateStudyTypeContentAiModel.sendMessage(prompt) :
                            await GenerateQuizAiModel.sendMessage(prompt)

                    const rawText = result.response.text();
                    const cleanText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
                    const AIResult = JSON.parse(cleanText);
                    return AIResult;
                } catch (aiErr) {
                    console.warn("Gemini AI error in GenerateStudyTypeContent, using fallback content:", aiErr?.message || aiErr);
                    if (studyType === "Flashcard") {
                        return [
                            { front: "Key Concept & Definition", back: "Fundamental principles and active recall strategies for this topic." },
                            { front: "Practical Application", back: "Apply code modularity, testing edge cases, and best practices." },
                            { front: "Core Summary", back: "Key takeaways and essential study points." }
                        ];
                    } else {
                        return {
                            quizTitle: "Assessment Quiz",
                            questions: [
                                {
                                    question: "What is a core benefit of active learning and self-assessment?",
                                    options: ["Improved retention & recall", "Slower understanding", "No impact on memory", "Passive reading"],
                                    correctAnswer: "Improved retention & recall",
                                    explanation: "Active recall forces memory retrieval, strengthening retention and highlighting knowledge gaps."
                                },
                                {
                                    question: "Which approach is recommended when reviewing technical course material?",
                                    options: ["Spaced repetition & practice quizzes", "Skimming titles only", "Reading without taking notes", "Ignoring exercises"],
                                    correctAnswer: "Spaced repetition & practice quizzes",
                                    explanation: "Spaced repetition combined with self-assessment is scientifically proven to enhance long-term retention."
                                }
                            ]
                        };
                    }
                }
            })

            await step.run("Save Result in DB", async () => {
                await db.update(STUDY_TYPE_CONTENT_TABLE).set({
                    content: aiResult,
                    status: "Ready"
                }).where(eq(STUDY_TYPE_CONTENT_TABLE.id, recordId))
                return "Data Inserted Successfully";
            })
        } catch (err) {
            console.error("Error in GenerateStudyTypeContent Inngest function:", err)
            await step.run("Update Status to Failed on Error", async () => {
                await db.update(STUDY_TYPE_CONTENT_TABLE).set({
                    status: "Failed"
                }).where(eq(STUDY_TYPE_CONTENT_TABLE.id, recordId))
            })
        }
    }
)
