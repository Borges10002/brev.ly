import 'dotenv/config'
import { z } from 'zod'

const schema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.url(),
  CLOUDFLARE_ACCOUNT_ID: z.string().default(''),
  CLOUDFLARE_ACCESS_KEY_ID: z.string().default(''),
  CLOUDFLARE_SECRET_ACCESS_KEY: z.string().default(''),
  CLOUDFLARE_BUCKET: z.string().default(''),
  CLOUDFLARE_PUBLIC_URL: z.string().default(''),
})

export const env = schema.parse(process.env)
