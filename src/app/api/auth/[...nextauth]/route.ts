import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', required: true },
        password: { label: 'Password', type: 'password', required: true },
      },
      async authorize(credentials) {
        await dbConnect()

        // Check if user exists
        const user = await User.findOne({ email: credentials?.email })
        if (!user) {
          throw new Error('No user found with this email')
        }

        // Validate password
        const isValidPassword = await bcrypt.compare(credentials?.password, user.password)
        if (!isValidPassword) {
          throw new Error('Invalid password')
        }

        return { id: user.id, email: user.email }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      return session
    },
  },
}

// GET and POST
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }


