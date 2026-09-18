import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { CreateNewUser, GenerateNotes, GenerateStudyTypeContent, helloWorld } from "../../../inngest/functions";

const inngestHandler = serve({
    client: inngest,
    functions: [
        helloWorld,
        CreateNewUser,
        GenerateNotes,
        GenerateStudyTypeContent
    ],
});

export async function GET(request, context) {
    try {
        return await inngestHandler.GET(request, context);
    } catch (err) {
        console.error("INNGEST GET ERROR:", err);
        return new Response(JSON.stringify({ error: err.message, stack: err.stack }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

export async function POST(request, context) {
    try {
        return await inngestHandler.POST(request, context);
    } catch (err) {
        console.error("INNGEST POST ERROR:", err);
        return new Response(JSON.stringify({ error: err.message, stack: err.stack }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

export async function PUT(request, context) {
    try {
        return await inngestHandler.PUT(request, context);
    } catch (err) {
        console.error("INNGEST PUT ERROR:", err);
        return new Response(JSON.stringify({ error: err.message, stack: err.stack }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}