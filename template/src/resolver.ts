import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const destylerComponentName = [
  'DestylerTemplate',
]

export function DestylerTemplateResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (destylerComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
