import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
    schema: "prisma/schema.prisma",
    // Optional at load time so `prisma generate` works without a live DB;
    // migrate/introspect commands will fail loudly if it's unset.
    datasource: {
        url: process.env.DATABASE_URL,
    },
});
