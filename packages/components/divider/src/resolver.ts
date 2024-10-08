import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const dividerComponentName = [
  'Divider',
]

export function DividerResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (dividerComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
