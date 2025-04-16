const requiredEnvVars = {
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  DATABASE_URL: process.env.DATABASE_URL,
} as const

export function validateEnv() {
  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missingVars.join('\n')}`
    )
  }

  // Validate DATABASE_URL format
  const dbUrl = process.env.DATABASE_URL
  if (dbUrl && !dbUrl.startsWith('mysql://')) {
    throw new Error('DATABASE_URL must be a valid MySQL connection string')
  }

  // Validate NEXTAUTH_URL format
  const authUrl = process.env.NEXTAUTH_URL
  if (authUrl && !authUrl.startsWith('http')) {
    throw new Error('NEXTAUTH_URL must be a valid URL starting with http/https')
  }

  return requiredEnvVars
}

// Optional environment variables with default values
export const optionalEnvVars = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GITHUB_ID: process.env.GITHUB_ID,
  GITHUB_SECRET: process.env.GITHUB_SECRET,
} as const 