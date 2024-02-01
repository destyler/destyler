import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const tooltipComponentName = [
  'DestylerTooltipArrow',
  'DestylerTooltipContent',
  'DestylerTooltipPortal',
  'DestylerTooltipProvider',
  'DestylerTooltipRoot',
  'DestylerTooltipTrigger',
]

export function DestylerTooltipResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (tooltipComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
