import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const dialogComponentName = [
  'DialogClose',
  'DialogContent',
  'DialogDescription',
  'DialogOverlay',
  'DialogPortal',
  'DialogRoot',
  'DialogTitle',
  'DialogTrigger',
]

export function DialogResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (dialogComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
