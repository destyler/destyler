import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export function DestylerTemplateResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name === 'DestylerAlert')
        return { name, from: packageName }
    },
  }
}
