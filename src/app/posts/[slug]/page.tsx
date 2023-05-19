import { MDXRemote } from "next-mdx-remote/rsc"
import { getContent } from "./server"

export default async function Home({ params }) {
	const source = await getContent(params.slug)

	// @ts-expect-error Async Server Component
	return <MDXRemote source={source} />
}
