import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export function DestylerDialogResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name === 'DestylerDialog')
        return { name, from: packageName }
    },
  }
}
