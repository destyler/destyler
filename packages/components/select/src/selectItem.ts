import type { PropType, Ref } from 'vue'
import { computed, defineComponent, h, nextTick, onMounted, ref, toRefs } from 'vue'
import { createContext } from '@destyler/shared'
import { DestylerPrimitive, destylerPrimitiveProps } from '@destyler/primitive'
import { useCustomElement, useId } from '@destyler/composition'

import { injectSelectRootContext } from './selectRoot'
import { SelectContentDefaultContextValue, injectSelectContentContext } from './selectContentImpl'
import { SELECTION_KEYS } from './utils'

export const destylerSelectItemProps = {
  ...destylerPrimitiveProps,
  value: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    required: false,
  },
  textValue: {
    type: String as PropType<string>,
    required: true,
  },
}

export interface SelectItemContext {
  value: string | undefined
  textId: string
  disabled: Ref<boolean | undefined> | undefined
  isSelected: Ref<boolean>
  onItemTextChange(node: HTMLElement | undefined): void
}

export const [injectSelectItemContext, provideSelectItemContext] = createContext<SelectItemContext>('DestylerSelectItem')

export const DestylerSelectItem = defineComponent({
  name: 'DestylerSelectItem',
  props: destylerSelectItemProps,
  setup(props) {
    const { disabled } = toRefs(props)

    const rootContext = injectSelectRootContext()
    const contentContext = injectSelectContentContext(SelectContentDefaultContextValue)
    const { customElement, currentElement } = useCustomElement()

    const isSelected = computed(() => rootContext.modelValue?.value === props.value)
    const isFocused = ref(false)
    const textValue = ref(props.textValue ?? '')
    const textId = useId()

    async function handleSelect(ev?: PointerEvent) {
      await nextTick()
      if (ev?.defaultPrevented)
        return

      if (!disabled.value) {
        rootContext.onValueChange(props.value)
        rootContext.onOpenChange(false)
      }
    }

    async function handlePointerMove(event: PointerEvent) {
      await nextTick()
      if (event.defaultPrevented)
        return
      if (disabled.value) {
        contentContext.onItemLeave?.()
      }
      else {
        // even though safari doesn't support this option, it's acceptable
        // as it only means it might scroll a few pixels when using the pointer.
        (event.currentTarget as HTMLElement).focus({ preventScroll: true })
      }
    }

    async function handlePointerLeave(event: PointerEvent) {
      await nextTick()
      if (event.defaultPrevented)
        return
      if (event.currentTarget === document.activeElement)
        contentContext.onItemLeave?.()
    }

    async function handleKeyDown(event: KeyboardEvent) {
      await nextTick()
      if (event.defaultPrevented)
        return
      const isTypingAhead = contentContext.searchRef?.value !== ''
      if (isTypingAhead && event.key === ' ')
        return
      if (SELECTION_KEYS.includes(event.key))
        handleSelect()
      // prevent page scroll if using the space key to select an item
      if (event.key === ' ')
        event.preventDefault()
    }

    if (props.value === '') {
      throw new Error(
        'A <SelectItem /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.',
      )
    }

    onMounted(() => {
      if (!currentElement.value)
        return
      contentContext.itemRefCallback(
        currentElement.value,
        props.value!,
        props.disabled!,
      )
    })

    provideSelectItemContext({
      value: props.value,
      disabled,
      textId,
      isSelected,
      onItemTextChange: (node) => {
        textValue.value = ((textValue.value || node?.textContent) ?? '').trim()
      },
    })

    return {
      customElement,
      textId,
      isFocused,
      isSelected,
      disabled,
      handleSelect,
      handlePointerMove,
      handlePointerLeave,
      handleKeyDown,
    }
  },
  render() {
    return h(DestylerPrimitive, {
      'ref': 'customElement',
      'role': 'option',
      'data-destyler-collection-item': '',
      'aria-labelledby': this.textId,
      'data-highlighted': this.isFocused ? '' : undefined,
      'aria-selected': this.isSelected && this.isFocused,
      'data-state': this.isSelected ? 'checked' : 'unchecked',
      'aria-disabled': this.disabled || undefined,
      'data-disabled': this.disabled ? '' : undefined,
      'tabindex': this.disabled ? undefined : -1,
      'as': this.$props.as,
      'asChild': this.$props.asChild,
      'onFocus': () => {
        this.isFocused = true
      },
      'onBlur': () => {
        this.isFocused = false
      },
      'onPointerup': () => {
        this.handleSelect()
      },
      'onPointermove': (event: any) => {
        this.handlePointerMove(event)
      },
      'onPointerleave': (event: any) => {
        this.handlePointerLeave(event)
      },
      'onKeydown': (event: any) => {
        this.handleKeyDown(event)
      },
    }, this.$slots.default?.())
  },
})
