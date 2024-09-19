import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const labelComponentName = [
  'Label',
]

export function LabelResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (labelComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
