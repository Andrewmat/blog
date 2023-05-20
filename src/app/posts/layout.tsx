import { getSlugList } from "./api/route"
import NavLink from "../_ui/Link/NavLink"

export default async function PostListPage({
	children,
}: React.PropsWithChildren) {
	const { data, status } = await getSlugList()

	if (status !== 200 || data == null) {
		throw new Error(`Could not find slug list`)
	}

	const slugList = data

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
