import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();
const envSchema = z.object({
    NODE_ENV: z.string(),
    R2_ACCOUNT_ID: z.string(),
    R2_ACCESS_KEY_ID: z.string(),
    R2_BUCKET_NAME: z.string(),
    R2_LINK: z.string(),
    R2_SECRET_ACCESS_KEY: z.string(),
    R2_TOKEN: z.string(),
    JWT_SECRET: z.string(),
    PORT: z.string(),
    DATABASE_URL: z.string(),
    R2_PUBLIC_URL: z.string(),
});
const env = envSchema.parse(process.env);
export const envConfig = {
    ...env,
};
