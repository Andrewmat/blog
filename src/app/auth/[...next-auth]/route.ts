import NextAuth, { AuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import invariant from "tiny-invariant"

invariant(
	process.env.GITHUB_ID,
	"Missing GITHUB_ID in environment variables"
)
invariant(
	process.env.GITHUB_SECRET,
	"Missing GITHUB_SECRET in environment variables"
)

export const authOptions: AuthOptions = {
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET,
		}),
	],
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
