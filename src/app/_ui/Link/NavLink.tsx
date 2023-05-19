import PureNavLink, {
	NavLinkProps as PureNavLinkProps,
} from "./NavLink.pure"

type NavLinkProps = Omit<
	PureNavLinkProps,
	"className" | "classNameActive" | "children"
> & {
	children: React.ReactNode
}

export default function NavLink(props: NavLinkProps) {
	return (
		<PureNavLink
			{...props}
			className="text-blue-700 underline hover:text-blue-900"
			classNameActive="text-gray-800 hover:text-black no-underline"
		/>
	)
}
