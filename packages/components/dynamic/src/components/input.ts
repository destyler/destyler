import { type Component, type PropType, defineComponent, h, nextTick, onMounted, withDirectives } from 'vue'
import { type AsTag, DestylerPrimitive } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { BindOnceDirective } from '@destyler/directives'

import { injectDynamicRootContext } from './root'

export const destylerDynamicInputProps = {
  as: {
    type: [String, Object] as PropType<AsTag | Component>,
    required: false,
    default: 'input',
  },
  asChild: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  placeholder: {
    type: String as PropType<string>,
    required: false,
  },
  autoFocus: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  maxLength: {
    type: Number as PropType<number>,
    required: false,
  },
} as const

export type DestylerDynamicInputProps = ExtractPublicPropTypes<typeof destylerDynamicInputProps>

export const DestylerDynamicInput = defineComponent({
  name: 'DestylerDynamicInput',
  props: destylerDynamicInputProps,
  setup(props) {
    const context = injectDynamicRootContext()
    const { forwardRef, currentElement } = useForwardExpose()

    async function handleEnter(event: Event) {
      await nextTick()
      if (event.defaultPrevented)
        return

      const target = event.target as HTMLInputElement
      if (!target.value)
        return

      const isAdded = context.onAddValue(target.value)
      if (isAdded)
        target.value = ''

      event.preventDefault()
    }

    function handleInput(event: InputEvent) {
      context.isInvalidInput.value = false
      const delimiter = context.delimiter.value
      if (delimiter === event.data) {
        const target = event.target as HTMLInputElement
        target.value = target.value.replaceAll(delimiter, '')

        const isAdded = context.onAddValue(target.value)
        if (isAdded)
          target.value = ''
      }
    }

    function handlePaste(event: ClipboardEvent) {
      if (context.addOnPaste.value) {
        event.preventDefault()
        const clipboardData = event.clipboardData
        if (!clipboardData)
          return

        const value = clipboardData.getData('text')
        if (context.delimiter.value) {
          const splittedValue = value.split(context.delimiter.value)
          splittedValue.forEach((v) => {
            context.onAddValue(v)
          })
        }
        else {
          context.onAddValue(value)
        }
      }
    }

    onMounted(() => {
      const inputEl = currentElement.value.nodeName === 'INPUT'
        ? currentElement.value
        : currentElement.value.querySelector('input')

      if (!inputEl)
        return

      setTimeout(() => {
        if (props.autoFocus)
          inputEl?.focus()
      }, 1)
    })

    return {
      forwardRef,
      context,
      handleInput,
      handlePaste,
      handleEnter,
    }
  },
  render() {
    return withDirectives(h(DestylerPrimitive, {
      'ref': (el: any) => this.forwardRef(el),
      'type': 'text',
      'autocomplete': 'off',
      'autocorrect': 'off',
      'autocapitalize': 'off',
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'maxlength': this.$props.maxLength,
      'placeholder': this.$props.placeholder,
      'disabled': this.context.disabled.value,
      'data-invalid': this.context.isInvalidInput.value ? '' : undefined,
      'onInput': (event: any) => {
        this.handleInput(event)
      },
      'onPaste': (event: any) => {
        this.handlePaste(event)
      },
      'onKeydown': (event: any) => {
        if (event.key === 'Enter')
          this.handleEnter(event)
        else
          this.context.onInputKeydown(event)
      },

    }, () => this.$slots.default?.()), [
      [BindOnceDirective, { id: this.context.id?.value }],
    ])
  },
})
