import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
	title: "Lionis Blog",
	description: "Blog by Lionis",
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="pt-BR">
			<body className={inter.className}>
				<div
					id="root"
					className="h-full w-full min-h-screen bg-violet-950 text-white saturate-50"
				>
					<header id="header" className="blog-center py-8">
						<h1 className="font-extrabold tracking-wider text-4xl">
							Lionis
						</h1>
					</header>
					{children}
				</div>
			</body>
		</html>
	)
}
