import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const countdownComponentName = [
  'Countdown',
]

export function CountdownResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (countdownComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
