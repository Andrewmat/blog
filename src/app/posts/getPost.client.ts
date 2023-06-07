// deals with react elements
import { NetworkError } from "~/errors/network"
import {
	getSlugContent,
	getSlugList,
} from "./api/getPost.server"
import compilePostText from "./compilePostText"
import { PostData } from "./type"

export async function getPost(
	slug: string
): Promise<PostData> {
	const data = await getSlugContent(slug)
	if (data == null) {
		throw new NetworkError.InternalServerError(
			"Undefined data"
		)
	}

	const post = await compilePostText(data)

	return { ...post, slug }
}

export async function getPostList(params: {
	offset: number
	limit: number
}) {
	const slugList = await getSlugList()
	try {
		const pageSlugs = slugList.slice(
			params.offset,
			params.offset + params.limit
		)

		return await Promise.all(
			pageSlugs.map((slug) => getPost(slug))
		)
	} catch (error) {
		if (error instanceof NetworkError.BaseError) {
			const generalError =
				new NetworkError.InternalServerError(
					`Fetching data from posts`
				)
			generalError.cause = error
			throw generalError
		}
		throw error
	}
}
