import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const iconComponentName = [
  'DestylerIcon',
]

export function DestylerIconResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (iconComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
