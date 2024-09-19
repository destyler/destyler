import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const radioComponentName = [
  'RadioGroupRoot',
  'RadioGroupItem',
  'RadioGroupindicator',
]

export function RadioResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (radioComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
