import { docsSchema } from '@astrojs/starlight/schema'
import { glob } from 'astro/loaders'
import { defineCollection } from 'astro:content'

// Unified docs collection: site docs + component package docs.
export const collections = {
  docs: defineCollection({
    loader: glob({
      base: new URL('../../', import.meta.url), // monorepo root from document/src/
      pattern: [
        'document/src/content/**/*.mdx',
        'packages/components/**/docs/*.mdx',
      ],
      generateId: ({ entry }) => {
        const normalized = entry.replace(/\\/g, '/')
        if (normalized.startsWith('packages/components/')) {
          const file = normalized.split('/').at(-1) || ''
          return `components/${file.replace(/\.mdx$/i, '')}`
        }
        const prefix = 'document/src/content/'
        if (normalized.startsWith(prefix)) {
          return normalized.slice(prefix.length).replace(/\.mdx$/i, '')
        }
        return normalized.split('/').at(-1)?.replace(/\.mdx$/i, '') || normalized
      },
    }),
    schema: docsSchema(),
  }),
}
