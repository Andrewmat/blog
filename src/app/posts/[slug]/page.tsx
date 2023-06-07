import { NetworkError } from "~/errors/network"
import { getPost as getPostOriginal } from "../getPost.client"
import { notFound } from "next/navigation"

type PageProps = {
	params: {
		slug: string
	}
}

export default async function PostSlugPage({
	params,
}: PageProps) {
	const data = await getPost(params.slug)
	if (!data) {
		notFound()
	}
	return (
		<>
			<article className="blog-center">
				<header>
					<h1 className="font-bold mb-8 text-4xl text-center">
						{data.title}
					</h1>
				</header>
				<div>{data.content}</div>
			</article>
		</>
	)
}

async function getPost(slug: string) {
	try {
		return await getPostOriginal(slug)
	} catch (error) {
		if (error instanceof NetworkError.NotFoundError) {
			return undefined
		} else throw error
	}
}
