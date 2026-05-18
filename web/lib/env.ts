import { z } from 'zod';

const envSchema = z.object({
  SCORING_SERVICE_URL: z.string().url().default('http://localhost:8000'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  APP_MODE: z.enum(['demo', 'production']).default('demo'),
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_PRICE_CREATOR: z.string().min(1).optional(),
  STRIPE_PRICE_PRO: z.string().min(1).optional(),
  STRIPE_PRICE_AGENCY: z.string().min(1).optional(),
});

export const env = envSchema.parse({
  SCORING_SERVICE_URL: process.env.SCORING_SERVICE_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  APP_MODE: process.env.APP_MODE,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_PRICE_CREATOR: process.env.STRIPE_PRICE_CREATOR,
  STRIPE_PRICE_PRO: process.env.STRIPE_PRICE_PRO,
  STRIPE_PRICE_AGENCY: process.env.STRIPE_PRICE_AGENCY,
});
