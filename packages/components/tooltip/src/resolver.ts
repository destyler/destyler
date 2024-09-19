import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const tooltipComponentName = [
  'TooltipArrow',
  'TooltipContent',
  'TooltipPortal',
  'TooltipProvider',
  'TooltipRoot',
  'TooltipTrigger',
]

export function TooltipResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (tooltipComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
