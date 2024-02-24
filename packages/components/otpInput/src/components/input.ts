import type { PropType } from 'vue'
import { computed, defineComponent, h, nextTick, onMounted, onUnmounted, ref, withKeys } from 'vue'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useArrowNavigation } from '@destyler/composition'

import { injectOtpInputRootContext } from './root'

export const destylerOtpInputProps = {
  index: {
    type: Number as PropType<number>,
    required: true,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type DestylerOtpInputProps = ExtractPublicPropTypes<typeof destylerOtpInputProps>

export const DestylerOtpInput = defineComponent({
  name: 'DestylerOtpInput',
  props: destylerOtpInputProps,
  setup(props) {
    const context = injectOtpInputRootContext()
    const inputElements = computed(() => Array.from(context.inputElements!.value))

    const disabled = computed(() => props.disabled || context.disabled.value)
    const isOtpMode = computed(() => context.otp.value)
    const isNumbericMode = computed(() => context.type.value === 'number')
    const isPasswordMode = computed(() => context.mask.value)

    const inputRef = ref()
    function handleInput(event: Event) {
      const target = event.target as HTMLInputElement
      if (isNumbericMode.value && !/^[0-9]*$/.test(target.value)) {
        target.value = target.value.replace(/\D/g, '')
        return
      }

      target.value = target.value.slice(-1)
      updateModelValueAt(props.index, target.value)

      const nextEl = inputElements.value[props.index + 1]
      if (nextEl)
        nextEl.focus()
    }

    function handleKeydown(event: KeyboardEvent) {
      useArrowNavigation(event, document.activeElement as HTMLElement, undefined, {
        itemsArray: inputElements.value,
        focus: true,
        loop: false,
        arrowKeyOptions: 'horizontal',
        dir: context.dir.value,
      })
    }

    function handleBackspace(event: KeyboardEvent) {
      event.preventDefault()
      const target = event.target as HTMLInputElement
      const value = target.value

      if (value) {
        updateModelValueAt(props.index, '')
      }
      else {
        const prevEl = inputElements.value[props.index - 1]
        if (prevEl) {
          prevEl.focus()
          updateModelValueAt(props.index - 1, '')
        }
      }
    }

    function handleDelete(event: KeyboardEvent) {
      if (event.key === 'Delete') {
        event.preventDefault()
        updateModelValueAt(props.index, '')
      }
    }

    function handleFocus(event: FocusEvent) {
      const target = event.target as HTMLInputElement
      target.setSelectionRange(1, 1)

      if (!target.value)
        target.placeholder = ''
    }

    function handleBlur(event: FocusEvent) {
      const target = event.target as HTMLInputElement
      nextTick(() => {
        if (!target.value)
          target.placeholder = context.placeholder.value
      })
    }

    function handlePaste(event: ClipboardEvent) {
      event.preventDefault()
      const clipboardData = event.clipboardData
      if (!clipboardData)
        return

      const tempModelValue = [...context.modelValue.value]
      const values = clipboardData.getData('text')
      const initialIndex = values.length >= inputElements.value.length ? 0 : props.index
      const lastIndex = Math.min(initialIndex + values.length, inputElements.value.length)
      for (let i = initialIndex; i < lastIndex; i++) {
        const input = inputElements.value[i]
        const value = values[i - initialIndex]
        if (isNumbericMode.value && !/^[0-9]*$/.test(value))
          continue

        tempModelValue[i] = value
        input.focus()
      }
      context.modelValue.value = tempModelValue
      inputElements.value[lastIndex]?.focus()
    }

    function updateModelValueAt(index: number, value: string) {
      const tempModelValue = [...context.modelValue.value]
      tempModelValue[index] = value
      context.modelValue.value = tempModelValue
    }

    onMounted(() => {
      context.onInputElementChange(inputRef.value)
    })
    onUnmounted(() => {
      context.inputElements?.value.delete(inputRef.value)
    })

    return {
      inputRef,
      isOtpMode,
      isPasswordMode,
      isNumbericMode,
      context,
      disabled,
      inputElements,
      handleInput,
      handleFocus,
      handleBlur,
      handlePaste,
      handleKeydown,
      handleBackspace,
      handleDelete,
    }
  },
  render() {
    return h('input', {
      'ref': 'inputRef',
      'autocapitalize': 'none',
      'autocomplete': this.isOtpMode ? 'one-time-code' : 'false',
      'type': this.isPasswordMode ? 'password' : 'text',
      'inputmode': this.isNumbericMode ? 'numeric' : 'text',
      'pattern': this.isNumbericMode ? '[0-9]*' : undefined,
      'placeholder': this.context.placeholder.value,
      'value': this.context.modelValue.value.at(this.$props.index),
      'disabled': this.disabled,
      'data-disabled': this.disabled ? '' : undefined,
      'data-complete': this.context.isCompleted.value ? '' : undefined,
      'aria-label': `pin input ${this.$props.index + 1} of ${this.inputElements.length}`,
      'onInput': (event: any) => {
        this.handleInput(event)
      },
      'onKeydown': withKeys((event: any) => {
        switch (event.key) {
          case 'ArrowUp':
          case 'ArrowDown':
          case 'ArrowLeft':
          case 'ArrowRight':
          case 'Home':
          case 'End':
            this.handleKeydown(event)
            break
          case 'Backspace':
            this.handleBackspace(event)
            break
          case 'Delete':
            this.handleDelete(event)
            break
        }
      }, ['left', 'right', 'up', 'down', 'home', 'end', 'backspace', 'delete']),
      'onFocus': (event: any) => {
        this.handleFocus(event)
      },
      'onBlur': (event: any) => {
        this.handleBlur(event)
      },
      'onPaste': (event: any) => {
        this.handlePaste(event)
      },
    }, {
      default: () => this.$slots.default?.(),
    })
  },
})
