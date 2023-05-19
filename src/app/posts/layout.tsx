import { getSlugList } from "./server"
import NavLink from "../_ui/Link/NavLink"

export default async function PostListPage({
	children,
}: React.PropsWithChildren) {
	const slugList = await getSlugList()
	return (
		<div>
			<NavLink href="/posts">List</NavLink>
			<ul>
				{slugList?.map((slug) => (
					<li key={slug}>
						<NavLink href={`/posts/${slug}`}>
							{slug}
						</NavLink>
					</li>
				))}
			</ul>
			<div>{children}</div>
		</div>
	)
}
