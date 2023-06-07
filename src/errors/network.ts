type NetworkErrorInterface = {
	status: number
	statusText: string
	message: string
}

class NetworkErrorBase
	extends Error
	implements NetworkErrorInterface
{
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
export type BaseError = NetworkErrorBase
export const BaseError = NetworkErrorBase

function networkError(
	key: keyof typeof mapStatusTextToStatusCode
) {
	return class NetworkError extends NetworkErrorBase {
		constructor(message?: string) {
			super(mapStatusTextToStatusCode[key], key, message)
		}
	}
}

const mapStatusTextToStatusCode = {
	Unauthorized: 400,
	"Not Found": 404,
	"Unprocessable Content": 422,
	"Internal Server": 500,
} as const

export const NetworkError = {
	BaseError: NetworkErrorBase,
	UnauthorizedError: networkError("Unauthorized"),
	NotFoundError: networkError("Not Found"),
	UnprocessableContentError: networkError(
		"Unprocessable Content"
	),
	InternalServerError: networkError("Internal Server"),
}

const mapStatusCodeToNetworkError = new Map([
	[400, NetworkError.UnauthorizedError],
	[404, NetworkError.NotFoundError],
	[422, NetworkError.UnprocessableContentError],
	[500, NetworkError.InternalServerError],
])

export function fromResponse(response: Response) {
	if (mapStatusCodeToNetworkError.has(response.status))
		return mapStatusCodeToNetworkError.get(response.status)

	return new NetworkErrorBase(
		response.status,
		response.statusText
	)
}
