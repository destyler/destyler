import type { ComponentResolver } from 'unplugin-vue-components'

export function DestylerAccordionResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name === 'DestylerAccordionItem' || name === 'DestylerAccordionRoot')
        return { name, from: '@destyler/accordion' }
    },
  }
}
