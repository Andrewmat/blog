"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"

type LinkProps = typeof Link extends React.ComponentType<
	infer Props
>
	? Props
	: never

export type NavLinkProps = Omit<LinkProps, "children"> & {
	classNameActive?: LinkProps["className"]
	children:
		| ((isActive: boolean) => LinkProps["children"])
		| LinkProps["children"]
}

export default function NavLink({
	className,
	classNameActive,
	children,
	...delegatedProps
}: NavLinkProps) {
	const pathname = usePathname()

	const isActive =
		typeof delegatedProps.href === "object"
			? pathname === delegatedProps.href.pathname
			: pathname === delegatedProps.href.split("?")[0]

	const finalClassName = isActive
		? classNameActive
		: className

	const finalChildren =
		typeof children === "function"
			? children(isActive)
			: children

	return (
		<Link {...delegatedProps} className={finalClassName}>
			{finalChildren}
		</Link>
	)
}
