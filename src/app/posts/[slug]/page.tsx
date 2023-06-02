import { notFound } from "next/navigation"
import { getPostFull as getPostFullOriginal } from "./api/route"
import * as NetworkError from "~/app/errors/network"

type PageProps = {
	params: {
		slug: string
	}
}

export default async function PostSlugPage({
	params,
}: PageProps) {
	const data = await getPostFull(params.slug)

	return (
		<>
			<article className="blog-center">
				<header>
					<h1 className="font-bold pb-2 text-2xl">
						{data.title}
					</h1>
				</header>
				<div>{data.content}</div>
			</article>
		</>
	)
}

async function getPostFull(slug: string) {
	try {
		return await getPostFullOriginal(slug)
	} catch (error) {
		if (error instanceof NetworkError.NotFoundError) {
			notFound()
		} else {
			throw error
		}
	}
}
