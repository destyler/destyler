import type { PropType } from 'vue'
import { computed, defineComponent, h, mergeProps } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { RovingFocusItem } from '@destyler/roving-focus'
import { Primitive } from '@destyler/primitive'

import { Toggle, toggleProps } from './toggle'
import { injectToggleGroupRootContext } from './groupRoot'

export const toggleGroupItemProps = {
  ...toggleProps,
  /**
   * A string value for the toggle group item. All items within a toggle group should use a unique value.
   */
  value: {
    type: String as PropType<string>,
    required: true,
  },
} as const

export type ToggleGroupItemProps = ExtractPublicPropTypes<typeof toggleGroupItemProps>

export const ToggleGroupItem = defineComponent({
  name: 'ToggleGroupItem',
  props: toggleGroupItemProps,
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
    return h(this.rootContext.rovingFocus.value ? RovingFocusItem : Primitive, {
      asChild: true,
      focusable: !this.disabled,
      active: this.pressed,
    }, () => h(Toggle, mergeProps(this.$props, {
      'ref': (el: any) => this.forwardRef(el),
      'disabled': this.disabled,
      'pressed': this.rootContext.type === 'single' ? this.rootContext.modelValue.value === this.$props.value : this.rootContext.modelValue.value?.includes(this.$props.value),
      'onUpdate:pressed': () => {
        this.rootContext.changeModelValue(this.$props.value)
      },
    }), () => this.$slots.default?.()))
  },
})
