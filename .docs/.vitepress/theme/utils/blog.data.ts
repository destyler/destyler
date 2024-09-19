import { createContentLoader } from 'vitepress'

interface Blog {
  url: string
  title: string
  og: string
  type: string
  date: string
  duration: string
  authors: string[]
  frontmatter: any
}

declare const data: Blog[]
export { data }

export default createContentLoader('blog/*.md', {
  excerpt: true,
  transform(raw): Blog[] {
    return raw
      .map(({ url, frontmatter }) => ({
        url,
        title: frontmatter.title,
        og: frontmatter.og,
        type: frontmatter.type,
        date: frontmatter.date,
        duration: frontmatter.desc,
        authors: frontmatter.author,
        frontmatter,
      }))
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))
      .filter(i => !i.url.endsWith('.html'))
  },
})
