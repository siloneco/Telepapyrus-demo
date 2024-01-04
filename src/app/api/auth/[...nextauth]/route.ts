import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

const clientId: string = process.env.GITHUB_ID || ''
const clientSecret: string = process.env.GITHUB_SECRET || ''

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: clientId ?? '',
      clientSecret: clientSecret ?? '',
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async signIn({}) {
      // if (account?.provider !== 'github') return true
      return true
    },
  },
})

export { handler as GET, handler as POST }
