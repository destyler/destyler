import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const modalComponentName = [
  'ModalAction',
  'ModalCancel',
  'ModalContent',
  'ModalDescription',
  'ModalOverlay',
  'ModalPortal',
  'ModalRoot',
  'ModalTitle',
  'ModalTrigger',
]

export function ModalResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (modalComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
