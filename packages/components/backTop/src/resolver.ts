import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const backTopComponentName = [
  'DestylerBackTop',
]

export function DestylerBackTopResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (backTopComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
