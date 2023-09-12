import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export function DestylerMenuResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name === 'DestylerMenuRoot' || name === 'DestylerMenuItems' || name === 'DestylerMenuItem')
        return { name, from: packageName }
    },
  }
}
