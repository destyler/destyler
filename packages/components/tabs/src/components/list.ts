import type { Component, PropType } from 'vue'
import { defineComponent, h, toRefs } from 'vue'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerRovingFocusGroup } from '@destyler/roving-focus'
import { DestylerPrimitive } from '@destyler/primitive'

import { injectTabsRootContext } from './root'

export const destylerTabsListProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'div',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  loop: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
} as const

export type DestylerTabsListProps = ExtractPublicPropTypes<typeof destylerTabsListProps>

export const DestylerTabsList = defineComponent({
  name: 'DestylerTabsList',
  props: destylerTabsListProps,
  setup(props) {
    const { loop } = toRefs(props)

    const { forwardRef, currentElement } = useForwardExpose()
    const context = injectTabsRootContext()

    context.tabsList = currentElement

    return {
      forwardRef,
      loop,
      context,
    }
  },
  render() {
    return h(DestylerRovingFocusGroup, {
      asChild: true,
      loop: this.loop,
      dir: this.context.dir.value,
      orientation: this.context.orientation.value,
    }, {
      default: () => {
        return h(DestylerPrimitive, {
          'ref': 'forwardRef',
          'role': 'tablist',
          'asChild': this.$props.asChild,
          'as': this.$props.as,
          'aria-orientation': this.context.orientation.value,
        }, {
          default: () => this.$slots.default?.(),
        })
      },
    })
  },
})
