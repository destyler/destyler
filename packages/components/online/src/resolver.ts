import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const onlineComponentName = [
  'DestylerOnline',
]

export function DestylerOnlineResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (onlineComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
