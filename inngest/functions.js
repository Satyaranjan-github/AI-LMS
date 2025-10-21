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
        const result = await step.run("Check User and create New if not in DB", async () => {
            const result = await db.select().from(USER_TABLE).where(eq(USER_TABLE.email, user?.primaryEmailAddress?.emailAddress))

            console.log("Result => ", result)

            if (result?.length == 0) {
                // Insert New User if not exist
                const userResponse = await db.insert(USER_TABLE).values({
                    name: user?.fullName,
                    email: user?.primaryEmailAddress?.emailAddress,
                    isMember: false
                }).returning({ id: USER_TABLE.id })
            }
        })
        return "Success"
    }

    // Step to send welcome email notification

    // step to send email notification After 3 Days once user joined
)