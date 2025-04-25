import { config } from './platform/index.js';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    dialect: 'postgresql',
    schema: './drizzle/schema.js',
    out: './drizzle/migrations',
    // WARNING
    url: config.DB_URL,
    dbCredentials: {
        connectionString: config.DB_URL
    },
    verbose: true,
    strict: true
});