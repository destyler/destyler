import type { Component, PropType } from 'vue'
import { computed, defineComponent, h, mergeProps } from 'vue'
import { type AsTag, DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectPaginationRootContext } from './root'

export const destylerPaginationListItemProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'button',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  value: {
    type: Number as PropType<number>,
    required: true,
  },
} as const

export type DestylerPaginationListItemProps = ExtractPublicPropTypes<typeof destylerPaginationListItemProps>

export const DestylerPaginationListItem = defineComponent({
  name: 'DestylerPaginationListItem',
  props: destylerPaginationListItemProps,
  setup(props) {
    useForwardExpose()

    const rootContext = injectPaginationRootContext()
    const isSelected = computed(() => rootContext.page.value === props.value)

    return {
      rootContext,
      isSelected,
    }
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$props, {
      'data-type': 'page',
      'aria-label': `Page ${this.$props.value}`,
      'aria-current': this.isSelected ? 'page' : undefined,
      'data-selected': this.isSelected ? 'true' : undefined,
      'disabled': this.rootContext.disabled.value,
      'type': this.$props.as === 'button' ? 'button' : undefined,
      'onClick': () => {
        this.rootContext.onPageChange(this.$props.value)
      },
    }), {
      default: () => {
        return this.$slots.default ? this.$slots.default?.() : this.$props.value
      },
    })
  },
})
