import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export function DestylerCollapseResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (['DestylerCollapseRoot', 'DestylerCollapseTrigger', 'DestylerCollapseItem', 'DestylerCollapseHeader', 'DestylerCollapseContent'].includes(name))
        return { name, from: packageName }
    },
  }
}
