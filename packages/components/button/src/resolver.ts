import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const buttonComponentName = [
  'Button',
]

export function ButtonResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (buttonComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
