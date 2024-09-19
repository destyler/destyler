import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const qrCodeComponentName = [
  'QrCodeItem',
  'QrCodeRoot',
]

export function QrCodeResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (qrCodeComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
