import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export function DestylerAccordionResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name === 'DestylerCollapse' || name === 'DestylerCollapseItem')
        return { name, from: packageName }
    },
  }
}
