import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({
    id: "ai-study-material-gen",
    isDev: process.env.NODE_ENV !== "production"
});