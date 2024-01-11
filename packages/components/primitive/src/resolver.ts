import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export function DestylerPrimitiveResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name === 'DestylerPrimitive' || name === 'DestylerSlot')
        return { name, from: packageName }
    },
  }
}
