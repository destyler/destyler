import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const dropdownComponentName = [
  'DestylerTemplate',
]

export function DestylerTemplateResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (dropdownComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
