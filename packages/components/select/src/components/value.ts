import type { PropType } from 'vue'
import { defineComponent, h, onBeforeMount, onMounted } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import { renderSlotFragments } from '@destyler/shared'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { shouldShowPlaceholder } from '../utils'
import { injectSelectRootContext } from './root'

export const selectValueProps = {
  ...primitiveProps,
  /**
   * @default span
   */
  as: {
    ...primitiveProps.as,
    default: 'span',
  },
  /**
   * The content that will be rendered inside the `SelectValue` when no `value` or `defaultValue` is set.
   *
   * @default ""
   */
  placeholder: {
    type: String as PropType<string>,
    required: false,
    default: '',
  },
} as const

export type SelectValueProps = ExtractPublicPropTypes<typeof selectValueProps>

export const SelectValue = defineComponent({
  name: 'DestylerSelectValue',
  props: selectValueProps,
  setup(_, { slots }) {
    const { forwardRef, currentElement } = useForwardExpose()

    const rootContext = injectSelectRootContext()

    onBeforeMount(() => {
      const hasChildren = !!renderSlotFragments(slots?.default?.()).length
      rootContext.onValueElementHasChildrenChange(hasChildren)
    })

    onMounted(() => {
      rootContext.valueElement = currentElement
    })

    return {
      rootContext,
      forwardRef,
    }
  },
  render() {
    return h(Primitive, {
      ref: this.forwardRef,
      as: this.$props.as,
      asChild: this.$props.asChild,
      style: {
        pointerEvents: 'none',
      },
    }, () => [shouldShowPlaceholder(this.rootContext.modelValue?.value) ? this.$props.placeholder : this.$slots.default?.()])
  },
})
