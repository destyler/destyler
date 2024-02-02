import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const radioComponentName = [
  'DestylerRadioGroupRoot',
  'DestylerRadioGroupItem',
  'DestylerRadioGroupindicator',
]

export function DestylerRadioResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (radioComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
