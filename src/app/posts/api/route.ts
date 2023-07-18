import { NextRequest, NextResponse } from "next/server"
import { NetworkError } from "~/errors/network"
import { toNextResponse } from "~/errors/nextjs"
import { getPostList } from "~/app/posts/getPost.client"
import checkAuthServer from "~/app/auth/checkAuthServer"
import compilePostText from "../compilePostText"

type Context = {
	params: {
		limit?: string
		offset?: string
	}
}

export async function GET(
	request: NextRequest,
	context: Context
) {
	const limit = (() => {
		const value = Number(context.params?.limit)
		return isNaN(value) ? 5 : value
	})()
	const offset = (() => {
		const value = Number(context.params?.offset)
		return isNaN(value) ? 0 : value
	})()

	try {
		const data = await getPostList({
			limit,
			offset,
		})
		return NextResponse.json(data)
	} catch (error) {
		if (error instanceof NetworkError.BaseError) {
			return toNextResponse(error)
		}
	}
}

export async function POST(request: NextRequest) {
	const { error } = await checkAuthServer()
	if (error) {
		return error
	}

	const formData = await request.formData()
	const source = formData.get("source")
	const slug = formData.get("slug")

	if (!source) {
		return toNextResponse(
			new NetworkError.UnprocessableContentError(
				"Source was not sent. It is required"
			)
		)
	}

	if (typeof source !== "string") {
		return toNextResponse(
			new NetworkError.UnprocessableContentError(
				"Source is invalid. It should be a string"
			)
		)
	}

	if (!slug) {
		return toNextResponse(
			new NetworkError.UnprocessableContentError(
				"Slug was not sent. It is required"
			)
		)
	}

	const post = await compilePostText(source)

	if (!post.title && post.published) {
		return toNextResponse(
			new NetworkError.UnprocessableContentError(
				"No title given to published post"
			)
		)
	}

	const post2 = {
		...post,
		slug: post.title
			? post.title.toLowerCase().replace(" ", "+")
			: "untitled",
	}

	return NextResponse.json({
		message: `Created post with slug ${post2.slug}`,
	})
}
