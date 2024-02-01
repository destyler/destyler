import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const focusScopeComponentName = [
  'DestylerFocusScope',
]

export function DestylerFocusScopeResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (focusScopeComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
