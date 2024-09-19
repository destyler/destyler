import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const toastComponentName = [
  'ToastAction',
  'ToastClose',
  'ToastDescription',
  'ToastProvider',
  'ToastRoot',
  'ToastTitle',
  'ToastViewport',
]

export function ToastResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (toastComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
