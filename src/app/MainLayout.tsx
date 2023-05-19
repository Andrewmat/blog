"use client"
import { PropsWithChildren } from "react"
import NavLink from "./_ui/Link/NavLink"

export default function MainLayout({
	children,
}: PropsWithChildren) {
	return (
		<div id="Layout">
			<header>
				<span>Header</span>
				<br />
				<NavLink href="/">Home</NavLink>
			</header>
			<aside>
				<ul>
					<li>
						<NavLink
							href={{
								pathname: "/posts",
							}}
						>
							Archive
						</NavLink>
					</li>
					<li>
						<NavLink href="/about">About</NavLink>
					</li>
				</ul>
			</aside>
			<main>{children}</main>
			<footer>Footer</footer>
		</div>
	)
}
