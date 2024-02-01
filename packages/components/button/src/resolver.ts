import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const buttonComponentName = [
  'DestylerButton',
]

export function DestylerButtonResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (buttonComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
