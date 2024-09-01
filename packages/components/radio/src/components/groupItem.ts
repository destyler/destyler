import type { ComputedRef } from 'vue'
import { computed, defineComponent, h, mergeProps, ref, withKeys } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { useEventListener } from '@vueuse/core'
import { RovingFocusItem } from '@destyler/roving-focus'

import { injectRadioGroupRootContext } from './groupRoot'
import { Radio, radioProps } from './radio'

export const radioGroupItemProps = {
  asChild: {
    ...radioProps.asChild,
  },
  as: {
    ...radioProps.as,
  },
  /**
   * The name of the input fields in the radio (Useful for form submission).
   */
  id: {
    ...radioProps.id,
  },
  /**
   * The value given as data when submitted with a `name`.
   */
  value: {
    ...radioProps.value,
  },
  /**
   * When `true`, prevents the user from interacting with the radio item.
   */
  disabled: {
    ...radioProps.disabled,
  },
  /**
   * When `true`, indicates that the user must check the radio item before the owning form can be submitted.
   */
  required: {
    ...radioProps.required,
  },
  /**
   * The name of the input fields in the radio (Useful for form submission).
   */
  name: {
    ...radioProps.name,
  },
} as const

export type RadioGroupItemProps = ExtractPublicPropTypes<typeof radioGroupItemProps>

export interface RadioGroupItemContext {
  disabled: ComputedRef<boolean>
  checked: ComputedRef<boolean>
}

export const [injectRadioGroupItemContext, provideRadiogroupItemContext] = createContext<RadioGroupItemContext>('RadioGroupItem')

export const RadioGroupItem = defineComponent({
  name: 'RadioGroupItem',
  inheritAttrs: false,
  props: radioGroupItemProps,
  setup(props) {
    const { forwardRef, currentElement } = useForwardExpose()

    const rootContext = injectRadioGroupRootContext()

    const disabled = computed(() => rootContext.disabled.value || props.disabled)
    const required = computed(() => rootContext.required.value || props.required)
    const checked = computed(() => rootContext.modelValue?.value === props.value)

    provideRadiogroupItemContext({ disabled, checked })

    const isArrowKeyPressed = ref(false)
    const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']

    useEventListener('keydown', (event) => {
      if (ARROW_KEYS.includes(event.key))
        isArrowKeyPressed.value = true
    })
    useEventListener('keyup', () => {
      isArrowKeyPressed.value = false
    })

    function handleFocus() {
      setTimeout(() => {
        if (isArrowKeyPressed.value)
          currentElement.value?.click()
      }, 0)
    }

    return {
      checked,
      disabled,
      required,
      forwardRef,
      rootContext,
      handleFocus,
    }
  },
  render() {
    return h(RovingFocusItem, {
      asChild: true,
      checked: this.checked,
      disabled: this.disabled,
      focusable: !this.disabled,
      active: this.checked,
    }, () => h(Radio, mergeProps(this.$attrs, this.$props, {
      'ref': (el: any) => this.forwardRef(el),
      'checked': this.checked,
      'required': this.required,
      'onUpdate:checked': () => {
        this.rootContext.changeModelValue(this.$props.value)
      },
      'onKeydown': withKeys((event) => {
        event.preventDefault()
      }, ['enter']),
      'onFocus': () => {
        this.handleFocus()
      },
    }), () => this.$slots.default?.()))
  },
})
