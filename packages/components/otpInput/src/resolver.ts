import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const otpInputComponentName = [
  'OtpInput',
  'OtpInputRoot',
]

export function OtpInputRootResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (otpInputComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
