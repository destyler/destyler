import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const checkboxComponentName = [
  'CheckboxRoot',
  'CheckboxIndicator',
]

export function CheckboxResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (checkboxComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
