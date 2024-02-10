import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const toolbarComponentName = [
  'DestylerTemplate',
]

export function DestylerToolbarResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (toolbarComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
