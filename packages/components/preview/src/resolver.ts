import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const previewComponentName = [
  'DestylerPreviewRoot',
  'DestylerPreviewDialog',
]

export function DestylerPreviewResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name === 'DestylerTemplate')
        return { name, from: packageName }
    },
  }
}
