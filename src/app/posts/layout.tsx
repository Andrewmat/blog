import { getPostList } from "./api/route"
import NavLink from "../_ui/Link/NavLink"
import { treatNotFound } from "../errors/nextjs"

export default async function PostListPage({
	children,
}: React.PropsWithChildren) {
	const postList = await treatNotFound(
		getPostList({
			offset: 0,
			limit: 5,
		})
	)

	return (
		<div>
			<NavLink href="/posts">List</NavLink>
			<ul className="list-disc list-inside">
				{postList?.map((post) => (
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
