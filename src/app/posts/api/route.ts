import { NextRequest, NextResponse } from "next/server"
import { NetworkError } from "~/errors/network"
import { toNextResponse } from "~/errors/nextjs"
import { getPostList } from "../getPost"
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

	const post = await compilePostText(await request.text())

	if (!post.title) {
		return toNextResponse(
			new NetworkError.UnprocessableContentError(
				"No title given to published post"
			)
		)
	}

	if (!post.slug)
		post.slug = post.title.toLowerCase().replace(" ", "+")

	return NextResponse.json({
		message: `Created post with slug ${post.slug}`,
	})
}
