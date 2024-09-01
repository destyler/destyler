import { defineComponent, h, mergeProps, withModifiers } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useCollection, useForwardExpose, useForwardPropsEmits } from '@destyler/composition'
import { wrapArray } from '@destyler/shared'
import { MenuSubContent, menuSubContentProps } from '@destyler/menu'
import { menuSubContentEmits } from '@destyler/menu/component'

import { injectMenubarRootContext } from './root'
import { injectMenubarMenuContext } from './menu'

const SIDE_OPTIONS = ['top', 'right', 'bottom', 'left'] as const
const ALIGN_OPTIONS = ['start', 'center', 'end'] as const

export type Side = (typeof SIDE_OPTIONS)[number]
export type Align = (typeof ALIGN_OPTIONS)[number]

export const menubarSubContentProps = {
  ...menuSubContentProps,
} as const

export type MenubarSubContentProps = ExtractPublicPropTypes<typeof menubarSubContentProps>

export const menubarSubContentEmits = {
  ...menuSubContentEmits,
}

export const MenubarSubContent = defineComponent({
  name: 'DestylerMenubarSubContent',
  props: menubarSubContentProps,
  emits: menubarSubContentEmits,
  setup(props, { emit }) {
    const forwarded = useForwardPropsEmits(props, emit)
    useForwardExpose()

    const { injectCollection } = useCollection('menubar')

    const rootContext = injectMenubarRootContext()
    const menuContext = injectMenubarMenuContext()
    const collections = injectCollection()

    function handleArrowNavigation(event: KeyboardEvent) {
      const target = event.target as HTMLElement
      const targetIsSubTrigger = target.hasAttribute(
        'data-destyler-menubar-subtrigger',
      )

      if (targetIsSubTrigger)
        return

      let candidateValues = collections.value.map(i => i.dataset.value)

      const currentIndex = candidateValues.indexOf(menuContext.value)

      candidateValues = rootContext.loop.value
        ? wrapArray(candidateValues, currentIndex + 1)
        : candidateValues.slice(currentIndex + 1)

      const [nextValue] = candidateValues
      if (nextValue)
        rootContext.onMenuOpen(nextValue)
    }

    return {
      forwarded,
      handleArrowNavigation,
    }
  },
  render() {
    return h(MenuSubContent, mergeProps(this.forwarded, {
      'data-destyler-menubar-content': '',
      'style': {
        '--destyler-menubar-content-transform-origin': 'var(--destyler-popper-transform-origin)',
        '--destyler-menubar-content-available-width': 'var(--destyler-popper-available-width)',
        '--destyler-menubar-content-available-height': 'var(--destyler-popper-available-height)',
        '--destyler-menubar-trigger-width': 'var(--destyler-popper-anchor-width)',
        '--destyler-menubar-trigger-height': 'var(--destyler-popper-anchor-height)',
      },
      'onKeydown': withModifiers((event: any) => {
        this.handleArrowNavigation(event)
      }, ['arrow-right']),
    }), () => this.$slots.default?.())
  },
})
