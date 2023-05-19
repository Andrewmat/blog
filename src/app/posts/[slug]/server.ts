"use server"

import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { CONTENT_BASE_PATH } from "../constants"

export async function getContent(fileName: string) {
	const filePath = `${resolve(
		CONTENT_BASE_PATH,
		fileName
	)}.mdx`
	try {
		const file = await readFile(filePath)
		return file.toString("utf-8")
	} catch (err) {
		console.log(err)
	}
}
