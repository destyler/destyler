import type { PropType } from 'vue'
import { defineComponent, h, mergeProps, onMounted, ref } from 'vue'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { isButton } from '../utils'

export const destylerButtonProps = {
  ...destylerPrimitiveProps,
  as: {
    ...destylerPrimitiveProps.as,
    default: 'button',
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type DestylerButtonProps = ExtractPublicPropTypes<typeof destylerButtonProps>

export const DestylerButton = defineComponent({
  name: 'DestylerButton',
  inheritAttrs: false,
  props: destylerButtonProps,
  emits: ['click'],
  setup(props, { emit }) {
    const { forwardRef, currentElement } = useForwardExpose()

    function handleClick(e: MouseEvent) {
      if (!props.disabled)
        emit('click', e)
    }

    const isNativeButton = ref<boolean>()
    const isNativeInput = ref<boolean>()
    const isNativeLink = ref<boolean>()

    onMounted(() => {
      isNativeButton.value = !currentElement.value ? false : isButton(currentElement.value)
      isNativeInput.value = !currentElement.value ? false : currentElement.value.tagName.toLowerCase() === 'input'
      isNativeLink.value = !currentElement.value ? false : currentElement.value.tagName.toLowerCase() === 'a' || currentElement.value.getAttribute('href') != null
    })

    return {
      forwardRef,
      isNativeButton,
      isNativeLink,
      isNativeInput,
      handleClick,
    }
  },
  render() {
    return h(DestylerPrimitive, mergeProps(this.$attrs, {
      'ref': (el: any) => this.forwardRef(el),
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'disabled': this.isNativeButton || this.isNativeInput ? this.$props.disabled : undefined,
      'role': !this.isNativeButton || !this.isNativeLink ? 'button' : undefined,
      'tabindex': (!this.isNativeButton || !this.isNativeLink) && !this.$props.disabled ? 0 : undefined,
      'aria-disabled': !this.isNativeButton && !this.isNativeInput && this.$props.disabled ? true : undefined,
      'data-disabled': this.$props.disabled ? '' : undefined,
      'onClick': (e: any) => {
        this.handleClick(e)
      },
    }), {
      default: () => this.$slots.default?.(),
    })
  },
})
