import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const linkComponentName = [
  'DestylerLink',
]

export function DestylerLinkResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (linkComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
