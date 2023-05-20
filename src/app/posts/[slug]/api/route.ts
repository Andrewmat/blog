import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { CONTENT_BASE_PATH } from "../../constants"
import { NextResponse, NextRequest } from "next/server"

type Context = {
	params: {
		slug: string
	}
}

export async function GET(
	request: NextRequest,
	context: Context
) {
	const { data, status } = await getContent(
		context.params.slug
	)
	if (status !== 200) {
		return new NextResponse(null, { status })
	}
	return NextResponse.json(data)
}

export async function getContent(fileName: string) {
	const filePath = `${resolve(
		CONTENT_BASE_PATH,
		fileName
	)}.mdx`
	try {
		const file = await readFile(filePath)
		return { data: file.toString("utf-8"), status: 200 }
	} catch (err) {
		// Node SystemError
		if (
			err != null &&
			typeof err == "object" &&
			"code" in err
		) {
			if (err.code === "ENOENT") {
				return {
					data: undefined,
					status: 404,
				}
			}
			return {
				data: undefined,
				status: 500,
			}
		}
		throw new Error("500")
	}
}
