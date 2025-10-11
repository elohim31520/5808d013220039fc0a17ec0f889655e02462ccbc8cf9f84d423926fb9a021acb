import fs from 'fs'
import path from 'path'
import { marked } from 'marked'
import matter from 'gray-matter'

const convertMarkdownToHtml = async (fileContent: string) => {
	return await marked(fileContent)
}

interface BlogPost {
	id: string
	title: string
	htmlContent: string
	excerpt?: string
	image?: string
	publishDate?: string
	author?: string
	categories?: string[]
	tags?: string[]
}

export default defineEventHandler(async (event) => {
	const blogPosts: BlogPost[] = []
	const postsDirectory = path.join(process.cwd(), 'blog', 'info', 'en')
	const files = await fs.promises.readdir(postsDirectory)

	for (const file of files) {
		if (file.endsWith('.md')) {
			const filePath = path.join(postsDirectory, file)
			const fileContent = await fs.promises.readFile(filePath, 'utf-8')

			const { data: meta, content } = matter(fileContent)

			const id = file.replace('.md', '')
			blogPosts.push({
				id,
				title: meta.title || id,
				htmlContent: await convertMarkdownToHtml(content),
				excerpt: meta.excerpt,
				image: meta.image || '/logo.webp',
				publishDate: meta.publishDate,
				author: meta.author,
				categories: meta.categories,
				tags: meta.tags,
			})
		}
	}
	return blogPosts
})
