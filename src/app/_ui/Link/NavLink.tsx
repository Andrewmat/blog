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
			className="text-rose-300 underline hover:text-rose-500"
			classNameActive="text-rose-300"
		/>
	)
}
