import { compileMDX } from "next-mdx-remote/rsc"
import rehypeHighlight from "rehype-highlight"
import components from "~/app/_ui/mdx"
import {
	PostContent,
	PostMetadata,
	PostSourceMetadata,
} from "./type"

export default async function compilePostText(
	source: string
): Promise<PostContent & PostMetadata> {
	const parsed = await compileMDX<PostSourceMetadata>({
		source,
		components,
		options: {
			parseFrontmatter: true,
			mdxOptions: {
				rehypePlugins: [rehypeHighlight],
			},
		},
	})

	return {
		content: parsed.content,
		title: parsed.frontmatter.title,
		flavorText: parsed.frontmatter.flavor_text,
		published: parsed.frontmatter.published ?? false,
		publishedAt: parsed.frontmatter.published_at
			? new Date(parsed.frontmatter.published_at)
			: undefined,
	}
}
