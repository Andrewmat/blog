"use server"
import { readdir } from "fs/promises"
import { CONTENT_BASE_PATH } from "./constants"
import { resolve } from "path"

export async function getSlugList() {
	try {
		const dir = await readdir(resolve(CONTENT_BASE_PATH))
		return dir
			.filter((file) => {
				const extension = file.split(".").at(-1)
				return extension === "mdx"
			})
			.map((file) => {
				return file.split(".").slice(0, -1).join(".")
			})
	} catch (err) {
		console.log(err)
	}
}
