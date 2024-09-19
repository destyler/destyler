import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const rovingFocusGroupComponentName = [
  'RovingFocusGroup',
  'RovingFocusItem',
]

export function RovingFocusGroupResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (rovingFocusGroupComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
