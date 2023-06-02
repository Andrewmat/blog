class NetworkErrorBase extends Error {
	status: number
	statusText: string

	constructor(
		status: number,
		statusText: string,
		message?: string
	) {
		super(message)
		this.status = status
		this.statusText = statusText
	}
}
export type Base = NetworkErrorBase
export const Base = NetworkErrorBase

class NetworkErrorNotFound extends NetworkErrorBase {
	constructor(message?: string) {
		super(404, "Not Found", message)
	}
}
export type NotFoundError = NetworkErrorNotFound
export const NotFoundError = NetworkErrorNotFound

class NetworkErrorServer extends NetworkErrorBase {
	constructor(message?: string) {
		super(500, "Internal Server Error", message)
	}
}
export type ServerError = NetworkErrorServer
export const ServerError = NetworkErrorServer
