import { ReactElement } from "react"

export type PostSourceMetadata = {
	title?: string
	published?: boolean
	published_at?: string
	flavor_text?: string
	content?: string
}

export type PostMetadata = {
	title: string | undefined
	flavorText: string | undefined
	published: boolean
	publishedAt: Date | undefined
}

export type PostContent = {
	content: ReactElement
}

type PostSlug = {
	slug: string
}

export type PostData = PostContent & PostMetadata & PostSlug
