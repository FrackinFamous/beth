import type { Config } from 'drizzle-kit'
import 'dotenv/config'

export default {
    schema: './src/db/schema.ts',
    driver: 'turso',
    dbCredentials: {
        url: process.env.TURSO_CONNECTION_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN,
    },
    verbose: true,
    strict: true,
} as Config

