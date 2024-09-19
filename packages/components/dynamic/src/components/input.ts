import type { PropType } from 'vue'
import { defineComponent, h, nextTick, onMounted, withDirectives, withKeys } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'
import { BindOnceDirective } from '@destyler/directives'

import { injectDynamicRootContext } from './root'

export const dynamicInputProps = {
  ...primitiveProps,
  /**
   * @default input
   */
  as: {
    ...primitiveProps.as,
    default: 'input',
  },
  /**
   * The placeholder character to use for empty tags input.
   */
  placeholder: {
    type: String as PropType<string>,
    required: false,
  },
  /**
   * Focus on element when mounted.
   */
  autoFocus: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  /**
   * Maximum number of character allowed.
   */
  maxLength: {
    type: Number as PropType<number>,
    required: false,
  },
} as const

export type DynamicInputProps = ExtractPublicPropTypes<typeof dynamicInputProps>

export const DynamicInput = defineComponent({
  name: 'DestylerDynamicInput',
  props: dynamicInputProps,
  setup(props) {
    const context = injectDynamicRootContext()
    const { forwardRef, currentElement } = useForwardExpose()

    function handleBlur(event: Event) {
      if (!context.addOnBlur.value)
        return

      const target = event.target as HTMLInputElement
      if (!target.value)
        return

      const isAdded = context.onAddValue(target.value)
      if (isAdded)
        target.value = ''
    }

    function handleTab(event: Event) {
      if (!context.addOnTab.value)
        return

      handleCustomKeydown(event)
    }

    async function handleCustomKeydown(event: Event) {
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
        // make sure all DOM was flush then only capture the focus
        if (props.autoFocus)
          inputEl?.focus()
      }, 1)
    })

    return {
      forwardRef,
      context,
      handleInput,
      handlePaste,
      handleCustomKeydown,
      handleBlur,
      handleTab,
    }
  },
  render() {
    return withDirectives(h(Primitive, {
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
      'onKeydown': [
        withKeys(this.handleCustomKeydown, ['enter']),
        withKeys(this.handleTab, ['tab']),
        this.context.onInputKeydown,
      ],
      'onBlur': (event: any) => {
        this.handleBlur(event)
      },
      'onPaste': (event: any) => {
        this.handlePaste(event)
      },
    }, () => this.$slots.default?.()), [
      [BindOnceDirective, { id: this.context.id?.value }],
    ])
  },
})
