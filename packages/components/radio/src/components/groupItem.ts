import type { Component, ComputedRef, PropType } from 'vue'
import { computed, defineComponent, h, mergeProps, ref } from 'vue'
import type { AsTag } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { createContext } from '@destyler/shared'
import { useCustomElement } from '@destyler/composition'
import { useEventListener } from '@vueuse/core'
import { DestylerRovingFocusItem } from '@destyler/roving-focus'

import { injectRadioGroupRootContext } from './groupRoot'
import { DestylerRadio } from './radio'

export const destylerRadioGroupItemProps = {
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
  id: {
    type: String as PropType<string>,
    required: false,
  },
  value: {
    type: String as PropType<string>,
    required: false,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  required: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  name: {
    type: String as PropType<string>,
    required: false,
  },
} as const

export type DestylerRadioGroupItemProps = ExtractPublicPropTypes<typeof destylerRadioGroupItemProps>

export interface RadioGroupItemContext {
  disabled: ComputedRef<boolean>
  checked: ComputedRef<boolean>
}

export const [injectRadioGroupItemContext, provideRadiogroupItemContext] = createContext<RadioGroupItemContext>('DestylerRadioGroupItem')

export const DestylerRadioGroupItem = defineComponent({
  name: 'DestylerRadioGroupItem',
  inheritAttrs: false,
  props: destylerRadioGroupItemProps,
  setup(props) {
    const { customElement, currentElement } = useCustomElement()

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
      customElement,
      rootContext,
      handleFocus,
    }
  },
  render() {
    return h(DestylerRovingFocusItem, {
      asChild: true,
      checked: this.checked,
      disabled: this.disabled,
      focusable: !this.disabled,
      active: this.checked,
    }, h(DestylerRadio, mergeProps(this.$attrs, this.$props, {
      'ref': 'customElement',
      'checked': this.checked,
      'required': this.required,
      'onUpdate:checked': () => {
        this.rootContext.changeModelValue(this.$props.value)
      },
      'onFocus': () => {
        this.handleFocus()
      },
    }), {
      default: () => this.$slots.default?.(),
    }))
  },
})
