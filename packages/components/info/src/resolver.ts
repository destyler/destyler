import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const infoComponentName = [
  'DestylerInfoRoot',
  'DestylerInfoClose',
]

export function DestylerInfoResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (infoComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
