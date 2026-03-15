import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    GEMINI_API_KEY: z.string().min(1),
    GEMINI_PROJECT_ID: z.string().min(1),
    UPLOADTHING_TOKEN: z.string().min(1),
  },
  client: {},
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {},
});
