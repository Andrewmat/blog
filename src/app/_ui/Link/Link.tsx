import NextLink, { LinkProps } from "next/link"

export function Link(props: LinkProps) {
	return <NextLink {...props} />
}

export type { LinkProps }
