import type { SlotsType, VNode } from 'vue'
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
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
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
        '--destyler_menubar_content_transform_origin': 'var(--destyler_popper_transform_origin)',
        '--destyler_menubar_content_available_width': 'var(--destyler_popper_available_width)',
        '--destyler_menubar_content_available_height': 'var(--destyler_popper_available_height)',
        '--destyler_menubar_trigger_width': 'var(--destyler_popper_anchor_width)',
        '--destyler_menubar_trigger_height': 'var(--destyler_popper_anchor_height)',
      },
      'onKeydown': withModifiers((event: any) => {
        this.handleArrowNavigation(event)
      }, ['arrow-right']),
    }), () => this.$slots.default?.())
  },
})
