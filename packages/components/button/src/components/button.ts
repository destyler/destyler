import type { PropType, SlotsType, VNode } from 'vue'
import { defineComponent, h, mergeProps, onMounted, ref } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { isButton } from '../utils'

export const buttonProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'button',
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
} as const

export type ButtonProps = ExtractPublicPropTypes<typeof buttonProps>

export const butttonEmit = {
  click: (_event: MouseEvent) => true,
}

export const Button = defineComponent({
  name: 'DestylerButton',
  inheritAttrs: false,
  props: buttonProps,
  emits: butttonEmit,
  slots: Object as SlotsType<{
    default: () => VNode[]
  }>,
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
      isNativeButton.value = currentElement.value.tagName === null ? false : isButton(currentElement.value)
      isNativeInput.value = currentElement.value.tagName.toLowerCase() === 'input'
      isNativeLink.value = currentElement.value.tagName.toLowerCase() === 'a' || currentElement.value.getAttribute('href') != null
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
    return h(Primitive, mergeProps(this.$attrs, {
      'ref': this.forwardRef,
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'type': this.isNativeButton && !this.isNativeInput ? 'button' : undefined,
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
