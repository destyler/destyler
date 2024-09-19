import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const collapseComponentName = [
  'CollapseRoot',
  'CollapseHeader',
  'CollapseContent',
  'CollapseItem',
  'CollapseTrigger',
]

export function CollapseResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (collapseComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
