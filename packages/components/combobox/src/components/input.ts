import type { PropType } from 'vue'
import { computed, defineComponent, h, onMounted, withKeys } from 'vue'
import { Primitive, primitiveProps } from '@destyler/primitive'
import type { ExtractPublicPropTypes } from '@destyler/shared'
import { useForwardExpose } from '@destyler/composition'

import { injectComboboxRootContext } from './root'

export const comboboxInputProps = {
  ...primitiveProps,
  as: {
    ...primitiveProps.as,
    default: 'input',
  },
  type: {
    type: String as PropType<string>,
    required: false,
    default: 'text',
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  autoFocus: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
} as const

export type ComboboxInputProps = ExtractPublicPropTypes<typeof comboboxInputProps>

export const ComboboxInput = defineComponent({
  name: 'DestylerComboboxInput',
  props: comboboxInputProps,

  setup(props) {
    const rootContext = injectComboboxRootContext()

    const { forwardRef, currentElement } = useForwardExpose()
    onMounted(() => {
      const inputEl = currentElement.value.nodeName === 'INPUT'
        ? currentElement.value as HTMLInputElement
        : currentElement.value.querySelector('input')
      if (!inputEl)
        return

      rootContext.onInputElementChange(inputEl)

      setTimeout(() => {
        if (props.autoFocus)
          inputEl?.focus()
      }, 1)
    })

    const disabled = computed(() => props.disabled || rootContext.disabled.value || false)

    function handleKeyDown(ev: KeyboardEvent) {
      if (!rootContext.open.value)
        rootContext.onOpenChange(true)
      else
        rootContext.onInputNavigation(ev.key === 'ArrowUp' ? 'up' : 'down')
    }

    function handleHomeEnd(ev: KeyboardEvent) {
      if (!rootContext.open.value)
        return
      rootContext.onInputNavigation(ev.key === 'Home' ? 'home' : 'end')
    }

    function handleInput(event: Event) {
      rootContext.searchTerm.value = (event.target as HTMLInputElement)?.value
      if (!rootContext.open.value)
        rootContext.onOpenChange(true)

      rootContext.isUserInputted.value = true
    }
    return {
      disabled,
      rootContext,
      forwardRef,
      handleInput,
      handleKeyDown,
      handleHomeEnd,
    }
  },
  render() {
    return h(Primitive, {
      'ref': (el: any) => this.forwardRef(el),
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'type': this.$props.type,
      'disabled': this.disabled,
      'value': this.rootContext.searchTerm.value,
      'aria-expanded': this.rootContext.open.value,
      'aria-controls': this.rootContext.contentId,
      'aria-disabled': this.disabled ?? undefined,
      'aria-autocomplete': 'list',
      'role': 'combobox',
      'autocomplete': 'false',
      'onInput': (event: any) => {
        this.handleInput(event)
      },
      'onKeydown': withKeys((event: any) => {
        switch (event.key) {
          case 'ArrowUp':
          case 'ArrowDown':
            event.preventDefault()
            this.handleKeyDown(event)
            break
          case 'Home':
          case 'End':
            event.preventDefault()
            this.handleHomeEnd(event)
            break
          case 'Enter':
            this.rootContext.onInputEnter()
            break
        }
      }, ['down', 'up', 'enter', 'home', 'end']),
    }, {
      default: () => this.$slots.default?.(),
    })
  },
})
