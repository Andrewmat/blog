"use server"
import { readdir } from "fs/promises"
import { resolve } from "path"
import { NextRequest, NextResponse } from "next/server"
import { compileMDX } from "next-mdx-remote/rsc"
import { CONTENT_BASE_PATH } from "../constants"
import { getContent } from "../[slug]/api/route"

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
	console.log({ context })
	const limit = (() => {
		const value = Number(context.params?.limit)
		return isNaN(value) ? 5 : value
	})()
	const offset = (() => {
		const value = Number(context.params?.offset)
		return isNaN(value) ? 0 : value
	})()
	const { data, status } = await getPostList({
		limit,
		offset,
	})
	if (status !== 200) {
		return new NextResponse(null, { status })
	}
	return NextResponse.json(data)
}

export async function getPostList(params: {
	offset: number
	limit: number
}) {
	const { data, status } = await getSlugList()
	if (status !== 200 || data == null) {
		return { data: undefined, status }
	}
	try {
		const pageSlugs = data.slice(
			params.offset,
			params.offset + params.limit
		)
		const sources = (
			await Promise.all(
				pageSlugs.map((slug) => getContent(slug))
			)
		).map(
			(content) =>
				content.data as NonNullable<typeof content.data>
		)

		const meta = (
			await Promise.all(
				sources.map((source) =>
					compileMDX<{
						title?: string
						published?: boolean
						published_at?: string
						flavor_text?: string
					}>({
						source,
						options: {
							parseFrontmatter: true,
						},
					})
				)
			)
		).map((r, i) => {
			return {
				...r.frontmatter,
				slug: pageSlugs[i],
			}
		})

		return {
			data: meta,
			status: 200,
		}
	} catch (err) {
		return {
			data: undefined,
			status: 500,
			statusText: err?.message as string | undefined,
		}
	}
}

export async function getSlugList() {
	try {
		const dir = await readdir(resolve(CONTENT_BASE_PATH))
		const data = dir
			.filter((file) => {
				const extension = file.split(".").at(-1)
				return extension === "mdx"
			})
			.map((file) => {
				return file.split(".").slice(0, -1).join(".")
			})
		return { data, status: 200 }
	} catch (err) {
		return {
			data: undefined,
			status: 500,
		}
	}
}
