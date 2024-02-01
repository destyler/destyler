import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const modalComponentName = [
  'DestylerModalAction',
  'DestylerModalCancel',
  'DestylerModalContent',
  'DestylerModalDescription',
  'DestylerModalOverlay',
  'DestylerModalPortal',
  'DestylerModalRoot',
  'DestylerModalTitle',
  'DestylerModalTrigger',
]

export function DestylerTemplateResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (modalComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
