import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const progressComponentName = [
  'ProgressRoot',
  'ProgressIndicator',
]

export function ProgressResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (progressComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
