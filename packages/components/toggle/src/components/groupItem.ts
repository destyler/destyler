import type { PropType } from 'vue'
import { computed, defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { DestylerRovingFocusItem } from '@destyler/roving-focus'
import { DestylerPrimitive } from '@destyler/primitive'

import { DestylerToggle, destylerToggleProps } from './toggle'
import { injectToggleGroupRootContext } from './groupRoot'

export const destylerToggleGroupItemProps = {
  ...destylerToggleProps,
  value: {
    type: String as PropType<string>,
    required: true,
  },
} as const

export type DestylerToggleGroupItemProps = ExtractPublicPropTypes<typeof destylerToggleGroupItemProps>

export const DestylerToggleGroupItem = defineComponent({
  name: 'DestylerToggleGroupItem',
  props: destylerToggleGroupItemProps,
  setup(props) {
    const rootContext = injectToggleGroupRootContext()
    const disabled = computed(() => rootContext.disabled?.value || props.disabled)
    const pressed = computed(() => rootContext.modelValue.value?.includes(props.value))

    const { forwardRef } = useForwardExpose()

    return {
      rootContext,
      disabled,
      pressed,
      forwardRef,
    }
  },
  render() {
    return h(this.rootContext.rovingFocus.value ? DestylerRovingFocusItem : DestylerPrimitive, {
      asChild: true,
      focusable: !this.disabled,
      active: this.pressed,
    }, () => h(DestylerToggle, mergeProps(this.$props, {
      'ref': (el: any) => this.forwardRef(el),
      'disabled': this.disabled,
      'pressed': this.rootContext.type === 'single' ? this.rootContext.modelValue.value === this.$props.value : this.rootContext.modelValue.value?.includes(this.$props.value),
      'onUpdate:pressed': () => {
        this.rootContext.changeModelValue(this.$props.value)
      },
    }), () => this.$slots.default?.()))
  },
})
