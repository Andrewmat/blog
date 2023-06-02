import { PropsWithChildren, cloneElement } from "react"

const components = {
	h2: joinClassName(
		<h2 className="text-lg font-bold my-4" />
	),
	p: joinClassName(<p className="my-4 text-lg" />),
	hr: joinClassName(
		<hr className="w-1/2 mx-auto border-rose-300/20 my-4 border-2" />
	),
	pre: joinClassName(
		<pre className="w-5/6 mx-auto my-8 bg-slate-900 px-6 py-4 rounded-md" />
	),
	blockquote: joinClassName(
		<blockquote className="border-l-8 border-l-gray-400 px-4 mt-4 bg-black/40 rounded-md flex" />
	),
}

export default components

function joinClassName(
	element: React.ReactElement<
		PropsWithChildren<{ className?: string }>
	>
) {
	type ElementProps =
		typeof element extends React.ReactElement<
			infer ElementProps extends PropsWithChildren<{
				className?: string
			}>
		>
			? ElementProps
			: never
	const Component = (props: ElementProps) => {
		const { className: customClassName } = props

		const preClassName = element.props.className
		return cloneElement(
			element,
			{
				className:
					preClassName || customClassName
						? [preClassName, customClassName].join(" ")
						: undefined,
			},
			props.children
		)
	}
	return Component
}
