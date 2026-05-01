import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { getUser } from "./mock-db"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
    }
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const user = getUser(credentials.email as string)
        if (!user || user.password !== (credentials.password as string)) {
          return null
        }
        return { id: user.id, email: user.email, name: user.name }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
})
