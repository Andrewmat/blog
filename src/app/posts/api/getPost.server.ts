// deals with node
import { readdir } from "node:fs/promises"
import { readFile } from "node:fs/promises"
import { resolve, join } from "node:path"
import { NetworkError } from "~/errors/network"

const CONTENT_BASE_PATH = join(".", "src", "content")

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
		throw new NetworkError.InternalServerError(
			error instanceof Error ? error.message : undefined
		)
	}
}

export async function getSlugContent(slug: string) {
	const filePath = `${resolve(CONTENT_BASE_PATH, slug)}.mdx`
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
					`Cannot found content for file ${slug}`
				)
			}
			throw new NetworkError.InternalServerError()
		}
		throw new NetworkError.InternalServerError()
	}
}
