import { readdir } from "fs/promises"
import { resolve } from "path"
import { NextRequest, NextResponse } from "next/server"
import { CONTENT_BASE_PATH } from "../constants"
import { getPostFull } from "../[slug]/api/route"
import * as NetworkError from "~/app/errors/network"
import { toNextResponse } from "~/app/errors/nextjs"

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
		if (error instanceof NetworkError.Base) {
			return toNextResponse(error)
		}
	}
}

export async function getPostList(params: {
	offset: number
	limit: number
}) {
	const data = await getSlugList()
	try {
		const pageSlugs = data.slice(
			params.offset,
			params.offset + params.limit
		)

		return await Promise.all(
			pageSlugs.map((fileName) => getPostFull(fileName))
		)
	} catch (error) {
		if (error instanceof NetworkError.Base) {
			const generalError = new NetworkError.ServerError(
				`Fetching data from posts`
			)
			generalError.cause = error
			throw generalError
		}
		throw error
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
		return data
	} catch (error) {
		throw new NetworkError.ServerError(
			error instanceof Error ? error.message : undefined
		)
	}
}
