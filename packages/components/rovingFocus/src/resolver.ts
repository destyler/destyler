import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const rovingFocusGroupComponentName = [
  'DestylerRovingFocusGroup',
  'DestylerRovingFocusItem',
]

export function DestylerRovingFocusGroupResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (rovingFocusGroupComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
