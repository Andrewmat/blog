import { NextResponse } from "next/server"
import { BaseError } from "./network"

export function toNextResponse(error: BaseError) {
	return NextResponse.json(
		{
			message: error.message,
			cause: error.cause,
			status: error.status,
			statusText: error.statusText,
			stack: error.stack,
		},
		{
			status: error.status,
			statusText: error.statusText,
		}
	)
}
