import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const menubarComponentName = [
  'DestylerTemplate',
]

export function DestylerMenubarResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (menubarComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
