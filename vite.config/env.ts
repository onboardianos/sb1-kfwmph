import { z } from 'zod'
import { ViteEnv } from './types'

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_MEDIA_URL: z.string().url(),
  VITE_STREAMIO: z.string(),
  VITE_AWSCONFIG_IDENTITY_POOL_ID: z.string(),
  VITE_AWSCONFIG_REGION: z.string(),
  VITE_AWSCONFIG_USER_POOL_ID: z.string(),
  VITE_AWSCONFIG_USER_POOL_WEB_ID: z.string(),
  VITE_AWSCONFIG_MANDATORY_SIGN_IN: z.string(),
  VITE_AWSPINPOINT_APP_ID: z.string(),
  VITE_AWSPINPONT_REGION: z.string(),
  VITE_AWSPN_APP_ID: z.string(),
  VITE_AWSPN_REGION: z.string(),
  VITE_NEXTAUTH_SECRET: z.string(),
  VITE_AMITY_API_KEY: z.string().optional()
})

export const validateEnv = (env: Record<string, string>): ViteEnv => {
  const result = envSchema.safeParse(env)

  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format())
    throw new Error('Invalid environment variables')
  }

  return result.data
}