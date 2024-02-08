import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const toggleComponentName = [
  'DestylerToggle',
]

export function DestylerToggleResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (toggleComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
