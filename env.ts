import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    UPLOADTHING_TOKEN: z.string().min(1),
    GEMINI_API_KEY: z.string().min(1),
    OPENROUTER_API_KEY: z.string().min(1),
    GROQ_API_KEY: z.string().min(1),
    PAYSTACK_SECRET_KEY: z.string().min(1),
    PAYSTACK_PRO_MONTHLY_PLAN_CODE: z.string().min(1),
    PAYSTACK_PRO_ANNUAL_PLAN_CODE: z.string().min(1),
    PAYSTACK_TEAM_MONTHLY_PLAN_CODE: z.string().optional(),
    PAYSTACK_TEAM_ANNUAL_PLAN_CODE: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.url(),
    NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
  },
});

