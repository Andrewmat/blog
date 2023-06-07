import { NextResponse, NextRequest } from "next/server"
import * as NetworkError from "~/errors/network"
import { PostMetadata } from "../../type"
import { getPost } from "../../getPost.client"

type Context = {
	params: {
		slug: string
	}
}

export async function GET(
	request: NextRequest,
	context: Context
) {
	try {
		const data = await getPost(context.params.slug)

		// removes 'content' key
		const dataCopy: Partial<typeof data> = { ...data }
		delete dataCopy.content
		const result = dataCopy as PostMetadata

		return NextResponse.json(result)
	} catch (error) {
		if (error instanceof NetworkError.BaseError) {
			return new NextResponse(null, {
				status: error.status,
			})
		}
	}
}
