import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)

// These exports are needed for API Routes in App Router
export { handler as GET, handler as POST } 