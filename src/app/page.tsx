import Link from "next/link"
import { format as formatDate } from "date-fns"
import { Fragment } from "react"
import { getPostList } from "./posts/getPost.client"
import { PostData } from "./posts/type"
import { NetworkError } from "~/errors/network"
import { notFound } from "next/navigation"

type Props = {
	params: {
		limit: string
		offset: string
	}
}

export default async function HomePage(props: Props) {
	const limit = (() => {
		const value = Number(props.params.limit)
		return isNaN(value) ? 5 : value
	})()
	const offset = (() => {
		const value = Number(props.params.offset)
		return isNaN(value) ? 0 : value
	})()

	const posts = await getPostList({
		limit,
		offset,
	})

	if (posts instanceof NetworkError.NotFoundError) {
		notFound()
	}

	return (
		<>
			<aside id="presentation" className="blog-center">
				<p>Lionis&apos; Personal Blog</p>
			</aside>
			<main
				id="content"
				className="blog-center flex flex-col gap-4"
			>
				{posts.map((post, i) => (
					<Fragment key={post.slug}>
						<Post post={post} />
						{/* No line after last post */}
						{i !== posts.length - 1 && (
							<hr className="w-1/2 mx-auto border-rose-300/20" />
						)}
					</Fragment>
				))}
			</main>
		</>
	)
}

function Post({ post }: { post: PostData }) {
	return (
		<article className="-mx-4">
			<Link
				href={`/posts/${post.slug}`}
				className="p-4 block transition-shadow hover:bg-white/5 hover:shadow hover:shadow-white/5"
			>
				<header className="mb-2">
					<h2 className="text-2xl font-bold text-rose-300">
						{post.title}
					</h2>
					{post.publishedAt && (
						<small className="text-sm italic text-gray-200">
							{formatDate(
								new Date(post.publishedAt),
								"d MMM yyyy"
							)}
						</small>
					)}
				</header>
				<p>{post.flavorText}</p>
			</Link>
		</article>
	)
}
