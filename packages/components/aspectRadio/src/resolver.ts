import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const aspectRadioComponentName = [
  'DestylerAspectRadio',
]

export function DestylerAspectRadioResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (aspectRadioComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
