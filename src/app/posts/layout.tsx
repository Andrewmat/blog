import { getPostList } from "./getPost.client"
import NavLink from "../_ui/Link/NavLink"
import { NetworkError } from "~/errors/network"
import { notFound } from "next/navigation"

export default async function PostListPage({
	children,
}: React.PropsWithChildren) {
	const posts = await getPostList({
		offset: 0,
		limit: 5,
	})
	if (posts instanceof NetworkError.NotFoundError) {
		notFound()
	}

	return (
		<div>
			<NavLink href="/posts">List</NavLink>
			<ul className="list-disc list-inside">
				{posts?.map((post) => (
					<li key={post.slug}>
						<NavLink href={`/posts/${post.slug}`}>
							{post.title}
						</NavLink>
					</li>
				))}
			</ul>
			<div>{children}</div>
		</div>
	)
}
