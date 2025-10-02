import type {Loader} from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders'
import { docsSchema } from '@astrojs/starlight/schema'
import { glob  } from 'astro/loaders'
import { defineCollection } from 'astro:content'

const packageComponentsDocs = glob({
  base: '../packages/components',
  pattern: '**/docs/*.mdx',
  generateId: ({ entry }) => {
    const parts = entry.split('/')
    const fileName = parts.at(-1) ?? entry
    const slug = fileName.replace(/\.mdx$/i, '')
    return `components/${slug}`
  },
})

function mergeLoaders(...loaders: Loader[]): Loader {
  return {
    name: 'destyler-merged-docs-loader',
    async load(context) {
      const results = await Promise.all(loaders.map(loader => loader.load(context)))
      return results.flat()
    },
  }
}

export const collections = {
  docs: defineCollection({
    loader: mergeLoaders(docsLoader(), packageComponentsDocs),
    schema: docsSchema(),
  }),
}
