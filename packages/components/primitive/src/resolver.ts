import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const primitiveComponentName = [
  'DestylerPrimitive',
  'DestylerSlot',
]

export function DestylerPrimitiveResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (primitiveComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
