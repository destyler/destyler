import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const dialogComponentName = [
  'DestylerDialogClose',
  'DestylerDialogContent',
  'DestylerDialogDescription',
  'DestylerDialogOverlay',
  'DestylerDialogPortal',
  'DestylerDialogRoot',
  'DestylerDialogTitle',
  'DestylerDialogTrigger',
]

export function DestylerDialogResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (dialogComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
