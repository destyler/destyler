import type { PropType } from 'vue'
import { computed, defineComponent, h, mergeProps } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectPaginationRootContext } from './root'

export const destylerPaginationListItemProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'button',
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
    }), () => this.$slots.default ? this.$slots.default?.() : this.$props.value)
  },
})
