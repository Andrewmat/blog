import { getServerSession } from "next-auth/next"
import { NextRequest } from "next/server"
import { authOptions } from "./[...next-auth]/route"
import { NetworkError } from "~/errors/network"
import { toNextResponse } from "~/errors/nextjs"

export default async function checkAuthServer() {
	const session = await getServerSession(authOptions)
	if (session) {
		return { session }
	}

	return {
		error: toNextResponse(
			new NetworkError.UnauthorizedError(
				"User is unauthorized"
			)
		),
	}
}
