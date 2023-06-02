import { ReactElement } from "react"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { NextResponse, NextRequest } from "next/server"
import { compileMDX } from "next-mdx-remote/rsc"
import * as NetworkError from "~/app/errors/network"
import components from "~/app/_ui/mdx"
import { CONTENT_BASE_PATH } from "../../constants"

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
		const data = await getPostFull(context.params.slug)

		// removes 'content' key
		const dataCopy: Partial<typeof data> = { ...data }
		delete dataCopy.content
		const result = dataCopy as PostMetadata

		return NextResponse.json(result)
	} catch (error) {
		if (error instanceof NetworkError.Base) {
			return new NextResponse(null, {
				status: error.status,
			})
		}
	}
}

type PostMetadata = {
	slug: string
	title: string | undefined
	flavorText: string | undefined
	published: boolean
	publishedAt: Date | undefined
}

type PostContent = {
	content: ReactElement
}

type PostFull = PostContent & PostMetadata

export async function getPostFull(
	fileName: string
): Promise<PostFull> {
	const data = await getContent(fileName)
	if (data == null) {
		throw new NetworkError.ServerError("Undefined data")
	}

	const parsed = await compileMDX<{
		title?: string
		published?: boolean
		published_at?: string
		flavor_text?: string
	}>({
		source: data,
		components,
		options: {
			parseFrontmatter: true,
		},
	})

	return {
		slug: fileName,
		content: parsed.content,
		title: parsed.frontmatter.title,
		flavorText: parsed.frontmatter.flavor_text,
		published: parsed.frontmatter.published ?? false,
		publishedAt: parsed.frontmatter.published_at
			? new Date(parsed.frontmatter.published_at)
			: undefined,
	}
}

export async function getContent(fileName: string) {
	const filePath = `${resolve(
		CONTENT_BASE_PATH,
		fileName
	)}.mdx`
	try {
		const file = await readFile(filePath)
		return file.toString("utf-8")
	} catch (err) {
		// Node SystemError
		if (
			err != null &&
			typeof err == "object" &&
			"code" in err
		) {
			if (err.code === "ENOENT") {
				throw new NetworkError.NotFoundError(
					`Cannot found content for file ${fileName}`
				)
			}
			throw new NetworkError.ServerError()
		}
		throw new NetworkError.ServerError()
	}
}
