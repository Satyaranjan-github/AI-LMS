import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env.local' });

export default defineConfig({
    out: './drizzle',
    schema: './configs/schema.js',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.NEXT_PUBLIC_DATABASE_CONNECTION_STRING,
    },
});