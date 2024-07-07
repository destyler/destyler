import type { PropType, SlotsType, VNode } from 'vue'
import { computed, defineComponent, h, mergeProps } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectPaginationRootContext } from './root'

export const paginationListItemProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'button',
  },
  value: {
    type: Number as PropType<number>,
    required: true,
  },
} as const

export type PaginationListItemProps = ExtractPublicPropTypes<typeof paginationListItemProps>

export const PaginationListItem = defineComponent({
  name: 'DestylerPaginationListItem',
  props: paginationListItemProps,
  slots: Object as SlotsType<{
      default: () => VNode[]
    }>,
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
    return h(Primitive, mergeProps(this.$props, {
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
