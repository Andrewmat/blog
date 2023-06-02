import { NextResponse } from "next/server"
import { Base, NotFoundError } from "./network"
import { notFound } from "next/navigation"

export function toNextResponse(error: Base) {
	return new NextResponse(
		JSON.stringify({
			message: error.message,
			cause: error.cause,
			status: error.status,
			statusText: error.statusText,
			stack: error.stack,
		}),
		{
			status: error.status,
			statusText: error.statusText,
		}
	)
}

export async function treatNotFound<Response>(
	promise: Promise<Response>
) {
	try {
		return await promise
	} catch (error) {
		if (error instanceof NotFoundError) {
			notFound()
		} else {
			throw error
		}
	}
}
