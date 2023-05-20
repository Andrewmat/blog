import { compileMDX } from "next-mdx-remote/rsc"
import { notFound } from "next/navigation"
import { getContent } from "./api/route"

type PageProps = {
	params: {
		slug: string
	}
}

export default async function PostSlugPage({
	params,
}: PageProps) {
	const { data, status } = await getContent(params.slug)
	if (status === 404 || data == undefined) {
		notFound()
	}

	const { frontmatter, content } = await compileMDX<{
		title?: string
	}>({
		source: data,
		options: {
			parseFrontmatter: true,
		},
	})

	return (
		<>
			<article>
				<header>
					<h1 className="font-bold pb-2 text-2xl">
						{frontmatter.title}
					</h1>
				</header>
				<div>{content}</div>
			</article>
		</>
	)
}
