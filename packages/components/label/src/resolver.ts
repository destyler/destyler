import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const labelComponentName = [
  'DestylerLabel',
]

export function DestylerLabelResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (labelComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
