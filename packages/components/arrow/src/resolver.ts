import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const arrowComponentName = [
  'DestylerArrow',
]

export function DestylerArrowResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (arrowComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
