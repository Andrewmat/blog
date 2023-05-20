import Link from "next/link"
import { format as formatDate } from "date-fns"
import { Fragment } from "react"

export default async function HomePage() {
	const posts = await getPosts()

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
						{post.name}
					</h2>
					<small className="text-sm italic text-gray-200">
						{formatDate(new Date(post.date), "d MMM yyyy")}
					</small>
				</header>
				<p>{post.flavorText}</p>
			</Link>
		</article>
	)
}

type PostHome = {
	slug: string
	name: string
	flavorText: string
	date: string
}

async function getPosts(): Promise<PostHome[]> {
	return [
		{
			slug: "npm-audit",
			name: "npm audit: Broken by Design",
			flavorText:
				"Found 99 vulnerabilities (84 moderately irrelevant, 15 highly irrelevant)",
			date: new Date().toISOString(),
		},
		{
			slug: "memo",
			name: "Before You memo()",
			flavorText:
				"Rendering optimizations that come naturally.",
			date: new Date().toISOString(),
		},
		{
			slug: "wet",
			name: "The WET Codebase",
			flavorText: "Come waste your time with me.",
			date: new Date().toISOString(),
		},
		{
			slug: "clean-code",
			name: "Goodbye, Clean Code",
			flavorText:
				"Let clean code guide you. Then let it go.",
			date: new Date().toISOString(),
		},
		{
			slug: "decade",
			name: "My Decade in Review",
			flavorText: "A personal reflection.",
			date: new Date().toISOString(),
		},
		{
			slug: "react-principles",
			name: "What Are the React Team Principles?",
			flavorText: "UI Before API.",
			date: new Date().toISOString(),
		},
	]
}
