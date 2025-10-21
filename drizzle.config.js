import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle',
    schema: './configs/schema.js',
    dialect: 'postgresql',
    dbCredentials: {
        url: 'postgresql://neondb_owner:npg_VaPDJlhEt59s@ep-round-sun-adze8nhl-pooler.c-2.us-east-1.aws.neon.tech/AI-Study-Material-Generator?sslmode=require&channel_binding=require',
    },
});