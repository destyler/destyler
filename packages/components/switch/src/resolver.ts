import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const switchComponentName = [
  'DestylerTemplate',
]

export function DestylerTemplateResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (switchComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
