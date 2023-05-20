import Link from "next/link"
import { format as formatDate } from "date-fns"
import { Fragment } from "react"
import { getPostList } from "./posts/api/route"

type Props = {
	params: {
		limit: string
		offset: string
	}
}

export default async function HomePage(props: Props) {
	// const posts = await getPosts()

	const limit = (() => {
		const value = Number(props.params.limit)
		return isNaN(value) ? 5 : value
	})()
	const offset = (() => {
		const value = Number(props.params.offset)
		return isNaN(value) ? 0 : value
	})()
	const { data: posts, status } = await getPostList({
		limit,
		offset,
	})

	if (status !== 200 || posts == null) {
		throw new Error(`Could not load post data`)
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

function Post({ post }: { post: PostHome }) {
	return (
		<article className="-mx-4">
			<Link
				href={`/posts/${post.slug}`}
				// className="px-4 py-2 block border border-transparent hover:border-white/20 hover:shadow hover:shadow-white/10 rounded-md"
				className="p-4 block transition-shadow hover:bg-white/5 hover:shadow hover:shadow-white/5"
			>
				<header className="mb-2">
					<h2 className="text-2xl font-bold text-rose-300">
						{post.title}
					</h2>
					<small className="text-sm italic text-gray-200">
						{formatDate(
							new Date(post.published_at),
							"d MMM yyyy"
						)}
					</small>
				</header>
				<p>{post.flavor_text}</p>
			</Link>
		</article>
	)
}

type PostHome = {
	slug: string
	title: string
	flavor_text: string
	published_at: string
}

async function getPosts(): Promise<PostHome[]> {
	return [
		{
			slug: "npm-audit",
			title: "npm audit: Broken by Design",
			flavorText:
				"Found 99 vulnerabilities (84 moderately irrelevant, 15 highly irrelevant)",
			published_at: new Date().toISOString(),
		},
		{
			slug: "memo",
			title: "Before You memo()",
			flavorText:
				"Rendering optimizations that come naturally.",
			published_at: new Date().toISOString(),
		},
		{
			slug: "wet",
			title: "The WET Codebase",
			flavorText: "Come waste your time with me.",
			published_at: new Date().toISOString(),
		},
		{
			slug: "clean-code",
			title: "Goodbye, Clean Code",
			flavorText:
				"Let clean code guide you. Then let it go.",
			published_at: new Date().toISOString(),
		},
		{
			slug: "decade",
			title: "My Decade in Review",
			flavorText: "A personal reflection.",
			published_at: new Date().toISOString(),
		},
		{
			slug: "react-principles",
			title: "What Are the React Team Principles?",
			flavorText: "UI Before API.",
			published_at: new Date().toISOString(),
		},
	]
}
